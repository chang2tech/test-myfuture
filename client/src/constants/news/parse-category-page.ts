export function parseCategoryPageParam(value: string): number {
  const match = value.match(/^trang-(\d+)$/i);
  const normalized = match ? match[1] : value;
  const pageNumber = Number(normalized);
  return Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : NaN;
}
