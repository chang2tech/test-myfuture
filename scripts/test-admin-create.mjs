/**
 * E2E test: tạo danh mục + tạo bài viết (admin → public)
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
  console.log('=== Test tạo danh mục & bài viết ===\n');

  const login = await api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@myfuture.vn',
      password: 'Admin@2026',
    }),
  });
  assert(login.res.ok, `Login failed: ${login.res.status}`);
  let cookie = login.cookie;
  console.log('✓ Đăng nhập admin');

  const ts = Date.now();
  const categorySlug = `test-danh-muc-${ts}`;
  const categoryName = `Danh mục test ${ts}`;

  const createCategory = await api(
    '/admin/categories',
    {
      method: 'POST',
      body: JSON.stringify({
        name: categoryName,
        slug: categorySlug,
        description: 'Mô tả danh mục test',
        sortOrder: 99,
      }),
    },
    cookie,
  );
  assert(createCategory.res.ok, `Tạo danh mục failed: ${JSON.stringify(createCategory.json)}`);
  const categoryId = createCategory.json.data.id;
  assert(createCategory.json.data.slug === categorySlug, 'Slug danh mục không khớp');
  console.log(`✓ Tạo danh mục: ${categoryName} (${categorySlug})`);

  const dupCategory = await api(
    '/admin/categories',
    {
      method: 'POST',
      body: JSON.stringify({
        name: 'Trùng slug',
        slug: categorySlug,
        sortOrder: 0,
      }),
    },
    cookie,
  );
  assert(dupCategory.res.status === 409, `Slug trùng phải 409, got ${dupCategory.res.status}`);
  console.log('✓ Từ chối slug danh mục trùng (409)');

  const adminCategories = await api('/admin/categories', {}, cookie);
  assert(
    adminCategories.json.data.some((c) => c.id === categoryId),
    'Danh mục mới không có trong admin list',
  );
  console.log('✓ Danh mục xuất hiện trong admin list');

  const publicCategories = await api('/news/categories');
  assert(publicCategories.res.ok, 'Public categories failed');
  assert(
    publicCategories.json.data.some((c) => c.slug === categorySlug),
    'Danh mục mới không có trong public API',
  );
  console.log('✓ Danh mục xuất hiện trong public API');

  const articleSlug = `test-bai-viet-${ts}`;
  const createArticle = await api(
    '/admin/articles',
    {
      method: 'POST',
      body: JSON.stringify({
        title: `Bài viết test ${ts}`,
        slug: articleSlug,
        excerpt: 'Mô tả ngắn bài viết test',
        content: '<p>Nội dung bài viết test đủ dài để validate.</p>',
        categoryId,
        status: 'PUBLISHED',
        isFeatured: false,
        isHot: true,
        keywords: ['test', 'admin'],
        publishedAt: new Date().toISOString(),
        categorySortOrder: 0,
      }),
    },
    cookie,
  );
  assert(createArticle.res.ok, `Tạo bài viết failed: ${JSON.stringify(createArticle.json)}`);
  const articleId = createArticle.json.data.id;
  assert(createArticle.json.data.status === 'PUBLISHED', 'Status không đúng');
  console.log(`✓ Tạo bài viết: ${articleSlug}`);

  const invalidArticle = await api(
    '/admin/articles',
    {
      method: 'POST',
      body: JSON.stringify({
        title: 'AB',
        slug: 'ab',
        content: 'short',
        categoryId,
        status: 'DRAFT',
      }),
    },
    cookie,
  );
  assert(invalidArticle.res.status === 400, `Validation phải 400, got ${invalidArticle.res.status}`);
  console.log('✓ Từ chối bài viết không hợp lệ (400)');

  const adminList = await api(`/admin/articles?search=${articleSlug}`, {}, cookie);
  assert(
    adminList.json.data.items.some((a) => a.id === articleId),
    'Bài viết không có trong admin list',
  );
  console.log('✓ Bài viết xuất hiện trong admin list');

  const publicByCategory = await api(`/news?category=${categorySlug}&limit=50`);
  assert(publicByCategory.res.ok, 'Public list by category failed');
  assert(
    publicByCategory.json.data.items.some((a) => a.slug === articleSlug),
    'Bài viết không có trong public list theo danh mục',
  );
  console.log('✓ Bài viết xuất hiện public theo danh mục');

  const publicArticle = await api(`/news/${articleSlug}`);
  assert(publicArticle.res.ok, `Public article failed: ${JSON.stringify(publicArticle.json)}`);
  assert(publicArticle.json.data.category.slug === categorySlug, 'Category slug public sai');
  assert(publicArticle.json.data.isHot === true, 'isHot không đúng');
  console.log('✓ Bài viết public chi tiết OK');

  const deleteCategoryWithArticles = await api(
    `/admin/categories/${categoryId}`,
    { method: 'DELETE' },
    cookie,
  );
  assert(
    deleteCategoryWithArticles.res.status === 400,
    `Xóa DM có bài phải 400, got ${deleteCategoryWithArticles.res.status}`,
  );
  console.log('✓ Không cho xóa danh mục còn bài viết (400)');

  const updateCategory = await api(
    `/admin/categories/${categoryId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        name: `${categoryName} (đã sửa)`,
        description: 'Mô tả đã cập nhật',
        sortOrder: 100,
      }),
    },
    cookie,
  );
  assert(updateCategory.res.ok, `Sửa danh mục failed: ${JSON.stringify(updateCategory.json)}`);
  assert(updateCategory.json.data.name.includes('đã sửa'), 'Tên danh mục chưa cập nhật');
  console.log('✓ Sửa danh mục OK');

  const updateArticle = await api(
    `/admin/articles/${articleId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        title: `Bài viết test ${ts} (đã sửa)`,
        status: 'PUBLISHED',
      }),
    },
    cookie,
  );
  assert(updateArticle.res.ok, `Sửa bài viết failed: ${JSON.stringify(updateArticle.json)}`);
  console.log('✓ Sửa bài viết OK');

  await api(`/admin/articles/${articleId}`, { method: 'DELETE' }, cookie);
  console.log('✓ Xóa bài viết test');

  await api(`/admin/categories/${categoryId}`, { method: 'DELETE' }, cookie);
  console.log('✓ Xóa danh mục test');

  console.log('\n=== Tất cả test passed ===');
}

main().catch((err) => {
  console.error('\nTEST FAILED:', err.message);
  process.exit(1);
});
