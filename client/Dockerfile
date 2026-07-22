FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM base AS development
ARG NEXT_PUBLIC_API_URL=http://localhost:4721/api
ARG NEXT_PUBLIC_API_ORIGIN=http://localhost:4721
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3721
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_ORIGIN=$NEXT_PUBLIC_API_ORIGIN
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3721
CMD ["npm", "run", "dev", "--", "-p", "3721", "-H", "0.0.0.0"]

FROM base AS builder
ARG NEXT_PUBLIC_API_URL=http://localhost:4721/api
ARG NEXT_PUBLIC_API_ORIGIN=http://localhost:4721
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3721
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_ORIGIN=$NEXT_PUBLIC_API_ORIGIN
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS production
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3721
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3721
CMD ["node", "server.js"]
