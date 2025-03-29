# 技術コンテキスト

## 開発環境

1. フレームワーク
   - Next.js 15+ (App Router)
   - React 18+
   - TypeScript 5+

2. スタイリング
   - Tailwind CSS
   - CSS Modules
   - NextUI

3. 状態管理
   - React Server Components
   - React Context
   - React Query

4. テスト
   - Vitest
   - Testing Library
   - Storybook

## 外部サービス

1. Holodex API
   - VTuber配信情報の取得
   - リアルタイムステータス
   - アーカイブ情報

2. Supabase
   - ユーザー認証
   - データ永続化
   - リアルタイム更新

3. Vercel
   - アプリケーションホスティング
   - Edge Functions
   - Analytics

## 開発ツール

1. コード品質
   - ESLint
   - Prettier
   - Biome

2. CI/CD
   - GitHub Actions
   - Vercel デプロイメント
   - Chromatic

3. モニタリング
   - Vercel Analytics
   - Microsoft Clarity
   - Error Tracking

## 依存関係管理

1. パッケージマネージャー
   - npm
   - Turborepo (モノレポ管理)

2. 主要依存パッケージ
   ```json
   {
     "@nextui-org/react": "latest",
     "next": "^15.0.0",
     "react": "19.1.0",
     "react-dom": "19.1.0",
     "tailwindcss": "^3.0.0",
     "typescript": "^5.0.0"
   }
   ```

## 開発プロセス

1. ローカル開発
   ```bash
   npm install        # 依存関係のインストール
   npm run dev       # 開発サーバー起動
   npm run test      # テスト実行
   npm run build     # プロダクションビルド
   ```

2. デプロイメント
   - mainブランチへのマージで自動デプロイ
   - プレビューデプロイの活用
   - ステージング環境の利用
