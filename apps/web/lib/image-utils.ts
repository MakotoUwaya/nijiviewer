/**
 * 必要に応じて画像URLをプロキシURLに変換する関数
 * CORS制限のあるドメインの画像は自動的にプロキシを通す
 */
export function getImageUrl(url: string): string {
  if (!url) {
    return '';
  }

  try {
    const urlObj = new URL(url);

    // CORS制限があることが既知のドメインリスト
    const corsRestrictedDomains = [
      'hdslb.com', // Bilibili
      'i0.hdslb.com', // Bilibiliのサブドメイン
      'bilibili.com', // Bilibili
      'public-web.spwn.jp', // SPWN
    ];

    // 指定されたドメインの場合はプロキシを使用
    if (
      corsRestrictedDomains.some((domain) => urlObj.hostname.includes(domain))
    ) {
      return `/api/image-proxy?url=${encodeURIComponent(url)}`;
    }

    // その他のドメインはそのままのURLを使用
    return url;
  } catch (_e) {
    // URLでない場合や解析エラーの場合は元のURLを返す
    return url;
  }
}
