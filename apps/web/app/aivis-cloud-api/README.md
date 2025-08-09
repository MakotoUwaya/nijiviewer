# おしゃべり音声モデル

AIVIS API を使用して、テキストを音声に変換し、円形のオーディオスペクトラムビジュアライザーと共に再生するページです。

## 環境変数の設定

このページを動作させるには、AIVIS API トークンを環境変数として設定する必要があります。

### Vercel での設定方法

1. Vercel のプロジェクトダッシュボードにアクセス
2. `Settings` → `Environment Variables` に移動
3. 以下の環境変数を追加：

```
Name: AIVIS_API_TOKEN
Value: <YOUR_AIVIS_API_TOKEN>
```

### ローカル開発環境での設定方法

プロジェクトルートに `.env.local` ファイルを作成し、以下を追加：

```env
AIVIS_API_TOKEN=<YOUR_AIVIS_API_TOKEN>
```

## 機能

- テキスト入力による音声合成
- リアルタイムストリーミング再生
- 円形オーディオスペクトラムビジュアライザー
- レスポンシブデザイン対応

## 技術仕様

- **音声合成**: AIVIS API (サーバーサイドで処理)
- **API ルート**: `/api/tts/synthesize` (API キーを安全に管理)
- **ストリーミング**: MediaSource API / ManagedMediaSource (iOS Safari 対応)
- **ビジュアライザー**: Web Audio API
- **フレームワーク**: Next.js 15+ (React)
- **UI**: NextUI
- **スタイリング**: Tailwind CSS + styled-jsx

## ブラウザ対応

- Chrome (推奨)
- Safari (iOS 17.1+で ManagedMediaSource 対応)
- Edge
- Firefox (一部制限あり)

## 注意事項

- 音声の自動再生にはユーザーインタラクションが必要です
- Safari では「自動再生」設定を「すべてのメディアを自動再生」に設定する必要があります
- API キーはサーバーサイドで処理されるため、クライアントに露出しません

## セキュリティ

- AIVIS API トークンは `AIVIS_API_TOKEN` 環境変数として設定
- クライアントサイドではなく、Next.js API ルートを通じてアクセス
- API キーの漏洩を防ぐためのサーバーサイド実装
