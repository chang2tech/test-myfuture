'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { ImageWithSkeleton } from '@/components/ui/image-with-skeleton';
import { uploadArticleImage } from '@/lib/api/admin';

interface ArticleThumbnailFieldProps {
  value: string;
  onChange: (url: string) => void;
}

export function ArticleThumbnailField({
  value,
  onChange,
}: ArticleThumbnailFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const result = await uploadArticleImage(file);
      onChange(result.url);
      toast.success('Đã tải ảnh thumbnail');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload thất bại');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="form-label small fw-semibold">Ảnh thumbnail</label>
      <div className="d-flex flex-column gap-2">
        {value ? (
          <div className="position-relative rounded-3 overflow-hidden" style={{ height: 140 }}>
            <ImageWithSkeleton layout="fill" src={value} alt="Thumbnail" sizes="320px" />
          </div>
        ) : (
          <div className="border rounded-3 bg-light d-flex align-items-center justify-content-center text-secondary small" style={{ height: 140 }}>
            Chưa có ảnh thumbnail
          </div>
        )}

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
          </button>
          {value && (
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => onChange('')}
            >
              Xóa
            </button>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="d-none"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}
