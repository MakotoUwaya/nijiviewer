# Nijiviewer

にじさんじを中心とした VTuber の配信情報を確認できるビューアーアプリケーションです。

## 主な機能

- **ライブ配信一覧**: 組織別のライブ配信情報を表示
- **ライバー検索**: VTuber を名前で検索
- **お気に入り機能**: ライバーをお気に入り登録して、配信情報を追跡
- **認証機能**: 
  - メール/パスワード認証
  - **Passkeys 認証** (Beta) - パスワード不要の生体認証でログイン

## 認証機能

### Passkeys 認証 (Beta)

Passkeys は、パスワードを使わずに安全にログインできる次世代の認証方式です。

- 顔認証、指紋認証、PIN などでログイン可能
- フィッシング攻撃に強く、セキュリティレベルが高い
- 対応ブラウザ: Chrome 109+, Safari 16+, Firefox 119+

詳細は [Passkeys ドキュメント](../docs/content/nijiviewer/passkeys.mdx) を参照してください。

## Getting Started

First, run the development server:

```bash
npm run dev
```

This is a template for creating applications using Next.js 13 (app directory) and NextUI (v2).

## Technologies Used

- [Next.js 16](https://nextjs.org/docs/getting-started)
- [NextUI v2](https://nextui.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [Supabase](https://supabase.com/) - 認証・データベース
- [Holodex API](https://holodex.net/) - VTuber 配信情報
