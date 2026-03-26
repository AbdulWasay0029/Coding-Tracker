# syntax=docker/dockerfile:1

FROM node:20-slim AS base
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# ── Deps stage: copy prisma BEFORE npm ci so postinstall can run prisma generate ──
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci

# ── Final stage ────────────────────────────────────────────────────────────────
FROM base
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Re-generate prisma client with full source available
RUN npx prisma generate

ENV NODE_ENV=production
EXPOSE 7860

CMD ["npm", "run", "bot:start"]
