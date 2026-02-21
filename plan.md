# モノレポ再構成計画: Nijiviewer 機能分離

## 目的

Nijiviewer を「VTuber の動画を見るための機能」に特化させ、それ以外の独立した機能を別アプリとして `apps/` 配下に切り出す。これにより、各アプリの関心事を分離しつつ、共有パッケージによるメンテナンス性を維持する。

## 現在の構成

- `apps/docs`: ドキュメント
- `apps/web`: Nijiviewer 本体（音声生成やホワイトボード機能が混在）

## 目指す構成

- `apps/docs`: 変更なし
- `apps/nijiviewer` (旧 `apps/web`): VTuber 動画視聴特化アプリ
- `apps/voice-generator`: 音声関連アプリ（Aivis Cloud API、ローカル実行等）
- `apps/sync-board`: 多人数同時編集ホワイトボード（Loro 活用）
- `packages/ui`: 共通 UI コンポーネント
- `packages/shared`: (必要に応じて) 共通のユーティリティや定数

## 実施ステップ

### 1. `apps/web` のリネーム

- `apps/web` を `apps/nijiviewer` にリネーム。
- `package.json` の `name` を `@nijiviewer/web` から `@oichan/nijiviewer` (または適した名前) に変更。
- 依存関係（`apps/docs` 等からの参照）を確認・修正。

### 2. `apps/voice-generator` の作成

- 新しい Next.js または React プロジェクトを `@oichan/voice-generator` に作成。
- `apps/nijiviewer/app/aivis-cloud-api` 以下のロジックとコンポーネントを移行。
- ローカル exe 呼び出しの基盤を準備。
- private にする

### 3. `apps/sync-board` の作成

- 新しい Next.js プロジェクトを `@oichan/sync-board` に作成。
- `apps/nijiviewer/app/flow-sample` および `LoroFlowSync.tsx` 関連の機能を移行。

### 4. 共通資産の整理 (`packages/`)

- `apps/nijiviewer` に残っている汎用的なコンポーネント（`theme-switch`, `navbar` 等）のうち、他アプリでも使うものを `packages/ui` または `packages/shared` に移動。

### 5. 開発環境の整備

- `turbo.json` の設定を確認し、各アプリを個別に実行・ビルドできるように調整。
- `pnpm-workspace.yaml` に新しいパスが含まれていることを確認。

## 検討事項

- **認証の共有**: 各アプリ間でログイン状態を共有する必要があるか？（まずは独立で進める）
- **UI の統一感**: `packages/ui` を通じたデザインシステムの適用。
- **デプロイ設定**: `voice-generator` はローカル実行のみとするための環境構築。
