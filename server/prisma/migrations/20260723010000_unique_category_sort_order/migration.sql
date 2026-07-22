-- Deduplicate sort order within each category before adding unique constraint.
WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY "categoryId"
      ORDER BY "categorySortOrder" ASC, "publishedAt" DESC
    ) - 1 AS new_order
  FROM "news_articles"
)
UPDATE "news_articles" AS article
SET "categorySortOrder" = ranked.new_order
FROM ranked
WHERE article.id = ranked.id;

-- CreateIndex
CREATE UNIQUE INDEX "news_articles_categoryId_categorySortOrder_key" ON "news_articles"("categoryId", "categorySortOrder");
