# UltraStore - Фронтенд

Next.js витрина магазина, работающая через WooCommerce REST API.

## Быстрый старт

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Требования

* Node.js ≥ 18
* pnpm ≥ 8

## Переменные окружения

```bash
cp .env.example .env
```

Основные переменные:
- `NEXT_PUBLIC_WP_API_URL` - URL WordPress REST API
- `NEXT_PUBLIC_PUBLIC_URL` - Публичный URL витрины

## Команды

```bash
pnpm dev       # Запуск разработки
pnpm build     # Сборка для продакшена
pnpm start     # Запуск собранного приложения
pnpm lint      # Проверка кода
```
