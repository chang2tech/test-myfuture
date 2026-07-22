'use client';

import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { uploadArticleImage } from '@/lib/api/admin';

interface ArticleHtmlEditorProps {
  value: string;
  onChange: (html: string) => void;
  previewOpen?: boolean;
  onPreviewToggle?: () => void;
}

interface ToolbarAction {
  cmd: string;
  iconClass: string;
  label: string;
  arg?: string;
}

const TOOLBAR_GROUPS: ToolbarAction[][] = [
  [
    { cmd: 'bold', iconClass: 'bx bx-bold', label: 'In đậm' },
    { cmd: 'italic', iconClass: 'bx bx-italic', label: 'In nghiêng' },
    { cmd: 'underline', iconClass: 'bx bx-underline', label: 'Gạch chân' },
  ],
  [
    { cmd: 'justifyLeft', iconClass: 'bx bx-align-left', label: 'Căn trái' },
    { cmd: 'justifyCenter', iconClass: 'bx bx-align-middle', label: 'Căn giữa' },
    { cmd: 'justifyRight', iconClass: 'bx bx-align-right', label: 'Căn phải' },
  ],
  [
    { cmd: 'formatBlock', iconClass: 'bx bx-heading', label: 'Tiêu đề H2', arg: 'h2' },
    { cmd: 'formatBlock', iconClass: 'bx bx-font', label: 'Tiêu đề H3', arg: 'h3' },
  ],
  [
    { cmd: 'insertUnorderedList', iconClass: 'bx bx-list-ul', label: 'Danh sách' },
    { cmd: 'insertOrderedList', iconClass: 'bx bx-list-ol', label: 'Danh sách số' },
  ],
  [
    {
      cmd: 'formatBlock',
      iconClass: 'bxs bxs-quote-alt-left',
      label: 'Trích dẫn',
      arg: 'blockquote',
    },
    { cmd: 'createLink', iconClass: 'bx bx-link', label: 'Chèn liên kết' },
    { cmd: 'unlink', iconClass: 'bx bx-unlink', label: 'Bỏ liên kết' },
  ],
];

export function ArticleHtmlEditor({
  value,
  onChange,
  previewOpen = false,
  onPreviewToggle,
}: ArticleHtmlEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const syncContent = useCallback(() => {
    if (!editorRef.current) return;
    onChange(editorRef.current.innerHTML);
  }, [onChange]);

  function runCommand(command: string, arg?: string) {
    if (command === 'createLink') {
      const url = window.prompt('Nhập URL liên kết');
      if (!url) return;
      document.execCommand(command, false, url);
    } else if (command === 'formatBlock' && arg) {
      document.execCommand(command, false, `<${arg}>`);
    } else {
      document.execCommand(command, false, arg);
    }
    syncContent();
    editorRef.current?.focus();
  }

  async function handleImageUpload(file: File) {
    try {
      const result = await uploadArticleImage(file);
      document.execCommand(
        'insertHTML',
        false,
        `<img src="${result.url}" alt="" style="max-width:100%;height:auto;border-radius:8px;" />`,
      );
      syncContent();
      toast.success('Đã chèn ảnh');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload thất bại');
    }
  }

  return (
    <div className="admin-html-editor">
      <div className="admin-html-editor__topbar">
        <span className="admin-html-editor__label">
          <i className="bx bx-edit" aria-hidden />
          Soạn thảo
        </span>
        <div className="admin-html-editor__topbar-actions">
          <button
            type="button"
            className={`admin-html-editor__preview-btn${previewOpen ? ' is-active' : ''}`}
            aria-pressed={previewOpen}
            onClick={onPreviewToggle}
          >
            <i className="bx bx-show" aria-hidden />
            Xem trước
          </button>
          <button
            type="button"
            className="admin-html-editor__toolbar-btn"
            title="Xóa định dạng"
            aria-label="Xóa định dạng"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand('removeFormat')}
          >
            <i className="bx bx-eraser" aria-hidden />
          </button>
        </div>
      </div>

      <div className="admin-html-editor__toolbar">
          {TOOLBAR_GROUPS.map((group, groupIndex) => (
            <div key={groupIndex} className="admin-html-editor__toolbar-group">
              {group.map((action) => (
                <button
                  key={`${action.cmd}-${action.arg ?? ''}-${action.label}`}
                  type="button"
                  className="admin-html-editor__toolbar-btn"
                  title={action.label}
                  aria-label={action.label}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => runCommand(action.cmd, action.arg)}
                >
                  <i className={action.iconClass} aria-hidden />
                </button>
              ))}
            </div>
          ))}
          <div className="admin-html-editor__toolbar-group">
            <button
              type="button"
              className="admin-html-editor__toolbar-btn"
              title="Chèn ảnh"
              aria-label="Chèn ảnh"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => fileRef.current?.click()}
            >
              <i className="bx bx-image-add" aria-hidden />
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="d-none"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleImageUpload(file);
              event.target.value = '';
            }}
          />
        </div>

      <div
        ref={editorRef}
        className="admin-html-editor__content article-content article-html-editor__area"
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Nhập nội dung bài viết..."
        onInput={syncContent}
        onBlur={syncContent}
      />
    </div>
  );
}
