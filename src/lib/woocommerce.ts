import axios, { AxiosInstance } from 'axios';
import {
  WooCommerceProduct,
  WooCommerceOrder,
  CreateOrderPayload
} from '@/types/woocommerce';

import crypto from 'crypto-js';

interface WooCommerceConfig {
  url: string;
  consumerKey: string;
  consumerSecret: string;
}

class WooCommerceAPI {
  private api: AxiosInstance;
  private config: WooCommerceConfig;

  constructor(config: WooCommerceConfig) {
    this.config = config;
    
    this.api = axios.create({
      baseURL: `${config.url}/wp-json/wc/v3`,
      timeout: 10000,
    });

    // Добавляем OAuth авторизацию для каждого запроса
    this.api.interceptors.request.use((config) => {
      const fullUrl = `${this.config.url}/wp-json/wc/v3${config.url}`;
      const isHttps = this.config.url.startsWith('https://');
      const baseParams = config.params || {};

      // Если сайт доступен по HTTPS — используем query-параметры consumer_key/consumer_secret.
      // Для HTTP — используем OAuth 1.0 подпись.
      if (isHttps) {
        config.params = {
          ...baseParams,
          consumer_key: this.config.consumerKey,
          consumer_secret: this.config.consumerSecret,
        };
      } else {
        const auth = this.generateOAuthSignature(
          config.method?.toUpperCase() || 'GET',
          fullUrl,
          baseParams
        );
        config.params = {
          ...baseParams,
          ...auth,
        };
      }
      
      return config;
    });

    // Обработка ответов
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('WooCommerce API Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  private generateOAuthSignature(method: string, url: string, params: Record<string, string | number> = {}) {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = crypto.lib.WordArray.random(32).toString();

    const oauthParams: Record<string, string | number> = {
      oauth_consumer_key: this.config.consumerKey,
      oauth_nonce: nonce,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_version: '1.0',
      ...params
    };

    // Сортируем параметры
    const sortedParams = Object.keys(oauthParams)
      .sort()
      .map((key) => `${key}=${encodeURIComponent(String(oauthParams[key]))}`)
      .join('&');

    // Создаем базовую строку для подписи
    const baseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;

    // Создаем ключ для подписи
    const signingKey = `${encodeURIComponent(this.config.consumerSecret)}&`;

    // Генерируем подпись
    const signature = crypto.HmacSHA1(baseString, signingKey).toString(crypto.enc.Base64);

    return {
      oauth_consumer_key: this.config.consumerKey,
      oauth_nonce: nonce,
      oauth_signature: signature,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_version: '1.0'
    };
  }

  // Получение списка товаров
  async getProducts(params: {
    page?: number;
    per_page?: number;
    search?: string;
    category?: string;
    tag?: string;
    featured?: boolean;
    on_sale?: boolean;
    status?: string;
  } = {}): Promise<WooCommerceProduct[]> {
    const response = await this.api.get('/products', { params });
    return response.data;
  }

  // Получение товара по ID
  async getProduct(id: number): Promise<WooCommerceProduct> {
    const response = await this.api.get(`/products/${id}`);
    return response.data;
  }

  // Получение товара по slug
  async getProductBySlug(slug: string): Promise<WooCommerceProduct | null> {
    const response = await this.api.get('/products', {
      params: { slug }
    });
    return response.data[0] || null;
  }

  // Получение категорий
  async getCategories() {
    const response = await this.api.get('/products/categories');
    return response.data;
  }

  // Создание заказа
  async createOrder(orderData: CreateOrderPayload): Promise<WooCommerceOrder> {
    const response = await this.api.post('/orders', orderData);
    return response.data;
  }

  // Получение заказа по ID
  async getOrder(id: number): Promise<WooCommerceOrder> {
    const response = await this.api.get(`/orders/${id}`);
    return response.data;
  }

  // Получение списка заказов
  async getOrders(params: {
    page?: number;
    per_page?: number;
    status?: string;
    customer?: number;
  } = {}): Promise<WooCommerceOrder[]> {
    const response = await this.api.get('/orders', { params });
    return response.data;
  }

  // Проверка подключения к API
  async testConnection(): Promise<boolean> {
    try {
      await this.api.get('/products', { params: { per_page: 1 } });
      return true;
    } catch (error) {
      console.error('WooCommerce connection test failed:', error);
      return false;
    }
  }
}

// Создаем экземпляр API клиента
const isServer = typeof window === 'undefined';
const resolvedBaseUrl = isServer
  ? (process.env.INTERNAL_WOOCOMMERCE_URL || process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || 'https://wp.ultrastore.khizrim.online')
  : (process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || '');

const woocommerceConfig: WooCommerceConfig = {
  url: resolvedBaseUrl || 'https://wp.ultrastore.khizrim.online',
  consumerKey: process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY || '',
  consumerSecret: process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET || ''
};

export const woocommerce = new WooCommerceAPI(woocommerceConfig);

// Хелперы для работы с ценами
export const formatPrice = (price: string | number, currency: string = 'RUB'): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency,
  }).format(numPrice);
};

// Хелпер для работы с изображениями
export const getProductImage = (product: WooCommerceProduct): string => {
  if (product.images && product.images.length > 0) {
    return product.images[0].src;
  }
  return '/placeholder-product.svg'; // fallback изображение
};

export default woocommerce;