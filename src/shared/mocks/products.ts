import type { Product, Category } from '@/shared/types/types';

/**
 * Mock category data
 */
export const mockCategories: Record<string, Category> = {
  smartfony: {
    id: 1,
    name: 'Смартфоны',
    slug: 'smartfony',
    description: 'Современные смартфоны от ведущих производителей',
    count: 6,
    image: '/placeholder-product.png',
    link: '/category/smartfony',
  },
  noutbuki: {
    id: 2,
    name: 'Ноутбуки',
    slug: 'noutbuki',
    description: 'Ноутбуки для работы и развлечений',
    count: 4,
    image: '/placeholder-product.png',
    link: '/category/noutbuki',
  },
  odezhda: {
    id: 3,
    name: 'Одежда',
    slug: 'odezhda',
    description: 'Модная одежда для мужчин и женщин',
    count: 4,
    image: '/placeholder-product.png',
    link: '/category/odezhda',
  },
  dom: {
    id: 4,
    name: 'Дом и сад',
    slug: 'dom',
    description: 'Товары для дома и сада',
    count: 4,
    image: '/placeholder-product.png',
    link: '/category/dom',
  },
  sport: {
    id: 5,
    name: 'Спорт',
    slug: 'sport',
    description: 'Спортивные товары и аксессуары',
    count: 4,
    image: '/placeholder-product.png',
    link: '/category/sport',
  },
  knigi: {
    id: 6,
    name: 'Книги',
    slug: 'knigi',
    description: 'Художественная и учебная литература',
    count: 3,
    image: '/placeholder-product.png',
    link: '/category/knigi',
  },
};

/**
 * Mock product data for different categories
 */
export const mockProducts: Record<string, Product[]> = {
  smartfony: [
    {
      id: 1,
      name: 'Смартфон Samsung Galaxy S24',
      slug: 'samsung-galaxy-s24',
      price: '89990',
      regular_price: '99990',
      sale_price: '89990',
      on_sale: true,
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/samsung-galaxy-s24',
      rating: 4.8,
      rating_count: 156,
      in_stock: true,
    },
    {
      id: 2,
      name: 'Ноутбук MacBook Air M3',
      slug: 'macbook-air-m3',
      price: '129990',
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/macbook-air-m3',
      rating: 4.9,
      rating_count: 89,
      in_stock: true,
    },
    {
      id: 3,
      name: 'Наушники Sony WH-1000XM5',
      slug: 'sony-wh-1000xm5',
      price: '34990',
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/sony-wh-1000xm5',
      rating: 4.7,
      rating_count: 234,
      in_stock: true,
    },
    {
      id: 4,
      name: 'Планшет iPad Air 5',
      slug: 'ipad-air-5',
      price: '59990',
      regular_price: '64990',
      sale_price: '59990',
      on_sale: true,
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/ipad-air-5',
      rating: 4.6,
      rating_count: 178,
      in_stock: true,
    },
    {
      id: 5,
      name: 'Умные часы Apple Watch Series 9',
      slug: 'apple-watch-series-9',
      price: '44990',
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/apple-watch-series-9',
      rating: 4.5,
      rating_count: 312,
      in_stock: true,
    },
    {
      id: 6,
      name: 'Игровая консоль PlayStation 5',
      slug: 'playstation-5',
      price: '59990',
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/playstation-5',
      rating: 4.8,
      rating_count: 445,
      in_stock: false,
    },
  ],
  noutbuki: [
    {
      id: 2,
      name: 'Ноутбук MacBook Air M3',
      slug: 'macbook-air-m3',
      price: '129990',
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/macbook-air-m3',
      rating: 4.9,
      rating_count: 89,
      in_stock: true,
    },
    {
      id: 3,
      name: 'Ноутбук Dell XPS 13',
      slug: 'dell-xps-13',
      price: '99990',
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/dell-xps-13',
      rating: 4.7,
      rating_count: 156,
      in_stock: true,
    },
    {
      id: 4,
      name: 'Ноутбук Lenovo ThinkPad X1',
      slug: 'lenovo-thinkpad-x1',
      price: '149990',
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/lenovo-thinkpad-x1',
      rating: 4.6,
      rating_count: 78,
      in_stock: true,
    },
    {
      id: 5,
      name: 'Ноутбук ASUS ROG Strix',
      slug: 'asus-rog-strix',
      price: '119990',
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/asus-rog-strix',
      rating: 4.5,
      rating_count: 234,
      in_stock: true,
    },
  ],
  odezhda: [
    {
      id: 7,
      name: 'Куртка зимняя мужская',
      slug: 'mens-winter-jacket',
      price: '12990',
      regular_price: '15990',
      sale_price: '12990',
      on_sale: true,
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/mens-winter-jacket',
      rating: 4.3,
      rating_count: 67,
      in_stock: true,
    },
    {
      id: 8,
      name: 'Платье женское вечернее',
      slug: 'womens-evening-dress',
      price: '8990',
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/womens-evening-dress',
      rating: 4.6,
      rating_count: 123,
      in_stock: true,
    },
    {
      id: 9,
      name: 'Джинсы классические',
      slug: 'classic-jeans',
      price: '5990',
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/classic-jeans',
      rating: 4.4,
      rating_count: 89,
      in_stock: true,
    },
    {
      id: 10,
      name: 'Свитер шерстяной',
      slug: 'wool-sweater',
      price: '7990',
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/wool-sweater',
      rating: 4.2,
      rating_count: 45,
      in_stock: true,
    },
  ],
  dom: [
    {
      id: 11,
      name: 'Кофемашина Nespresso',
      slug: 'nespresso-coffee-machine',
      price: '24990',
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/nespresso-coffee-machine',
      rating: 4.7,
      rating_count: 156,
      in_stock: true,
    },
    {
      id: 12,
      name: 'Пылесос Dyson V15',
      slug: 'dyson-v15-vacuum',
      price: '59990',
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/dyson-v15-vacuum',
      rating: 4.8,
      rating_count: 234,
      in_stock: true,
    },
    {
      id: 13,
      name: 'Микроволновка Samsung',
      slug: 'samsung-microwave',
      price: '18990',
      regular_price: '21990',
      sale_price: '18990',
      on_sale: true,
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/samsung-microwave',
      rating: 4.5,
      rating_count: 178,
      in_stock: true,
    },
    {
      id: 14,
      name: 'Утюг Philips PerfectCare',
      slug: 'philips-perfectcare-iron',
      price: '8990',
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/philips-perfectcare-iron',
      rating: 4.4,
      rating_count: 89,
      in_stock: true,
    },
  ],
  sport: [
    {
      id: 15,
      name: 'Беговые кроссовки Nike Air Max',
      slug: 'nike-air-max-running',
      price: '12990',
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/nike-air-max-running',
      rating: 4.6,
      rating_count: 267,
      in_stock: true,
    },
    {
      id: 16,
      name: 'Велосипед горный Trek',
      slug: 'trek-mountain-bike',
      price: '89990',
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/trek-mountain-bike',
      rating: 4.8,
      rating_count: 45,
      in_stock: true,
    },
    {
      id: 17,
      name: 'Гантели разборные 20кг',
      slug: 'adjustable-dumbbells-20kg',
      price: '15990',
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/adjustable-dumbbells-20kg',
      rating: 4.3,
      rating_count: 123,
      in_stock: true,
    },
    {
      id: 18,
      name: 'Йога-мат Premium',
      slug: 'premium-yoga-mat',
      price: '3990',
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/premium-yoga-mat',
      rating: 4.5,
      rating_count: 89,
      in_stock: true,
    },
  ],
  knigi: [
    {
      id: 19,
      name: 'Книга "Война и мир" Л.Н. Толстой',
      slug: 'war-and-peace-tolstoy',
      price: '1290',
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/war-and-peace-tolstoy',
      rating: 4.9,
      rating_count: 456,
      in_stock: true,
    },
    {
      id: 20,
      name: 'Учебник английского языка',
      slug: 'english-textbook',
      price: '2990',
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/english-textbook',
      rating: 4.4,
      rating_count: 234,
      in_stock: true,
    },
    {
      id: 21,
      name: 'Детская книга "Маленький принц"',
      slug: 'little-prince-children',
      price: '890',
      currency: '₽',
      image: '/placeholder-product.png',
      link: '/product/little-prince-children',
      rating: 4.8,
      rating_count: 178,
      in_stock: true,
    },
  ],
};

/**
 * Get mock products for a specific category
 * @param category - Category slug
 * @param limit - Maximum number of products to return (optional)
 * @returns Array of products for the category
 */
export function getMockProductsByCategory(category: string, limit?: number): Product[] {
  // Try exact match first
  let products = mockProducts[category];

  // If no exact match, try case-insensitive match
  if (!products) {
    const lowerCategory = category.toLowerCase();
    const matchingKey = Object.keys(mockProducts).find((key) =>
      key.toLowerCase() === lowerCategory,
    );

    if (matchingKey) {
      products = mockProducts[matchingKey];
    }
  }

  // If still no match, return empty array
  products = products || [];

  return limit ? products.slice(0, limit) : products;
}

/**
 * Get all available mock products
 * @returns Array of all products from all categories
 */
export function getAllMockProducts(): Product[] {
  return Object.values(mockProducts).flat();
}

/**
 * Get random mock products
 * @param count - Number of random products to return
 * @returns Array of random products
 */
export function getRandomMockProducts(count: number): Product[] {
  const allProducts = getAllMockProducts();
  const shuffled = [...allProducts].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, count);
}

/**
 * Mock API response that matches the real endpoint structure
 * @param categorySlug - Category slug from URL
 * @param options - Query options (page, per_page, etc.)
 * @returns Mock API response matching real endpoint
 */
export function getMockCategoryData(
  categorySlug: string,
  options: {
    page?: number
    per_page?: number
    orderby?: string
    min_price?: number
    max_price?: number
    in_stock?: boolean
    on_sale?: boolean
  } = {},
) {
  const {
    page = 1,
    per_page = 12,
    orderby = 'date',
    min_price,
    max_price,
    in_stock,
    on_sale,
  } = options;

  // Get category info
  const category = mockCategories[categorySlug];

  if (!category) {
    throw new Error(`Category '${categorySlug}' not found`);
  }

  // Get products for this category
  let products = mockProducts[categorySlug] || [];

  // Apply filters
  if (min_price !== undefined) {
    products = products.filter((p) => parseFloat(p.price) >= min_price);
  }
  if (max_price !== undefined) {
    products = products.filter((p) => parseFloat(p.price) <= max_price);
  }
  if (in_stock !== undefined) {
    products = products.filter((p) => p.in_stock === in_stock);
  }
  if (on_sale !== undefined) {
    products = products.filter((p) => p.on_sale === on_sale);
  }

  // Apply sorting
  switch (orderby) {
    case 'price':
      products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      break;
    case 'price-desc':
      products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      break;
    case 'rating':
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'popularity':
      products.sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0));
      break;
    default: // date
      products.sort((a, b) => b.id - a.id); // Mock date sorting by ID
  }

  // Apply pagination
  const total = products.length;
  const totalPages = Math.ceil(total / per_page);
  const startIndex = (page - 1) * per_page;
  const endIndex = startIndex + per_page;
  const paginatedProducts = products.slice(startIndex, endIndex);

  return {
    category,
    products: paginatedProducts,
    page,
    per_page,
    total,
    total_pages: totalPages,
    has_more: page < totalPages,
  };
}
