import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { CartItem } from '@/shared/context/cart-context';
import type { CheckoutData } from '@/shared/context/checkout-context';

interface OrderRequest {
  checkoutData: CheckoutData
  cartItems: CartItem[]
}

interface WooCommerceOrderLineItem {
  product_id: number
  variation_id?: number
  quantity: number
}

interface WooCommerceOrderBilling {
  first_name: string
  phone: string
  email?: string
}

interface WooCommerceOrderShipping {
  first_name: string
  address_1?: string
  phone?: string
}

interface WooCommerceOrderData {
  payment_method: string
  payment_method_title: string
  set_paid: boolean
  billing: WooCommerceOrderBilling
  shipping?: WooCommerceOrderShipping
  line_items: WooCommerceOrderLineItem[]
  meta_data?: {
    key: string
    value: string
  }[]
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderRequest = await request.json();
    const { checkoutData, cartItems } = body;

    // Validate request data
    if (!checkoutData || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 },
      );
    }

    // Get API configuration
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'https://backend.ultrastore.khizrim.space';
    const apiUrl = `${baseUrl}/wp-json/wc/v3/orders`;

    // Get WooCommerce API credentials from server-side environment variables
    // Try both with and without NEXT_PUBLIC_ prefix for flexibility
    const consumerKey = process.env.WC_CONSUMER_KEY || process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || '';
    const consumerSecret = process.env.WC_CONSUMER_SECRET || process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || '';

    if (!consumerKey || !consumerSecret) {
      console.error('WooCommerce API credentials are not configured');
      console.error('Available env vars:', {
        hasWCKey: !!process.env.WC_CONSUMER_KEY,
        hasNextPublicWCKey: !!process.env.NEXT_PUBLIC_WC_CONSUMER_KEY,
        hasWCSecret: !!process.env.WC_CONSUMER_SECRET,
        hasNextPublicWCSecret: !!process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET,
        baseUrl,
      });

      return NextResponse.json(
        {
          error: 'WooCommerce API credentials are not configured',
          message: 'Please set WC_CONSUMER_KEY and WC_CONSUMER_SECRET in your environment variables',
        },
        { status: 500 },
      );
    }

    // Map payment method to WooCommerce format
    // Note: These payment gateway IDs need to match your WooCommerce payment gateways
    const paymentMethodMap: Record<string, {
      method: string
      title: string
    }> = {
      cash: {
        method: 'cod',
        title: 'Наличными',
      }, // Cash on Delivery
      card: {
        method: 'bacs',
        title: 'Картой в магазине',
      }, // Bank Transfer (can be used for in-store card payment)
      sbp: {
        method: 'sbp',
        title: 'СБП',
      }, // System of Fast Payments (may need custom gateway)
      installment: {
        method: 'bacs',
        title: 'В рассрочку',
      }, // Installment (may need custom gateway)
    };

    const paymentMethod = checkoutData.payment.method || 'cash';
    const paymentInfo = paymentMethodMap[paymentMethod] || paymentMethodMap.cash;

    // Prepare line items
    const lineItems: WooCommerceOrderLineItem[] = cartItems.map((item) => ({
      product_id: item.productId,
      ...(item.variationId ? { variation_id: item.variationId } : {}),
      quantity: item.quantity,
    }));

    // Prepare order data
    const orderData: WooCommerceOrderData = {
      payment_method: paymentInfo.method,
      payment_method_title: paymentInfo.title,
      set_paid: false, // Orders are not paid automatically
      billing: {
        first_name: checkoutData.personal.name,
        phone: checkoutData.personal.phone,
        ...(checkoutData.personal.email ? { email: checkoutData.personal.email } : {}),
      },
      line_items: lineItems,
      meta_data: [
        {
          key: '_delivery_method',
          value: checkoutData.delivery.method,
        },
      ],
    };

    // Add shipping information if delivery method is courier
    if (checkoutData.delivery.method === 'courier') {
      const deliveryPhone = checkoutData.delivery.phone || checkoutData.personal.phone;

      orderData.shipping = {
        first_name: checkoutData.personal.name,
        ...(checkoutData.delivery.address ? { address_1: checkoutData.delivery.address } : {}),
        ...(deliveryPhone ? { phone: deliveryPhone } : {}),
      };

      // Add delivery date and time as meta data
      if (checkoutData.delivery.desiredDate) {
        orderData.meta_data?.push({
          key: '_delivery_date',
          value: checkoutData.delivery.desiredDate,
        });
      }

      if (checkoutData.delivery.desiredTime) {
        orderData.meta_data?.push({
          key: '_delivery_time',
          value: checkoutData.delivery.desiredTime,
        });
      }
    }

    // Create Basic Auth header
    // WooCommerce REST API uses Basic Authentication with consumer key and secret
    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    // Send request to WooCommerce API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      console.error('WooCommerce API error:', errorData);

      return NextResponse.json(
        {
          error: errorData.message || `Failed to create order: ${response.status} ${response.statusText}`,
          details: errorData,
        },
        { status: response.status },
      );
    }

    const order = await response.json();

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error submitting order:', error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit order to WooCommerce' },
      { status: 500 },
    );
  }
}
