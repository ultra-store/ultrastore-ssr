## Base
FROM node:20-alpine AS base
WORKDIR /app

# Enable pnpm via Corepack (lockfile v9 expects pnpm 9)
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

## Dependencies (with dev deps for building)
FROM base AS deps
ENV NODE_ENV=development
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

## Dev image (hot reload)
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]

## Build image
FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN pnpm build

## Production deps (pruned)
FROM base AS prod-deps
ENV NODE_ENV=production
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

## Production runtime
FROM base AS prod
ENV NODE_ENV=production
COPY --from=builder /app/.next /app/.next
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY package.json ./
EXPOSE 3000
CMD ["pnpm", "start"]
