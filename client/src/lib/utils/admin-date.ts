export function formatAdminUpdatedAt(value: string): {
  label: string;
  title: string;
} {
  const date = new Date(value);
  const now = Date.now();
  const diffMinutes = Math.round((date.getTime() - now) / 60_000);

  const title = date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (Math.abs(diffMinutes) < 1) {
    return { label: 'Vừa xong', title };
  }

  const relative = new Intl.RelativeTimeFormat('vi', { numeric: 'auto' });

  if (Math.abs(diffMinutes) < 60) {
    return { label: relative.format(diffMinutes, 'minute'), title };
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return { label: relative.format(diffHours, 'hour'), title };
  }

  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 7) {
    return { label: relative.format(diffDays, 'day'), title };
  }

  return {
    label: date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year:
        date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    }),
    title,
  };
}
