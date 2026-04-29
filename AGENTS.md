# Nijiviewer — AI エージェント向け開発ガイド

## リポジトリ概要

Turborepo によるモノレポ構成。メインアプリ「Nijiviewer」（にじさんじ VTuber 配信情報ビューア）を中心に、関連アプリを収録。

**アプリ (`apps/`):**
- `nijiviewer` (`@oichan/nijiviewer`) — メインビューア。Next.js 16 App Router、Supabase 認証/DB、Holodex API を使用。
- `voice-generator` (`@oichan/voice-generator`) — Aivis Cloud API を使った音声合成アプリ。
- `sync-board` (`@oichan/sync-board`) — Loro CRDT + React Flow を使った多人数同時編集ホワイトボード。
- `sync-board-server` (`@oichan/sync-board-server`) — sync-board 用の WebSocket バックエンド。
- `docs` (`nextra-docs`) — Nextra + pagefind による静的ドキュメントサイト。

**パッケージ (`packages/`):**
- `ui` — 共有 React コンポーネント。
- `tsconfig` — 共有 TypeScript 設定 (`base.json`, `nextjs.json`, `react-library.json`)。
- `vitest-config` — 各アプリ共通の Vitest projects 設定（`defineAppVitestConfig`）。

---

## 開発コマンド

### 全アプリ共通（リポジトリルート）

```bash
pnpm install       # 依存関係のインストール
pnpm dev           # 全アプリの開発サーバー起動
pnpm build         # 全アプリのビルド
pnpm lint          # Biome リンター実行（全アプリ）
pnpm format        # Biome フォーマッター実行（全アプリ）
pnpm test          # Vitest ユニットテスト実行（全アプリ）
pnpm test:coverage # 各アプリでカバレッジ計測 → ルートに集約レポートを生成
pnpm test:e2e      # Playwright E2E テスト実行
pnpm test:e2e:ui   # Playwright インタラクティブ UI モード
pnpm test:e2e:debug
pnpm spell-check   # cspell によるスペルチェック
```

### アプリ別ショートカット

```bash
pnpm viewer <cmd>  # apps/nijiviewer 向け
pnpm voice <cmd>   # apps/voice-generator 向け
pnpm board <cmd>   # apps/sync-board 向け
pnpm doc <cmd>     # apps/docs 向け
```

### 特定アプリへの直接フィルタリング

```bash
pnpm --filter @oichan/nijiviewer <cmd>
```

### 単一テストの実行

```bash
# Vitest（単一ファイル or パターン指定）
pnpm viewer test --reporter=verbose <ファイル名>
pnpm viewer test -- -t "テスト名パターン"

# Playwright（単一テスト指定）
pnpm test:e2e --grep "テスト名"
```

---

## アーキテクチャ（apps/nijiviewer）

### ルート構成（App Router）

| ルート | 説明 |
|---|---|
| `/` | ホーム — 組織別ライブ動画一覧 |
| `/liver-search?q=` | ライバー（VTuber）検索 |
| `/liver/[channelId]` | ライバープロフィールページ |
| `/live-videos/[organizationName]` | 組織フィルタ済み動画一覧 |
| `/favorites` | 要認証：お気に入りライバーの動画 |
| `/favorites/edit` | お気に入りライバーの管理 |
| `/settings` | ユーザー設定 |
| `/api/auth/callback` | Supabase OAuth コールバック |
| `/api/image-proxy` | CORS 対応画像プロキシ（Bilibili 等の referer 検証あり）|
| `/api/videos/[type]` | Holodex API プロキシ（past/clips/collabs）|

### データフロー

- **Holodex API** (`https://holodex.net/api/v2`) — ライブ配信メタデータ・チャンネル検索。`x-apikey` ヘッダーに `HOLODEX_APIKEY` を使用。全リクエストで `noStore()` を使いキャッシュ無効化。
- **Supabase** — 認証（メール/パスワード）＋ DB（お気に入り、組織、ユーザー設定）。サーバーサイドは `@supabase/ssr` + Cookie セッション（`lib/supabase-server.ts`）、クライアントサイドは `@supabase/supabase-js`（`lib/supabase.ts`）。
- **YouTube IFrame API** — `useYouTubeApi` フックを通じたインページ動画再生。

### 主要 Supabase テーブル

- `favorite_livers` — `(user_id, liver_id)`
- `organizations` — 組織一覧
- `user_favorite_organizations` — ユーザーの優先組織（ソート順付き）

### コンテキストプロバイダー（ルートレイアウト）

- `AuthProvider` (`auth-context.tsx`) — ユーザー・セッション状態、signIn/signUp/signOut
- `PreferencesContext` (`preferences-context.tsx`) — お気に入り組織（楽観的更新あり）
- `SidebarContext` (`sidebar-context.tsx`) — ナビゲーションサイドバーの開閉状態

### エラーハンドリング

`lib/data.ts` 内の Holodex API 呼び出しはすべて `neverthrow` の `Result` 型を返す。呼び出し元は `Ok`/`Err` を明示的にハンドルすること。

### 画像ルーティング

外部画像はすべて `lib/image-utils.ts` の `getImageUrl()` → `/api/image-proxy` を経由する（data URI・相対パスはそのまま通過）。

---

## 開発規約

### コード品質

- **Biome** がリンティングとフォーマットの唯一のツール（ESLint・Prettier は使用しない）。
- Biome 設定: インデント 2 スペース、シングルクォート、末尾カンマあり、セミコロンあり、アロー括弧あり、JSX はダブルクォート。
- 強制ルール: `noUnusedImports`, `noUnusedVariables`, `useHookAtTopLevel`, `noParameterAssign`, `useSelfClosingElements`, `noUselessElse`。

### セルフチェック（コミット・push 前必須）

実装が一段落した時点で、以下をすべて green にすること。CI で初めてエラーに気付くのを避ける。

```bash
pnpm build   # Next.js の型チェック含むため省略不可
pnpm lint    # Biome
pnpm test    # Vitest（unit + Storybook の両プロジェクト）
```

`pnpm format` は変更を入れた直後に適宜実行。Storybook テストの初回は `pnpm exec playwright install chromium` が必要。

### TypeScript

- `packages/tsconfig` の共有プリセットを `workspace:*` で参照。
- `@` エイリアスはアプリルートに解決される（`vitest.config.mts` および Next.js で設定）。
- `useAsConstAssertion` を優先し、推論可能な型注釈は省略すること（`noInferrableTypes`）。

### テスト

- **ユニットテスト**（Vitest + jsdom）と **Storybook テスト**（`@storybook/addon-vitest` 経由の Playwright ブラウザモード）の 2 プロジェクト構成。共通設定は `packages/vitest-config` の `defineAppVitestConfig` で集約。
- カバレッジ対象は `app/`, `components/`, `hooks/`, `lib/` のホワイトリスト方式（`**/*.{ts,tsx}`）。`types/`, `.next/`, `*.d.ts`, stories/test/設定は exclude。
- Storybook テストの初回実行前に `pnpm exec playwright install chromium` が必要。
- Storybook フレームワークは `@storybook/nextjs-vite`（addon-vitest が Vite 前提のため）。ストーリーの `Meta` / `StoryObj` は `@storybook/react` から import すること（`nextjs-vite` 経由ではワイルドカード再エクスポートで型解決できない）。
- `apps/nijiviewer/test/setup.ts` でモック設定済み: `next/navigation`（useRouter, useSearchParams, usePathname）、Supabase クライアント（チェーン可能モック API）、認証コンテキスト。
- **E2E テスト**（Playwright）: `apps/nijiviewer/test/e2e/`。Chromium + Mobile Safari（iPhone 13）対象。実行時に開発サーバーを自動起動。

### 命名・パッケージ構成

- 新しいアプリのパッケージ名は `@oichan/` プレフィックスを使用する。
- Turbo パイプライン: `build` は `.next/**` と `dist/**` をキャッシュ、`dev`/`lint`/`format` はキャッシュなし。
- Turbo のグローバル環境変数: `HOLODEX_APIKEY` が変更されると全ビルドキャッシュが無効化される。
- `memory-bank/` ディレクトリにプロジェクトの進捗や設計思想を記録している。

---

## 必須環境変数

```bash
# apps/nijiviewer/.env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
HOLODEX_APIKEY=
```

Supabase 関連変数はビルド時にも必要。`lib/supabase.ts` は未設定時にエラーをスローする（CI ではダミー値でガード）。
