function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function splitHighlightParts(text: string, query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed) return [text];

  const regex = new RegExp(`(${escapeRegExp(trimmed)})`, 'gi');
  return text.split(regex).filter((part) => part.length > 0);
}

export function hasHighlightMatch(text: string, query: string): boolean {
  const trimmed = query.trim();
  if (!trimmed) return false;
  return text.toLowerCase().includes(trimmed.toLowerCase());
}
