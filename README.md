# myFUTURE

Nền tảng bất động sản toàn quốc — clone [myfuture.vn/ban-tin](https://myfuture.vn/ban-tin.html).

## Tech Stack

- **Client:** Next.js 16, React 19, Tailwind CSS 4, TypeScript
- **Server:** NestJS 11, Prisma, PostgreSQL, BullMQ, Redis, Swagger
- **Infra:** Docker Compose

## Ports (custom — tránh xung đột)

| Service    | Port  |
|------------|-------|
| Client     | 3721  |
| Server API | 4721  |
| PostgreSQL | 54321 |
| Redis      | 6380  |

## Quick Start

```bash
# 1. Copy env
cp .env.example .env

# 2. Start all services (Postgres, Redis, migrate, seed, server, client)
npm run dev:build

# 3. Access
# Client:  http://localhost:3721/ban-tin
# API:     http://localhost:4721/api
# Swagger: http://localhost:4721/api/docs
```

## Local Development (without Docker for app)

```bash
# Start DB only
npm run db:up

# Migrate & seed
npm run db:migrate
npm run db:seed

# Run server & client separately
npm run server:dev   # :4721
npm run client:dev   # :3721
```

## API Endpoints

| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| GET    | `/api/health`         | Health check          |
| GET    | `/api/news/stats`     | Thống kê thị trường   |
| GET    | `/api/news/categories`| Danh mục tin tức      |
| GET    | `/api/news/featured`  | Bài viết nổi bật      |
| GET    | `/api/news`           | Danh sách bài viết    |
| GET    | `/api/news/:slug`     | Chi tiết bài viết     |
| GET    | `/api/projects/featured` | Dự án nổi bật      |

## Project Structure

```
my-future/
├── client/          # Next.js frontend
├── server/          # NestJS backend
├── docker-compose.yml
└── .env.example
```
