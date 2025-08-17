# UltraStore - Фронтенд

Next.js витрина магазина, работающая через WooCommerce REST API.

## Быстрый старт

```bash
npm install
npm run dev     # http://localhost:3000
```

## Требования

* Node.js ≥ 18
* npm

## Переменные окружения

```bash
cp .env.example .env
```

Основные переменные:
- `WORDPRESS_SITE_URL` — канонический базовый URL WordPress/WooCommerce (например, `http://localhost:8080`).
  Фронтенд автоматически использует его как `NEXT_PUBLIC_WOOCOMMERCE_URL` при сборке.
- `NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY` — Consumer Key для WooCommerce REST API
- `NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET` — Consumer Secret для WooCommerce REST API

## Команды

```bash
npm run dev    # Запуск разработки
npm run build  # Сборка для продакшена
npm run start  # Запуск собранного приложения
npm run lint   # Проверка кода
```
