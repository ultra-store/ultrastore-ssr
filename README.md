# UltraStore Storefront (Next.js)

Modern React-based storefront that consumes WooCommerce’s REST API and renders blazing-fast, SEO-friendly pages.

## 🚀 Quick start

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## 🛠 Requirements

* Node.js ≥ 18
* pnpm ≥ 8 (or npm/yarn if you prefer)

## 🔐 Environment variables

Copy the sample file and adjust:

```bash
cp .env.example .env
```

Key variables:

| Variable                    | Description                              |
| --------------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_WP_API_URL`    | URL of the WordPress REST endpoint       |
| `NEXT_PUBLIC_PUBLIC_URL`    | Public URL of this storefront            |
| `NEXT_PUBLIC_MOYSKLAD_TOKEN`| API token for «Мой Склад» (optional)     |

## 📜 Useful scripts

| Command        | Purpose                                     |
| -------------- | ------------------------------------------- |
| `pnpm dev`     | Start dev server with hot reload            |
| `pnpm build`   | Create production build                     |
| `pnpm start`   | Run built app                               |
| `pnpm lint`    | Lint all source files with ESLint           |

## 🐳 Docker

Build & run a production container:

```bash
docker build -t ultrastore/front .
docker run -p 3000:3000 ultrastore/front
```

## 📦 Deployment

The project is a standard Next.js app and can be deployed to Vercel, Netlify, traditional Node hosting, or any Docker-compatible platform.
