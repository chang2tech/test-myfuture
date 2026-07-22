export const EXCLUDED_ADMIN_CATEGORY_SLUGS = ['toan-canh'] as const;

export function filterAdminCategories<T extends { slug: string }>(
  categories: T[],
): T[] {
  return categories.filter(
    (category) =>
      !EXCLUDED_ADMIN_CATEGORY_SLUGS.includes(
        category.slug as (typeof EXCLUDED_ADMIN_CATEGORY_SLUGS)[number],
      ),
  );
}
