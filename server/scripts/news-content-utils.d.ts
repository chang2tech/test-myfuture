export declare const MIN_CONTENT_LENGTH = 200;
export declare const MIN_ARTICLES_PER_CATEGORY = 15;
export declare const LIST_PAGES_TO_SCRAPE = 2;
export declare const HOME_ARTICLE_EXTERNAL_SLUGS: readonly ["MTE3NUZI", "MTE3NEZI", "MTE3M0ZI", "MTE3MkZI"];
export declare function decodeHtmlEntities(value: string): string;
export declare function cleanContentHtml(html: string): string;
export declare function isQualityContent(html: string | null | undefined): boolean;
