import DOMPurify from 'isomorphic-dompurify';

export function sanitizeArticleHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ADD_ATTR: ['target', 'rel', 'style'],
  });
}
