import { Injectable } from '@nestjs/common';
import { SearchRepository } from './search.repository';
import { buildArticleSnippet } from './search-snippet.util';

const POPULAR_FALLBACK = ['Vinhomes Ocean Park', 'MEL', 'ParkLand', 'MGC'];

@Injectable()
export class SearchService {
  constructor(private readonly repository: SearchRepository) {}

  async searchPublic(query: string, limit = 10) {
    const trimmed = query.trim();
    const take = Math.min(Math.max(limit, 1), 20);

    if (!trimmed) {
      const popular = await this.getPopularTerms();
      return {
        query: '',
        popular,
        articles: { total: 0, items: [] },
        projects: { total: 0, items: [] },
      };
    }

    const [[articles, articleTotal], [projects, projectTotal]] =
      await Promise.all([
        this.repository.searchPublishedArticles(trimmed, take),
        this.repository.searchProjects(trimmed, take),
      ]);

    return {
      query: trimmed,
      popular: await this.getPopularTerms(),
      articles: {
        total: articleTotal,
        items: articles.map((article) => ({
          id: article.id,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          snippet: buildArticleSnippet(
            article.excerpt,
            article.content,
            trimmed,
          ),
          coverImage: article.coverImage,
          publishedAt: article.publishedAt,
          category: article.category,
        })),
      },
      projects: {
        total: projectTotal,
        items: projects,
      },
    };
  }

  async searchAdminSuggestions(query: string, limit = 8) {
    const trimmed = query.trim();
    const take = Math.min(Math.max(limit, 1), 20);

    if (!trimmed) {
      return {
        query: '',
        popular: await this.getPopularTerms(),
        articles: { total: 0, items: [] },
      };
    }

    const [articles, total] = await this.repository.searchAdminArticles(
      trimmed,
      take,
    );

    return {
      query: trimmed,
      popular: await this.getPopularTerms(),
      articles: {
        total,
        items: articles.map((article) => ({
          id: article.id,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          snippet: buildArticleSnippet(
            article.excerpt,
            article.content,
            trimmed,
          ),
          coverImage: article.coverImage,
          status: article.status,
          publishedAt: article.publishedAt,
          category: article.category,
        })),
      },
    };
  }

  private async getPopularTerms() {
    const [projects, articles] = await this.repository.findPopularTerms(4);
    const terms = [
      ...projects.map((project) => project.name),
      ...articles.map((article) => article.title),
    ];

    const unique = [
      ...new Set(terms.map((term) => term.trim()).filter(Boolean)),
    ];
    if (unique.length >= 4) {
      return unique.slice(0, 4);
    }

    return [
      ...unique,
      ...POPULAR_FALLBACK.filter((term) => !unique.includes(term)),
    ].slice(0, 4);
  }
}
