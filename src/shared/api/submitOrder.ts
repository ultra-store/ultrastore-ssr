import type { CartItem } from '@/shared/context/cart-context';
import type { CheckoutData } from '@/shared/context/checkout-context';

interface WooCommerceOrderResponse {
  id: number
  status: string
  order_key: string
  billing: {
    first_name: string
    phone: string
    email?: string
  }
  shipping?: {
    first_name: string
    address_1?: string
    phone?: string
  }
  line_items: {
    id: number
    name: string
    product_id: number
    variation_id?: number
    quantity: number
  }[]
  payment_method: string
  payment_method_title: string
  date_created: string
  total: string
}

/**
 * Submit order to WooCommerce via Next.js API route
 * This avoids CORS issues and keeps API credentials secure on the server
 */
export const submitOrder = async (
  checkoutData: CheckoutData,
  cartItems: CartItem[],
): Promise<WooCommerceOrderResponse> => {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checkoutData,
        cartItems,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      throw new Error(
        errorData.error
        || `Failed to create order: ${response.status} ${response.statusText}`,
      );
    }

    const order = await response.json() as WooCommerceOrderResponse;

    return order;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to submit order to WooCommerce');
  }
};
