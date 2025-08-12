# Base
FROM node:20-alpine AS base
WORKDIR /app

# Dependencies layer
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Dev image (hot reload)
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]

# Build image
FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN pnpm build

# Production runtime
FROM base AS prod
ENV NODE_ENV=production
COPY --from=builder /app/.next /app/.next
COPY --from=deps /app/node_modules /app/node_modules
COPY package.json pnpm-lock.yaml ./
EXPOSE 3000
CMD ["pnpm", "start"]
