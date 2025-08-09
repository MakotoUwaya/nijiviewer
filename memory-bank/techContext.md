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

   - VTuber 配信情報の取得
   - リアルタイムステータス
   - アーカイブ情報

2. Supabase

   - ユーザー認証
     - メール/パスワード認証
     - セッション管理
     - 認証状態の保持（Cookie）
     - ミドルウェアによるルート保護
   - データ永続化（今後実装予定）
     - お気に入り情報の保存
     - ユーザー設定の管理
   - リアルタイム更新（今後実装予定）

3. AIVIS API

   - テキスト音声合成（TTS）
   - 音声モデルボイス生成
   - リアルタイムストリーミング対応
   - サーバーサイド API ルート（/api/tts/synthesize）
   - 環境変数による認証（AIVIS_API_TOKEN）

4. Vercel
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
     "typescript": "^5.0.0",
     "@supabase/ssr": "latest",
     "@supabase/supabase-js": "latest"
   }
   ```

### パッケージ管理

- npm workspaces を使用しているため、パッケージのインストールは以下のコマンドで行う
  ```bash
  npm install -E [パッケージ名] -w [ワークスペース名]
  ```
  例: apps/web に開発用パッケージをインストールする場合
  ```bash
  npm install -DE [パッケージ名] -w apps/web
  ```

## 開発プロセス

1. ローカル開発

   ```bash
   npm install       # 依存関係のインストール
   npm run dev       # 開発サーバー起動
   npm run test      # テスト実行
   npm run build     # プロダクションビルド
   ```

2. デプロイメント
   - main ブランチへのマージで自動デプロイ
   - プレビューデプロイの活用
   - ステージング環境の利用

## タスク対応時に気を付けること

### 実装パターン

1. 経過時間計算のようなロジックは、再利用可能な純粋関数として実装
2. 値の切り詰め（100 文字制限）と全文表示（ツールチップ）の組み合わせは良い UX パターン
3. モバイル・デスクトップで適切に情報量を調整する際は、重要度で優先順位付け

### テスト設計

1. 年月計算のような日付処理は、エッジケース（年末年始）の考慮が重要
2. システム時刻に依存するテストは、vi.setSystemTime でモック化
3. 各条件分岐のテストケースは、コメントで期待値を明記すると意図が伝わりやすい

### コミット管理

1. 型定義の更新は独立したコミットにすることで変更の追跡が容易に
2. git status で未コミットの変更を確認することの重要性
3. API パラメータの更新は型定義と合わせてコミットするとよい

### UI/UX 設計

1. 情報の優先度：必須情報 → 補足情報（英語名やチャンネル説明）
2. デスクトップでは豊富な情報を表示しつつ、モバイルでは重要な情報に絞る
3. Twitter/X などの外部リンクは、アイコンと外部リンク表示で意図を明確に

### 認証機能関連

1. ユーザー状態：ログイン状態の確認には`useAuth`フックを使用する
2. セキュリティ：環境変数を適切に設定し、API キーの保護に注意
3. エラーハンドリング：認証エラーを適切に処理し、ユーザーに分かりやすく表示
4. ログイン状態の読み込み中は適切なローディング表示で UX を向上
5. 認証情報の更新は最新の Supabase SSR ライブラリ（`@supabase/ssr`）を使用

### 音声合成機能関連

1. Web Audio API：円形スペクトラムビジュアライザーの実装
2. MediaSource API：リアルタイムストリーミング再生（Chrome、Edge 対応）
3. ManagedMediaSource：iOS Safari 17.1+での対応
4. API ルート：`/api/tts/synthesize`でサーバーサイド処理
5. 環境変数：`AIVIS_API_TOKEN`で API キーを安全に管理
6. セキュリティ：クライアントに API キーを露出しない設計
7. エラーハンドリング：音声生成失敗時の適切なフィードバック
8. ブラウザ対応：Chrome 推奨、Safari/Edge/Firefox 一部制限あり
