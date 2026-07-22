# myFUTURE

Nền tảng bất động sản toàn quốc — clone giao diện và luồng tin tức từ [myfuture.vn/ban-tin](https://myfuture.vn/ban-tin.html).

## Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, TypeScript |
| Backend | NestJS 11, Fastify, Prisma, PostgreSQL |
| Cache / Queue | Redis, BullMQ |
| Infra | Docker Compose, Nginx, GitHub Actions → GHCR → VPS |

## Kiến trúc

```
Browser
   │
   ▼
aaPanel (SSL) ──► Nginx :8090 ──┬──► Next.js client :3721
                                ├──► NestJS API :4721 (/api, /uploads)
                                ├──► PostgreSQL
                                └──► Redis + BullMQ workers
```

## Ports (local dev)

| Service | Port |
|---------|------|
| Client | 3721 |
| Server API | 4721 |
| PostgreSQL | 54321 |
| Redis | 6380 |

## Quick Start (local)

```bash
# 1. Copy env
cp .env.example .env

# 2. Start all services
npm run dev:build

# 3. Truy cập
# Client:  http://localhost:3721/ban-tin
# Admin:   http://localhost:3721/admin/login
# API:     http://localhost:4721/api
# Swagger: http://localhost:4721/api/docs
```

### Dev không dùng Docker cho app

```bash
npm run db:up          # Postgres + Redis
npm run db:migrate
npm run db:seed
npm run server:dev     # :4721
npm run client:dev     # :3721
```

## Staging (VPS)

| Mục | Giá trị |
|-----|---------|
| IP | `116.118.6.129` |
| Domain | `https://myfuture.changtotech.click` |
| App dir trên VPS | `/opt/myfuture` |
| Nginx (Docker) | `127.0.0.1:8090` → aaPanel reverse proxy + SSL |

### Lần đầu setup VPS

```bash
# SSH vào VPS
ssh root@116.118.6.129

# Clone & cấu hình
git clone https://github.com/chang2tech/test-myfuture.git /opt/myfuture
cd /opt/myfuture
cp .env.staging.example .env
nano .env   # Đổi POSTGRES_PASSWORD, JWT_SECRET, DEV_ADMIN_PASSWORD

# Login GHCR (PAT read:packages)
echo "$GITHUB_TOKEN" | docker login ghcr.io -u chang2tech --password-stdin

# Bootstrap (hoặc chạy thủ công từng bước trong deploy/setup-vps.sh)
bash deploy/setup-vps.sh
```

### aaPanel reverse proxy

1. **Website** → thêm site `myfuture.changtotech.click`
2. **DNS**: A record `myfuture.changtotech.click` → `116.118.6.129`
3. **Reverse proxy** → `http://127.0.0.1:8090`
4. Bật **SSL** (Let's Encrypt)

### CI/CD (GitHub Actions)

Push lên `main` → type-check → build Docker images → push GHCR → SSH deploy VPS.

**GitHub Secrets** (`Settings → Secrets → Actions`):

| Secret | Ví dụ |
|--------|-------|
| `VPS_HOST` | `116.118.6.129` |
| `VPS_USER` | `root` |
| `VPS_SSH_KEY` | Private key SSH |
| `VPS_SSH_PORT` | `22` (tuỳ VPS) |
| `NEXT_PUBLIC_SITE_URL` | `https://myfuture.changtotech.click` |
| `NEXT_PUBLIC_API_ORIGIN` | `https://myfuture.changtotech.click` |
| `NEXT_PUBLIC_API_URL` | `https://myfuture.changtotech.click/api` |

**GitHub Variables**:

| Variable | Ví dụ |
|----------|-------|
| `IMAGE_REGISTRY` | `ghcr.io/chang2tech` |

**Environment**: tạo environment `staging` trong repo (optional, dùng cho approval).

### Deploy thủ công trên VPS

```bash
cd /opt/myfuture
git pull origin main
export APP_VERSION=latest
export IMAGE_REGISTRY=ghcr.io/chang2tech
docker compose -f docker-compose.prod.yml pull server client
docker compose -f docker-compose.prod.yml run --rm migrate
docker compose -f docker-compose.prod.yml up -d
curl -s http://127.0.0.1:8090/api/health
```

### Seed database (lần đầu)

```bash
cd /opt/myfuture
docker compose -f docker-compose.prod.yml run --rm server npx prisma db seed
```

## API chính

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/health` | Health check (db + redis) |
| GET | `/api/news` | Danh sách bài viết |
| GET | `/api/news/:slug` | Chi tiết bài viết |
| GET | `/api/news/categories` | Danh mục |
| POST | `/api/auth/login` | Đăng nhập admin |
| POST | `/api/admin/upload` | Upload ảnh bài viết |

## Cấu trúc thư mục

```
test-myfuture/
├── client/                 # Next.js frontend
├── server/                 # NestJS API + Prisma
├── nginx/                  # Nginx config (production)
├── deploy/                 # Script setup VPS
├── scripts/                # Smoke / E2E test scripts
├── docker-compose.yml      # Local development
├── docker-compose.prod.yml # Production / staging
├── .env.example            # Local env template
├── .env.staging.example    # Staging env template
└── .github/workflows/      # CI/CD
```

## Scripts hữu ích

```bash
npm run lint              # ESLint server + client
npm run typecheck         # tsc --noEmit
npm run build             # Build production server + client

# Smoke tests (cần server đang chạy)
node scripts/test-fastify-smoke.mjs
node scripts/test-redis-bullmq.mjs
node scripts/test-admin-create.mjs
node scripts/test-admin-upload.mjs
```

## Upload ảnh

Ảnh admin upload lưu tại `server/uploads/articles/`, phục vụ qua `/uploads/articles/*`.

- **Local**: Next.js rewrite `/uploads/*` → server
- **Production**: Nginx proxy `/uploads/` → NestJS; volume Docker `upload_data` giữ file giữa các deploy

## License

Private — chang2tech
