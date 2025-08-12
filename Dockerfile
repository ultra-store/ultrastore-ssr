## Base image setup
FROM node:20-alpine AS base
WORKDIR /app

# Enable pnpm via Corepack
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@latest --activate

## Install dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

## Development image (hot reload)
FROM deps AS dev
ENV NODE_ENV=development
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]

## Build image (production build)
FROM deps AS builder
ENV NODE_ENV=production
COPY . .
RUN pnpm build

## Production dependencies (pruned for production)
FROM base AS prod-deps
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

## Final production image (runtime)
FROM base AS prod
ENV NODE_ENV=production
COPY --from=builder /app/.next /app/.next
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY package.json ./
EXPOSE 3000
CMD ["pnpm", "start"]
