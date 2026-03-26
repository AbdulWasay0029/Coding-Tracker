# syntax=docker/dockerfile:1

# ── Base Stage ─────────────────────────────────────────────────────────────────
FROM node:20-slim AS base

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ── Dependency Stage ────────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ── Build/Run Stage ─────────────────────────────────────────────────────────────
FROM base
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client (critical for production)
RUN npx prisma generate

# Environment variables (these should also be set in Fly.io secrets)
ENV NODE_ENV=production

# The bot doesn't need to expose ports, but Fly might check for one 
# to determine health. You can disable this in fly.toml later.
# EXPOSE 3000

# Start the bot using tsx (simpler than separate build step for now)
CMD ["npm", "run", "bot:start"]
