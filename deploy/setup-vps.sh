#!/usr/bin/env bash
# Bootstrap VPS lần đầu cho myFUTURE staging
# Chạy trên VPS: bash deploy/setup-vps.sh

set -euo pipefail

APP_DIR="${APP_DIR:-/opt/myfuture}"
REPO_URL="${REPO_URL:-https://github.com/chang2tech/test-myfuture.git}"
BRANCH="${BRANCH:-main}"

echo "▶ Installing Docker (if missing)..."
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
fi

echo "▶ Preparing app directory: $APP_DIR"
mkdir -p "$APP_DIR"
cd "$APP_DIR"

if [ ! -d .git ]; then
  git clone "$REPO_URL" .
else
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
  git pull origin "$BRANCH" --ff-only
fi

if [ ! -f .env ]; then
  cp .env.staging.example .env
  echo ""
  echo "⚠️  Đã tạo .env từ .env.staging.example — hãy sửa mật khẩu & JWT_SECRET trước khi deploy!"
  echo "    nano $APP_DIR/.env"
  exit 1
fi

echo "▶ Logging in to GHCR (cần GITHUB_TOKEN export trước)..."
if [ -n "${GITHUB_TOKEN:-}" ]; then
  echo "$GITHUB_TOKEN" | docker login ghcr.io -u "${GITHUB_USER:-chang2tech}" --password-stdin
else
  echo "⚠️  Bỏ qua GHCR login — export GITHUB_TOKEN nếu images private"
fi

echo "▶ Pulling images & starting stack..."
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml run --rm migrate
docker compose -f docker-compose.prod.yml up -d

echo "▶ Seed database (lần đầu)..."
read -r -p "Chạy seed dữ liệu mẫu? [y/N] " RUN_SEED
if [[ "$RUN_SEED" =~ ^[Yy]$ ]]; then
  docker compose -f docker-compose.prod.yml run --rm \
    -e DATABASE_URL="postgresql://${POSTGRES_USER:-myfuture}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB:-myfuture}?schema=public" \
    server npx ts-node prisma/seed.ts
fi

echo ""
echo "✅ Setup xong. Kiểm tra:"
echo "   curl -s http://127.0.0.1:8090/api/health"
echo "   Cấu hình aaPanel reverse proxy → 127.0.0.1:8090 + SSL cho myfuture.changtotech.click"
