"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOME_ARTICLE_EXTERNAL_SLUGS = exports.LIST_PAGES_TO_SCRAPE = exports.MIN_ARTICLES_PER_CATEGORY = exports.MIN_CONTENT_LENGTH = void 0;
exports.decodeHtmlEntities = decodeHtmlEntities;
exports.cleanContentHtml = cleanContentHtml;
exports.isQualityContent = isQualityContent;
exports.MIN_CONTENT_LENGTH = 200;
exports.MIN_ARTICLES_PER_CATEGORY = 15;
exports.LIST_PAGES_TO_SCRAPE = 2;
exports.HOME_ARTICLE_EXTERNAL_SLUGS = [
    'MTE3NUZI',
    'MTE3NEZI',
    'MTE3M0ZI',
    'MTE3MkZI',
];
const he_1 = require("he");
function decodeHtmlEntities(value) {
    return (0, he_1.decode)(value);
}
function cleanContentHtml(html) {
    return html
        .replace(/\s*<\/div>[\s\S]*$/, '')
        .replace(/\s*<div[^>]*$/, '')
        .trim();
}
function isQualityContent(html) {
    if (!html)
        return false;
    const cleaned = cleanContentHtml(html);
    return cleaned.length >= exports.MIN_CONTENT_LENGTH && cleaned.includes('<p');
}
//# sourceMappingURL=news-content-utils.js.map