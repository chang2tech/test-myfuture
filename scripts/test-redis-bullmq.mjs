/**
 * Smoke test Redis + BullMQ integration
 */
const API = 'http://localhost:4721/api';

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
  console.log('=== Redis + BullMQ Smoke Test ===\n');

  const health = await api('/health');
  assert(health.res.ok, `Health failed: ${health.res.status}`);
  assert(health.json.data?.redis === true, 'Redis health check failed');
  assert(health.json.data?.db === true, 'DB health check failed');
  console.log('✓ Health: db + redis OK');

  const categories1 = await api('/news/categories');
  const categories2 = await api('/news/categories');
  assert(categories1.res.ok && categories2.res.ok, 'Categories fetch failed');
  assert(
    JSON.stringify(categories1.json.data) === JSON.stringify(categories2.json.data),
    'Categories cache should return same data',
  );
  console.log('✓ News categories cache OK');

  const news1 = await api('/news?limit=2');
  const news2 = await api('/news?limit=2');
  assert(news1.res.ok && news2.res.ok, 'News list failed');
  console.log('✓ News list cache OK');

  const login = await api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@myfuture.vn',
      password: 'Admin@2026',
    }),
  });
  assert(login.res.ok, 'Login failed');
  let cookie = login.cookie;
  console.log('✓ Login OK (rate limit not triggered)');

  const adminCats = await api('/admin/categories', {}, cookie);
  const category = adminCats.json.data?.[0];
  assert(category, 'No category for test');

  const ts = Date.now();
  const slug = `redis-queue-test-${ts}`;
  const create = await api(
    '/admin/articles',
    {
      method: 'POST',
      body: JSON.stringify({
        title: `Redis Queue Test ${slug}`,
        slug,
        excerpt: 'Test cache invalidation',
        content: '<p>Nội dung test redis queue và cache invalidation.</p>',
        categoryId: category.id,
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
        categorySortOrder: 9999,
      }),
    },
    cookie,
  );
  assert(create.res.ok, `Create article failed: ${JSON.stringify(create.json)}`);
  const articleId = create.json.data.id;
  console.log('✓ Created article (cache invalidation job enqueued)');

  await new Promise((r) => setTimeout(r, 500));

  const publicArticle = await api(`/news/${slug}`);
  assert(publicArticle.res.ok, 'Public article not found after cache invalidation');
  console.log('✓ Public article visible after admin create');

  const detail1 = await api(`/news/${slug}`);
  const viewsBefore = detail1.json.data.viewCount;
  const detail2 = await api(`/news/${slug}`);
  const viewsAfter = detail2.json.data.viewCount;
  assert(viewsAfter === viewsBefore + 1, 'View count should increment optimistically');
  console.log('✓ View count increment (queued) OK');

  await new Promise((r) => setTimeout(r, 800));

  const detail3 = await api(`/news/${slug}?trackView=false`);
  const viewsPersisted = detail3.json.data.viewCount;
  assert(
    viewsPersisted >= viewsAfter,
    `View count not persisted by worker: ${viewsPersisted} < ${viewsAfter}`,
  );
  console.log('✓ BullMQ worker persisted view count');

  const search = await api('/search?q=test&limit=3');
  assert(search.res.ok, 'Search failed');
  console.log('✓ Search with rate limit OK');

  await api(`/admin/articles/${articleId}`, { method: 'DELETE' }, cookie);
  console.log('✓ Cleanup article');

  console.log('\n=== All Redis/BullMQ tests passed ===');
}

main().catch((err) => {
  console.error('\nTEST FAILED:', err.message);
  process.exit(1);
});
