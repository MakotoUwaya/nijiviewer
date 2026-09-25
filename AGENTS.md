# Nijiviewer — AI エージェント向け開発ガイド

Turborepo によるモノレポ構成（メインアプリ: `apps/nijiviewer`）。

- **アプリ (`apps/`)**: `nijiviewer` (Next.js 16 / Supabase / Holodex), `voice-generator` (Aivis Cloud), `sync-board` (Loro CRDT + React Flow), `sync-board-server` (WebSocket), `docs` (Nextra)
- **パッケージ (`packages/`)**: `ui`, `tsconfig`, `vitest-config`

---

## 開発コマンド

```bash
pnpm install       # 依存関係インストール
pnpm dev           # 全アプリ開発サーバー起動（nijiviewer: http://localhost:3000）
pnpm build         # 全アプリビルド
pnpm lint          # Biome リンター
pnpm format        # Biome フォーマッター
pnpm test          # Vitest ユニットテスト
pnpm test:coverage # カバレッジ集約レポート生成
pnpm test:e2e      # Playwright E2E テスト
pnpm spell-check   # cspell スペルチェック

# アプリ別
pnpm viewer <cmd>  # apps/nijiviewer
pnpm voice <cmd>   # apps/voice-generator
pnpm board <cmd>   # apps/sync-board
pnpm doc <cmd>     # apps/docs
pnpm --filter @oichan/nijiviewer <cmd>

# 単一テスト
pnpm viewer test --reporter=verbose <ファイル名>
pnpm viewer test -- -t "テスト名パターン"
pnpm test:e2e --grep "テスト名"
```

---

## 重要制約・アーキテクチャ規約

### エラーハンドリング
`lib/data.ts` の Holodex API 呼び出しはすべて `neverthrow` の `Result` 型を返す。予期せぬ例外を防ぐため、呼び出し元は `Ok`/`Err` を明示的にハンドリングすること。

### Supabase マイグレーション
- **Data API 最小権限原則**: `public` スキーマに追加したテーブル/シーケンス/関数は、必要な操作のみ `anon` / `authenticated` / `service_role` に明示的に `GRANT` すること（デフォルト権限に依存しない）。
- **RLS と GRANT**: 公開テーブルは RLS を有効化し、`GRANT` と対応ポリシーを同一マイグレーションに含めること。
- **シーケンス**: ID 採番でシーケンスを使う場合は対象ロールへの `USAGE` / `SELECT` を明示すること。

### 画像ルーティング
外部画像は CORS 及び referer 検証のため、必ず `lib/image-utils.ts` の `getImageUrl()` → `/api/image-proxy` を経由すること（data URI・相対パスはそのまま通過）。

### 詳細アーキテクチャ
ルート構成、データフロー、主要 DB テーブル、Context 一覧の詳細:
- [アーキテクチャ詳細リファレンス](file:///C:/Users/makot/ghq/github.com/MakotoUwaya/nijiviewer/references/nijiviewer-architecture.md)

---

## 開発規約

### セルフチェック（コミット・push 前必須）
CI エラー防止のため、実装完了時は必ず以下を全てパスさせること:
```bash
pnpm build   # Next.js 型チェック含むため省略不可
pnpm lint    # Biome
pnpm test    # Vitest（unit + Storybook）
```
※ 変更直後は `pnpm format` を適宜実行。Storybook テスト初回は `pnpm exec playwright install chromium` が必要。

### コード品質・Biome
Biome がリンティング・フォーマットの唯一のツール（ESLint/Prettier 不使用）。
- インデント 2 スペース、シングルクォート、末尾カンマあり、セミコロンあり、アロー括弧あり、JSX ダブルクォート。
- 強制ルール: `noUnusedImports`, `noUnusedVariables`, `useHookAtTopLevel`, `noParameterAssign`, `useSelfClosingElements`, `noUselessElse`。

### TypeScript
- 共有プリセット: `packages/tsconfig` を `workspace:*` で参照。
- パスエイリアス: `@` はアプリルートに解決。
- 型注釈: `useAsConstAssertion` 優先、推論可能な型注釈は省略（`noInferrableTypes`）。

### テスト
- **Vitest + Storybook (Playwright)**: 2 プロジェクト構成（共通設定: `packages/vitest-config`）。
- **カバレッジ対象**: `app/`, `components/`, `hooks/`, `lib/`（`**/*.{ts,tsx}`）。
- **Storybook 型定義**: ストーリーの `Meta` / `StoryObj` は `@storybook/react` からインポートすること（型解決維持のため）。
- **モック設定**: `apps/nijiviewer/test/setup.ts`（`next/navigation`, Supabase クライアント, 認証コンテキスト）。
- **E2E**: `apps/nijiviewer/test/e2e/`（Chromium + Mobile Safari）。

### 命名・パッケージ規約
- 新規アプリのパッケージ名は `@oichan/` プレフィックスを使用。
- Turbo キャッシュ: `build` は `.next/**`, `dist/**` をキャッシュ、`HOLODEX_APIKEY` 変更で全ビルドキャッシュが無効化。
- 進捗・設計思想の記録: `memory-bank/` ディレクトリ。

---

## 必須環境変数 & ツールチェーン

```bash
# apps/nijiviewer/.env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
HOLODEX_APIKEY=
```
※ Supabase 変数はビルド時にも必要（未設定時はエラー、CI ではダミー値ガード）。

- Node.js (LTS) & pnpm (12.4.1) は `.mise.toml` で管理（`mise install`）。
