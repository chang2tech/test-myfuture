Kiến trúc: 3 lớp
1. ImageWithSkeleton — wrapper chính cho mọi ảnh public
File: client/src/components/ui/image-with-skeleton.tsx

Đây là component bắt buộc khi render ảnh trên site (cards, gallery, prose blocks, hero sections…). Nó bọc next/image và quản lý trạng thái load:


image-with-skeleton.tsx
Lines 69-106
  return (
    <div
      ref={containerRef}
      className={cn(
        'overflow-hidden bg-[#ececec]',
        layout === 'fill' ? 'absolute inset-0 h-full w-full' : cn('relative w-full', ASPECT_CLASS[aspectRatio]),
        rounded,
        className,
      )}
    >
      {!error && <ImageSkeleton exiting={loaded} />}
      {error ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#ececec] px-3 text-center">
          <span className="text-[10px] font-medium text-gray-400">Image unavailable</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          ...
          style={{
            opacity: loaded ? 1 : 0,
            filter: loaded ? 'blur(0px)' : 'blur(6px)',
            transform: loaded ? 'scale(1)' : 'scale(1.02)',
            transition: `opacity 0.55s ..., filter 0.65s ..., transform 0.65s ...`,
          }}
        />
      )}
    </div>
  );
Luồng hoạt động:

Ban đầu loaded = false → hiện ImageSkeleton, ảnh opacity: 0 + blur nhẹ.
onLoad (hoặc ảnh đã cache: img.complete) → loaded = true.
Skeleton nhận exiting={true} → fade out; ảnh fade in + bỏ blur (kiểu “reveal”).
Lỗi → skeleton ẩn, hiện “Image unavailable”.
Props thường dùng:

layout: 'aspect' (mặc định, có aspectRatio) hoặc 'fill' (parent relative + chiều cao cố định).
aspectRatio: 3/2, 16/9, 4/3, 1/1, …
sizes, priority, rounded, imageClassName (hover scale, v.v.)
key={props.src} trên wrapper để reset state khi đổi ảnh (gallery carousel).

2. ImageSkeleton — placeholder chuyên cho ảnh
File: client/src/components/ui/image-skeleton.tsx

Placeholder xám + shimmer quét ngang (comment trong code: kiểu MoMo/ZaloPay):

Lớp nền: gradient chạy (image-skeleton-flow)
Lớp sóng: ::after quét (image-skeleton-sweep)
Khi load xong: class image-skeleton-exit → opacity: 0 trong ~0.45s
CSS trong client/src/app/globals.css (khoảng dòng 278–360), có biến thể dark mode.

3. Skeleton — generic, không dùng cho ảnh
File: client/src/components/ui/skeleton.tsx

Shimmer chung (skeleton-shimmer) với accent gold nhẹ — hiện không được import ở component nào trong src/; chỉ có sẵn cho text/layout placeholder sau này.

Nơi dùng ImageWithSkeleton
Khoảng 30+ component public, ví dụ:

Ngữ cảnh	File
Project cards / gallery
project-card.tsx, project-detail-gallery.tsx
News cards / article body
news-article-card.tsx, news-detail-blocks.tsx
Home, about, team, careers
featured-projects-section.tsx, about-section.tsx, team-overview-section.tsx, …
Services
services-delivery-section.tsx, service-handover-preview.tsx
Ví dụ card project — layout="fill" trong container có chiều cao cố định:


project-card.tsx
Lines 16-23
      <div className="relative w-full h-36 sm:h-32 overflow-hidden">
        <ImageWithSkeleton
          layout="fill"
          src={project.image}
          alt={project.imageAlt}
          sizes="(max-width: 640px) 50vw, 33vw"
          imageClassName="group-hover:scale-105 transition-transform duration-500"
        />
Accessibility & motion
Trong globals.css, @media (prefers-reduced-motion: reduce) tắt animation của .image-skeleton và transition exit — skeleton biến mất ngay, vẫn giữ UX không nhấp nháy.

Admin
Form admin (ImageUploadField) dùng next/image preview trực tiếp, không qua ImageWithSkeleton — skeleton chỉ áp dụng cho public site.

Tóm lại: Mọi ảnh nội dung public đi qua ImageWithSkeleton → placeholder ImageSkeleton (shimmer xám) → next/image reveal mượt (opacity + deblur). Không dùng blurDataURL / placeholder="blur" của Next.js.



ssh -p 24700 -i $env:USERPROFILE\.ssh\kantek_deploy root@103.72.97.188



Phân tích thông tin bạn gửi
Mục	Giá trị	Ý nghĩa
Domain
staging.kan-tek.com
Đúng domain
IP
158.106.137.107
Server cũ (cPanel)
User
stagingkantek
Hosting cPanel cũ
Web Kan-Tek hiện tại đang deploy trên VPS mới:

Mục	Giá trị
IP
103.72.97.188
Panel
aaPanel
App
Docker, port 8090
Nếu DNS của staging.kan-tek.com trỏ về 158.106.137.107 → traffic vào server cũ (cPanel), không vào app Docker trên 103.72.97.188.

Cần làm gì để domain trỏ đúng web hiện tại
Bước 1 — Sửa DNS (quan trọng nhất)
Tại nơi quản lý DNS (registrar hoặc Cloudflare):

A record:  staging.kan-tek.com  →  103.72.97.188
Không dùng 158.106.137.107.

Kiểm tra sau khi sửa:

nslookup staging.kan-tek.com
Phải trả về 103.72.97.188.

Bước 2 — Cấu hình trên aaPanel (VPS mới)
Trên 103.72.97.188:

Website → thêm site staging.kan-tek.com
Reverse proxy → http://127.0.0.1:8090
Bật SSL (Let's Encrypt) cho HTTPS
Bước 3 — Kiểm tra .env trên VPS
CLIENT_URL=https://staging.kan-tek.com
CORS_ORIGINS=https://staging.kan-tek.com
cPanel account kia dùng để làm gì?
Account stagingkantek@158.106.137.107 chỉ là hosting cũ — trước đây dự định deploy PM2 nhưng đã bỏ vì Node.js không chạy được trên CentOS 7 đó.

Không cần dùng cPanel đó cho deploy hiện tại
Có thể giữ hoặc hủy tùy bạn — miễn DNS không trỏ về IP cũ
Tóm lại
Câu hỏi	Trả lời
Có cPanel account = domain đã trỏ đúng web hiện tại?
Không
IP cần trỏ
103.72.97.188 (không phải 158.106.137.107)
Truy cập tạm không cần domain
http://103.72.97.188:8090 (đang dùng được)
Truy cập bằng domain + HTTPS
DNS → 103.72.97.188 + reverse proxy trên aaPanel
Bạn có thể kiểm tra DNS hiện tại bằng https://dnschecker.org với domain staging.kan-tek.com — nếu vẫn thấy 158.106.137.107 thì chưa trỏ đúng.


cd /home/administrator/kan-tek
# Đọc biến DB từ .env
export $(grep -E '^(DB_USER|DB_PASSWORD|DB_NAME)=' .env | xargs)
docker run --rm \
  --network kan-tek-network \
  -v "$(pwd)/server:/app" \
  -w /app \
  -e DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}" \
  -e DEV_ADMIN_EMAIL="admin@kan-tek.com" \
  -e DEV_ADMIN_PASSWORD="Admin1234!" \
  node:22-alpine sh -c "npm ci && npx prisma generate && npm run db:seed"