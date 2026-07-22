'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { updateAdminArticle } from '@/lib/api/admin';

interface ArticleSortOrderCellProps {
  articleId: string;
  value: number;
  onUpdated: () => void;
}

export function ArticleSortOrderCell({
  articleId,
  value,
  onUpdated,
}: ArticleSortOrderCellProps) {
  const [order, setOrder] = useState(String(value));
  const [saving, setSaving] = useState(false);

  async function handleBlur() {
    const parsed = Number.parseInt(order, 10);
    if (Number.isNaN(parsed)) {
      setOrder(String(value));
      return;
    }

    if (parsed < 0) {
      toast.error('Thứ tự phải là số không âm');
      setOrder(String(value));
      return;
    }

    if (parsed === value) return;

    setSaving(true);
    try {
      await updateAdminArticle(articleId, { categorySortOrder: parsed });
      onUpdated();
      toast.success('Đã sắp xếp lại thứ tự');
    } catch (error) {
      setOrder(String(value));
      toast.error(
        error instanceof Error ? error.message : 'Không thể cập nhật thứ tự',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <input
      type="number"
      min={0}
      step={1}
      className="form-control form-control-sm admin-table__order-input"
      value={order}
      disabled={saving}
      placeholder="0"
      onChange={(event) => setOrder(event.target.value)}
      onBlur={() => void handleBlur()}
      aria-label="Thứ tự hiển thị"
    />
  );
}
