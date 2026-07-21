'use client';

interface ArticleShareBottomProps {
  shareUrl: string;
}

export function ArticleShareBottom({ shareUrl }: ArticleShareBottomProps) {
  const encodedUrl = encodeURIComponent(shareUrl);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Clipboard may be unavailable in some browsers.
    }
  };

  return (
    <div className="article-share-bottom">
      <span className="share-label">Thấy hữu ích? Chia sẻ bài viết:</span>
      <div className="d-flex gap-2 mt-2">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bottom-share-btn fb"
        >
          <i className="fa fa-facebook" /> Facebook
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bottom-share-btn tw"
        >
          <i className="fa fa-twitter" /> Twitter
        </a>
        <button
          className="bottom-share-btn lnk"
          type="button"
          onClick={handleCopy}
        >
          <i className="fa fa-link" /> Sao chép link
        </button>
      </div>
    </div>
  );
}
