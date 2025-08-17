# Multi-stage Dockerfile for Next.js production runtime
# Uses Debian slim to avoid Alpine musl issues with native deps

FROM node:20-slim AS base
WORKDIR /app

# Install system deps often required by Next.js/SWC/native addons
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
      ca-certificates \
      curl \
      git \
      openssh-client \
    && rm -rf /var/lib/apt/lists/*

FROM base AS deps
COPY package*.json ./.npmrc ./
# Install all deps for building
RUN npm ci

FROM deps AS builder
# Build-time public env for Next.js (inlined at build time)
ARG NEXT_PUBLIC_WOOCOMMERCE_URL
ENV NEXT_PUBLIC_WOOCOMMERCE_URL=${NEXT_PUBLIC_WOOCOMMERCE_URL}

COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production

# Install only production dependencies to keep image slim
COPY package*.json ./.npmrc ./
RUN npm ci --omit=dev

# Copy Next.js build artifacts and public assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Ensure Next binds to all interfaces
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
EXPOSE 3000

# Healthcheck: wait for Next.js to respond
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "require('http').get({host:'127.0.0.1',port:process.env.PORT,path:'/'},r=>process.exit(r.statusCode<500?0:1)).on('error',()=>process.exit(1))"

CMD ["npm", "run", "start", "--", "-H", "0.0.0.0", "-p", "3000"]


