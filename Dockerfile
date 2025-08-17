##
## Base image with pnpm enabled
##
FROM node:18-alpine AS base
# Helpful for native deps like sharp on Alpine
RUN apk add --no-cache libc6-compat
# Enable pnpm via Corepack (bundled with Node 18)
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

##
## Pre-fetch dependencies into a global content-addressable store (great for caching)
##
FROM base AS deps
WORKDIR /app
# Only copy files needed to resolve deps
COPY package.json pnpm-lock.yaml .npmrc* ./
# Create the pnpm store from the lockfile (no node_modules yet)
RUN pnpm fetch

##
## Build the app
##
FROM base AS builder
WORKDIR /app

# Bring in the cached pnpm store from the previous stage
COPY --from=deps /pnpm /pnpm
# Copy lockfiles + manifest first for better layer caching
COPY package.json pnpm-lock.yaml .npmrc* ./

# Now copy the app sources
COPY src ./src
COPY public ./public
COPY next.config.* .
COPY tsconfig.json .
COPY postcss.config.mjs .
COPY tailwind.config.js .

# Install deps from the offline store strictly per lockfile
RUN pnpm install --offline --frozen-lockfile

# ---- Build-time envs (Next.js needs them during build) ----
ARG NEXT_PUBLIC_WOOCOMMERCE_URL
ENV NEXT_PUBLIC_WOOCOMMERCE_URL=${NEXT_PUBLIC_WOOCOMMERCE_URL}
ARG NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY
ENV NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=${NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY}
ARG NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET
ENV NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=${NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET}

# If you want to disable telemetry at build time, uncomment:
# ENV NEXT_TELEMETRY_DISABLED=1

# Build (requires next.config with output: 'standalone')
RUN pnpm build

##
## Production runtime (no pnpm or node_modules needed; we use Next standalone output)
##
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Re-declare runtime envs (can be overridden at 'docker run' time)
ARG NEXT_PUBLIC_WOOCOMMERCE_URL
ENV NEXT_PUBLIC_WOOCOMMERCE_URL=${NEXT_PUBLIC_WOOCOMMERCE_URL}
ARG NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY
ENV NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=${NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY}
ARG NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET
ENV NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=${NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET}

# If you want to disable telemetry at runtime, uncomment:
# ENV NEXT_TELEMETRY_DISABLED=1

# Static files & standalone server
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# server.js is at /app/server.js inside the standalone output
CMD ["node", "server.js"]
