/**
 * 必要に応じて画像URLをプロキシURLに変換する関数
 * すべての外部URLに対して自動的にプロキシを通すことで、ドメインごとのCORS制限管理を不要にする
 */
export function getImageUrl(url: string): string {
  if (!url) {
    return '';
  }

  // データURIや既にプロキシ済みのURL、相対パスはそのまま返す
  if (
    url.startsWith('data:') ||
    url.startsWith('/api/image-proxy') ||
    url.startsWith('/') ||
    url.startsWith('./') ||
    url.startsWith('../')
  ) {
    return url;
  }

  try {
    const urlObj = new URL(url);

    // http または https で始まる外部URLはすべてプロキシを使用
    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      return `/api/image-proxy?url=${encodeURIComponent(url)}`;
    }

    return url;
  } catch (_e) {
    // URLでない場合はそのまま返す
    return url;
  }
}
