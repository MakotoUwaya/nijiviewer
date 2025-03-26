# プロジェクト概要

nijiviewerは、VTuber配信の視聴体験を向上させるためのウェブアプリケーションです。

## 主要目標

- VTuberのライブ配信情報を一元的に表示
- 効率的な配信検索と閲覧機能の提供
- ユーザーフレンドリーなインターフェースの実現

## 技術スタック

- Next.js 15+ (App Router)
- Tailwind CSS
- Supabase
- Vercel (デプロイメント)
- GitHub (バージョン管理)

## プロジェクト構造

モノレポ方式を採用し、以下の構成を持ちます：

```
/apps
  /docs - ドキュメントサイト
  /web  - メインアプリケーション
/packages
  /tsconfig - 共有TypeScript設定
  /ui       - 共有UIコンポーネント
```

## 開発フロー

1. テスト駆動開発（TDD）の採用
2. Vercelによる自動デプロイ（mainブランチ）
3. コードレビューとCIを活用した品質管理
