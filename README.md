# nijiviewer

This is an application for displaying information on NijiSanji Libraries in an easy-to-read format, and is being created as an exercise in Next.js.  
This project uses the Turborepo template.

## 機能

- ニジサンジライバーの配信情報表示
- ライバー検索
- 組織フィルタリング
- YouTube動画のアプリ内再生
- ユーザー認証機能（Supabase Authentication）

### ユーザー認証

このアプリケーションではSupabaseを使用してユーザー認証機能を実装しています。
- ログインなしでも基本機能は使用可能
- ログインすることで追加機能（お気に入りなど）が使用可能になります
- メールアドレスとパスワードを使用した認証に対応

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## E2Eテスト (Playwright)

このプロジェクトではE2Eテストに[Playwright](https://playwright.dev/)を使用しています。

### セットアップ

リポジトリをクローンした後、Playwrightのセットアップを行います：

```bash
# 依存関係のインストール
npm install

# Playwrightブラウザのインストール
npx playwright install
```

### テストの実行

Playwrightテストを実行するためのnpm scriptが用意されています：

```bash
# すべてのブラウザでテストを実行
npm run test:e2e

# 特定のブラウザ（Chromiumのみ）でテストを実行
npm run test:e2e -- --project=chromium

# UIモードでテストを実行（視覚的なデバッグが可能）
npm run test:e2e:ui

# デバッグモードでテストを実行
npm run test:e2e:debug

# テストレポートを表示
npm run test:e2e:report
```

### テストの作成

新しいテストを作成する場合は、次のようにコードジェネレーターを使用できます：

```bash
# Playwrightコードジェネレーターを起動
npm run test:e2e:codegen
```

コードジェネレーターを使用すると、ブラウザ上での操作が自動的にPlaywrightのテストコードに変換されます。

テストファイルは `apps/web/test/e2e/` ディレクトリに配置してください。
