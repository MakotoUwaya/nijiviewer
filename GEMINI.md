# Nijiviewer プロジェクト概要

このプロジェクトは、にじさんじ（VTuber）の配信情報を表示するアプリケーション「Nijiviewer」を中心とした、Turborepo によるモノレポ構成のプロジェクトです。

## プロジェクト構成

### アプリケーション (`apps/`)
- **nijiviewer** (`@oichan/nijiviewer`): メインの視聴アプリケーション。Next.js (App Router) を使用。
- **voice-generator** (`@oichan/voice-generator`): Aivis Cloud API を活用した音声生成アプリ。
- **sync-board** (`@oichan/sync-board`): Loro CRDT と React Flow を使用した多人数同時編集ホワイトボード。
- **docs** (`nextra-docs`): Nextra によるドキュメントサイト。

### パッケージ (`packages/`)
- **ui**: 共有 UI コンポーネント。
- **tsconfig**: 共有 TypeScript 設定。

## 主要技術スタック
- **フレームワーク**: Next.js 15+, React 19+
- **言語**: TypeScript
- **モノレポ管理**: Turborepo, pnpm
- **スタイリング**: Tailwind CSS (v4), HeroUI
- **認証/DB**: Supabase
- **静的解析/フォーマット**: Biome
- **テスト**: Vitest (Unit), Playwright (E2E)

## 開発コマンド

### 全般
- `pnpm install`: 依存関係のインストール
- `pnpm dev`: 全アプリの開発サーバー起動
- `pnpm build`: 全アプリのビルド
- `pnpm lint`: 全アプリのリンター実行
- `pnpm format`: Biome によるコード整形
- `pnpm test`: 全アプリのユニットテスト実行
- `pnpm test:e2e`: Playwright による E2E テスト実行

### アプリ別ショートカット
- `pnpm viewer <command>`: Nijiviewer 本体の操作
- `pnpm voice <command>`: 音声生成アプリの操作
- `pnpm board <command>`: 同期ボードの操作
- `pnpm doc <command>`: ドキュメントサイトの操作

## 開発規約
- **コード品質**: Biome による静的解析を必須とし、コミット前に `pnpm lint` および `pnpm format` をパスすること。
- **命名規則**: 新しいアプリは原則として `@oichan/` プレフィックスを使用する。
- **コンテキスト管理**: `memory-bank/` ディレクトリにプロジェクトの進捗や設計思想を記録している。
- **環境変数**: Supabase 関連の変数はビルド時にも必要となるため、CI 環境ではダミー値等でガードされている（`lib/supabase.ts` 参照）。

## Gemini CLI 日本語入力の既知の問題

- VSCode の統合ターミナルで Gemini CLI を使用すると、IME の未変換文字列がある状態で入力欄がスライドしていく不具合がある
- 原因: Gemini CLI が依存する ink ライブラリが IME の composition イベントを適切に処理できず、VSCode のターミナルレンダラーとの相性で発生する
- **Windows Terminal では問題なく日本語入力が可能**
- 回避策:
  - Gemini CLI は Windows Terminal で使用する
  - VSCode 内で使う場合はコピー&ペーストで日本語を入力する
