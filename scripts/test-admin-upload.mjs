/**
 * E2E smoke test: admin upload → article save → public API
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const API = 'http://localhost:4721/api';
const CLIENT = 'http://localhost:3721';

function parseSetCookie(headers) {
  const raw = headers.getSetCookie?.() ?? [];
  return raw.map((c) => c.split(';')[0]).join('; ');
}

async function api(path, options = {}, cookie = '') {
  const headers = { ...(options.headers ?? {}) };
  if (cookie) headers.Cookie = cookie;
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  return { res, json, cookie: parseSetCookie(res.headers) || cookie };
}

async function main() {
  const login = await api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@myfuture.vn',
      password: 'Admin@2026',
    }),
  });

  if (!login.res.ok) {
    throw new Error(`Login failed: ${JSON.stringify(login.json)}`);
  }

  let cookie = login.cookie;
  console.log('✓ Login OK');

  const categories = await api('/admin/categories', {}, cookie);
  cookie = categories.cookie || cookie;
  const category = categories.json.data?.[0];
  if (!category) throw new Error('No categories found');
  console.log(`✓ Category: ${category.name} (${category.slug})`);

  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64',
  );
  const form = new FormData();
  form.append('file', new Blob([png], { type: 'image/png' }), 'test-upload.png');

  const upload = await api('/admin/upload', { method: 'POST', body: form }, cookie);
  cookie = upload.cookie || cookie;
  if (!upload.res.ok) {
    throw new Error(`Upload failed: ${JSON.stringify(upload.json)}`);
  }

  const imageUrl = upload.json.data.url;
  console.log(`✓ Upload OK: ${imageUrl}`);

  const slug = `e2e-upload-${Date.now()}`;
  const create = await api(
    '/admin/articles',
    {
      method: 'POST',
      body: JSON.stringify({
        title: `E2E Upload Test ${slug}`,
        slug,
        excerpt: 'Kiểm tra upload ảnh public',
        content: `<p>Nội dung test</p><img src="${imageUrl}" alt="test" />`,
        coverImage: imageUrl,
        categoryId: category.id,
        status: 'PUBLISHED',
        isFeatured: false,
        isHot: false,
        keywords: ['e2e'],
        publishedAt: new Date().toISOString(),
        categorySortOrder: 0,
      }),
    },
    cookie,
  );
  cookie = create.cookie || cookie;
  if (!create.res.ok) {
    throw new Error(`Create article failed: ${JSON.stringify(create.json)}`);
  }
  const articleId = create.json.data.id;
  console.log(`✓ Article created: ${slug}`);

  const publicArticle = await api(`/news/${slug}`, {}, '');
  if (!publicArticle.res.ok) {
    throw new Error(`Public article not found: ${JSON.stringify(publicArticle.json)}`);
  }
  const pub = publicArticle.json.data;
  if (pub.coverImage !== imageUrl) {
    throw new Error(`coverImage mismatch: ${pub.coverImage} !== ${imageUrl}`);
  }
  if (!pub.content.includes(imageUrl)) {
    throw new Error('Content missing uploaded image URL');
  }
  console.log('✓ Public API returns correct coverImage and content');

  const imageRes = await fetch(`${CLIENT}${imageUrl}`);
  if (!imageRes.ok) {
    throw new Error(`Client image proxy failed: ${imageRes.status}`);
  }
  console.log(`✓ Image accessible via client: ${CLIENT}${imageUrl}`);

  const serverImage = await fetch(`http://localhost:4721${imageUrl}`);
  if (!serverImage.ok) {
    throw new Error(`Server static image failed: ${serverImage.status}`);
  }
  console.log(`✓ Image accessible via server: http://localhost:4721${imageUrl}`);

  await api(`/admin/articles/${articleId}`, { method: 'DELETE' }, cookie);
  console.log('✓ Cleanup: deleted test article');

  console.log('\nAll E2E checks passed.');
}

main().catch((err) => {
  console.error('E2E FAILED:', err.message);
  process.exit(1);
});
