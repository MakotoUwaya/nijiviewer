# Project Brief

## Overview
このプロダクトでは、主に2つの Web アプリケーションが含まれます。

### apps/docs
[nextra](https://nextra.site/) というサイトジェネレータフレームワークを用いて、技術記事や Blog を書いています。
コンテンツは Markdown ファイルだけで、特にフレームワーク以上のことを実現しようとしていないので、積極的に機能追加したり仕様変更することはありません。
nextra の仕様について質問したり、独自の拡張機能やプラグインなどの開発を依頼することはあるかも知れません。

### apps/web
nijiviewer のメインアプリです。
このアプリは Nextjs を用いて [Holodex/HoloAPI V2(2.0)](https://docs.holodex.net/) から VTuber の配信情報を取得し、画面に一覧表示する機能を有します。

## Core Features
- apps/docs
    - Technical documents
    - Blog
- apps/web
    - Provide VTuber Streaming Video Lists

## Target Users
VTuber の配信が好きで、リアルタイムで生配信を視聴したい人向けに、現在配信中の動画と、今後配信予定のある動画を表示します。
加えて、ログインをすることで、お気に入りの VTuber に絞って情報を表示したり、配信通知を受け取ったりすることができます。

## Technical Preferences (optional)
- Nextjs v15(App Router)
- React v19
- @heroui/react
    - tailwind v4
- neverthrow
- Storybook
- Chromatic
- Vitest
- @testing-library/dom
- @testing-library/react