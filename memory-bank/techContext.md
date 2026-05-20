# 技術コンテキスト

## 開発環境

1. フレームワーク

   - Next.js 16+ (App Router)
   - React 19+
   - TypeScript 6+

2. スタイリング

   - Tailwind CSS
   - CSS Modules
   - NextUI

3. 状態管理

   - React Server Components
   - React Context
   - React Query

4. テスト
   - Vitest 4.x（unit + Storybook の 2 プロジェクト構成）
   - Testing Library
   - Storybook（`@storybook/nextjs-vite`）
   - Playwright（E2E + Storybook ブラウザモード）
   - MSW（HTTP モック）
   - アプリ別カバレッジ threshold（`packages/vitest-config` の `defineAppVitestConfig`）

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

   - Biome（リンター・フォーマッター。ESLint / Prettier は使用しない）
   - cspell（スペルチェック）

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

   - pnpm（バージョンは `.mise.toml` で pin、現状 10.33.4）
   - Turborepo（モノレポ管理）
   - mise（Node.js LTS と pnpm のランタイム pin）

2. 主要依存パッケージ
   ```json
   {
     "@heroui/react": "latest",
     "next": "^16.0.0",
     "react": "^19.0.0",
     "react-dom": "^19.0.0",
     "tailwindcss": "^4.0.0",
     "typescript": "^6.0.0",
     "@supabase/ssr": "latest",
     "@supabase/supabase-js": "latest",
     "neverthrow": "^8.0.0"
   }
   ```

### パッケージ管理

- pnpm workspaces を使用しているため、パッケージのインストールは以下のコマンドで行う
  ```bash
  pnpm add -E [パッケージ名] --filter [ワークスペース名]
  ```
  例: apps/nijiviewer に開発用パッケージをインストールする場合
  ```bash
  pnpm add -DE [パッケージ名] --filter @oichan/nijiviewer
  ```

## 開発プロセス

1. ローカル開発

   ```bash
   mise install       # Node.js / pnpm のランタイムを揃える
   pnpm install       # 依存関係のインストール
   pnpm dev           # 開発サーバー起動（nijiviewer は http://localhost:3000）
   pnpm test          # ユニットテスト実行
   pnpm test:coverage # カバレッジ計測（threshold 検証含む）
   pnpm build         # プロダクションビルド
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
4. カバレッジ閾値はアプリ別に「現状値 -5pt」で初期設定し、CI で退行検知。テスト追加に合わせて段階的に引き上げる
5. `pnpm test:coverage` の集約は `scripts/merge-coverage.mjs` で行う。古い `coverage/` が残っていると 0% など誤表示の原因になるため、信頼性を確認したい時は `rm -rf coverage apps/*/coverage` してから再計測する
6. `new` を伴うコンストラクタモック（例: `window.YT.Player`）は、vitest 4.x で `vi.fn(arrow)` が "is not a constructor" になる。`vi.fn(function NamedCtor(){...})` で named function を使う

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
