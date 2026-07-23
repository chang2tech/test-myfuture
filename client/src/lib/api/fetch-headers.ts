export function hasJsonRequestBody(body: RequestInit['body']): boolean {
  if (body === undefined || body === null || body === '') {
    return false;
  }

  return !(body instanceof FormData);
}

export function buildFetchHeaders(options?: RequestInit): Headers {
  const headers = new Headers(options?.headers);
  const isFormData = options?.body instanceof FormData;
  const hasJsonBody = hasJsonRequestBody(options?.body);

  if (isFormData) {
    headers.delete('Content-Type');
    headers.delete('content-type');
    return headers;
  }

  if (hasJsonBody) {
    if (!headers.has('Content-Type') && !headers.has('content-type')) {
      headers.set('Content-Type', 'application/json');
    }
    return headers;
  }

  headers.delete('Content-Type');
  headers.delete('content-type');
  return headers;
}

export function parseApiErrorMessage(
  status: number,
  body: { message?: string | string[] },
  fallback: string,
): string {
  if (!body.message) {
    return fallback || `API error: ${status}`;
  }

  const message = Array.isArray(body.message)
    ? body.message.join(', ')
    : body.message;

  if (message.includes('Body cannot be empty when content-type')) {
    return 'Lỗi kết nối API. Vui lòng tải lại trang và thử lại.';
  }

  return message;
}
