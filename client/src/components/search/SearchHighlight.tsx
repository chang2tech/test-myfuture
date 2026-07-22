import { splitHighlightParts } from '@/lib/search/highlight-text';

interface SearchHighlightProps {
  text: string;
  query: string;
}

export function SearchHighlight({ text, query }: SearchHighlightProps) {
  const parts = splitHighlightParts(text, query);

  return (
    <>
      {parts.map((part, index) => {
        const isMatch =
          query.trim().length > 0 &&
          part.toLowerCase() === query.trim().toLowerCase();

        if (isMatch) {
          return (
            <mark key={`${part}-${index}`} className="ss-hl">
              {part}
            </mark>
          );
        }

        return <span key={`${part}-${index}`}>{part}</span>;
      })}
    </>
  );
}
