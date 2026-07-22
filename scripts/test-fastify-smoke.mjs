/**
 * API smoke test after Fastify migration
 */
const API = 'http://localhost:4721/api';
const ORIGIN = 'http://localhost:4721';

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

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  console.log('=== Fastify API Smoke Test ===\n');

  const health = await api('/health');
  assert(health.res.ok, `Health check failed: ${health.res.status}`);
  console.log('✓ GET /api/health');

  const login = await api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@myfuture.vn',
      password: 'Admin@2026',
    }),
  });
  assert(login.res.ok, `Login failed: ${JSON.stringify(login.json)}`);
  assert(login.cookie.includes('access_token'), 'Missing access_token cookie');
  let cookie = login.cookie;
  console.log('✓ POST /api/auth/login (cookie set)');

  const me = await api('/auth/me', {}, cookie);
  assert(me.res.ok, `Auth me failed: ${me.res.status}`);
  assert(me.json.data?.email === 'admin@myfuture.vn', 'Wrong user from /me');
  console.log('✓ GET /api/auth/me');

  const stats = await api('/admin/articles/stats', {}, cookie);
  assert(stats.res.ok, `Admin stats failed: ${stats.res.status}`);
  console.log('✓ GET /api/admin/articles/stats');

  const categories = await api('/admin/categories', {}, cookie);
  assert(categories.res.ok, `Admin categories failed`);
  const category = categories.json.data?.[0];
  assert(category, 'No categories');
  console.log(`✓ GET /api/admin/categories (${categories.json.data.length} items)`);

  const publicCategories = await api('/news/categories');
  assert(publicCategories.res.ok, 'Public categories failed');
  console.log('✓ GET /api/news/categories');

  const publicNews = await api('/news?limit=1');
  assert(publicNews.res.ok, 'Public news list failed');
  console.log('✓ GET /api/news');

  const projects = await api('/projects/featured?limit=1');
  assert(projects.res.ok, 'Projects failed');
  console.log('✓ GET /api/projects/featured');

  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64',
  );
  const form = new FormData();
  form.append('file', new Blob([png], { type: 'image/png' }), 'fastify-test.png');

  const upload = await api('/admin/upload', { method: 'POST', body: form }, cookie);
  assert(upload.res.ok, `Upload failed: ${JSON.stringify(upload.json)}`);
  const imageUrl = upload.json.data.url;
  console.log(`✓ POST /api/admin/upload → ${imageUrl}`);

  const serverImage = await fetch(`${ORIGIN}${imageUrl}`);
  assert(serverImage.ok, `Static file failed: ${serverImage.status}`);
  console.log(`✓ Static file served at ${imageUrl}`);

  const slug = `fastify-smoke-${Date.now()}`;
  const create = await api(
    '/admin/articles',
    {
      method: 'POST',
      body: JSON.stringify({
        title: `Fastify Smoke ${slug}`,
        slug,
        excerpt: 'Fastify migration test',
        content: `<p>Test</p><img src="${imageUrl}" alt="test" />`,
        coverImage: imageUrl,
        categoryId: category.id,
        status: 'PUBLISHED',
        keywords: ['fastify'],
        publishedAt: new Date().toISOString(),
        categorySortOrder: 0,
      }),
    },
    cookie,
  );
  assert(create.res.ok, `Create article failed: ${JSON.stringify(create.json)}`);
  const articleId = create.json.data.id;
  console.log('✓ POST /api/admin/articles');

  const publicArticle = await api(`/news/${slug}`);
  assert(publicArticle.res.ok, 'Public article not found');
  assert(publicArticle.json.data.coverImage === imageUrl, 'coverImage mismatch');
  console.log('✓ GET /api/news/:slug (public)');

  const logout = await api('/auth/logout', { method: 'POST' }, cookie);
  assert(logout.res.ok, 'Logout failed');
  console.log('✓ POST /api/auth/logout');

  await api(`/admin/articles/${articleId}`, { method: 'DELETE' }, cookie);
  console.log('✓ Cleanup: deleted test article');

  console.log('\n=== All Fastify smoke tests passed ===');
}

main().catch((err) => {
  console.error('\nSMOKE TEST FAILED:', err.message);
  process.exit(1);
});
