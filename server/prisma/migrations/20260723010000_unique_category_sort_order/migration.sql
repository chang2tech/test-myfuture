-- Sync schema additions missing from init migration (users, article columns, enums).

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR');
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'EDITOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AlterTable
ALTER TABLE "news_articles" ADD COLUMN "externalSlug" TEXT,
ADD COLUMN "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "readTimeMinutes" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN "isHot" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "status" "ArticleStatus" NOT NULL DEFAULT 'PUBLISHED',
ADD COLUMN "categorySortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "authorId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "news_articles_externalSlug_key" ON "news_articles"("externalSlug");

-- AddForeignKey
ALTER TABLE "news_articles" ADD CONSTRAINT "news_articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
