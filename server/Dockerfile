FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl wget

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM base AS development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
EXPOSE 4721
CMD ["npm", "run", "start:dev"]

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
RUN test -f dist/main.js

FROM base AS production
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
RUN npx prisma generate
EXPOSE 4721
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4721/api/health || exit 1
CMD ["node", "dist/main.js"]
