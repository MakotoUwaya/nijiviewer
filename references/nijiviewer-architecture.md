# Nijiviewer アーキテクチャ詳細

## ルート構成（App Router: apps/nijiviewer）

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

## データフロー

- **Holodex API** (`https://holodex.net/api/v2`): ライブ配信メタデータ・チャンネル検索。`x-apikey` ヘッダーに `HOLODEX_APIKEY` を使用。全リクエストで `noStore()` でキャッシュ無効化。
- **Supabase**: 認証（メール/パスワード）＋ DB（お気に入り、組織、ユーザー設定）。サーバーサイドは `@supabase/ssr` + Cookie セッション（`lib/supabase-server.ts`）、クライアントサイドは `@supabase/supabase-js`（`lib/supabase.ts`）。
- **YouTube IFrame API**: `useYouTubeApi` フックによるインページ動画再生。

## 主要 Supabase テーブル

- `favorite_livers`: `(user_id, liver_id)`
- `organizations`: 組織一覧
- `user_favorite_organizations`: ユーザーの優先組織（ソート順付き）

## コンテキストプロバイダー（ルートレイアウト）

- `AuthProvider` (`auth-context.tsx`): ユーザー・セッション状態、signIn/signUp/signOut
- `PreferencesContext` (`preferences-context.tsx`): お気に入り組織（楽観的更新あり）
- `SidebarContext` (`sidebar-context.tsx`): ナビゲーションサイドバーの開閉状態
