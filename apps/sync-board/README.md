# Sync Board

Loro CRDT と React Flow を使ったリアルタイム協調ホワイトボード。
WebSocket サーバーを介して、異なるブラウザ・デバイス間でノードの移動・追加・削除がリアルタイムに同期される。

## アーキテクチャ

```
Browser ←WebSocket→ Relay Server ←WebSocket→ Browser
```

各ブラウザとサーバーが LoroDoc を持ち、CRDT でマージする。

- **同期プロトコル**: 接続時にサーバーからスナップショット送信 → 以降はデルタ更新をブロードキャスト
- **データモデル**: LoroMap でノード/エッジを個別管理 (プロパティ単位の CRDT マージ)

## Getting Started

### 開発サーバー

2つのターミナルで並行起動:

```bash
pnpm board:server dev  # WS サーバー port 3001
pnpm board dev         # Next.js port 3000
```

### 環境変数

| 変数名 | デフォルト | 説明 |
|--------|-----------|------|
| `NEXT_PUBLIC_WS_URL` | `ws://localhost:3001` | WebSocket サーバーの URL |

## Technologies Used

- [Loro CRDT](https://loro.dev/)
- [React Flow (@xyflow/react)](https://reactflow.dev/)
- [Next.js 16](https://nextjs.org/) (App Router)
- [WebSocket (ws)](https://github.com/websockets/ws)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [next-themes](https://github.com/pacocoursey/next-themes)
