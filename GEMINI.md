@./AGENTS.md

### Gemini CLI (ink) の VSCode 日本語入力不具合
- **事実**: VSCode 統合ターミナルで Gemini CLI を利用すると、IME 入力中に未変換文字列がスライド・乱れる現象が発生する（Windows Terminal では正常）。
- **理由**: ink ライブラリが IME composition イベントを正しく処理できず、VSCode ターミナルレンダラーと競合するため。
- **適用**: 対話入力は Windows Terminal を利用するか、VSCode 内ではクリップボード経由でペースト入力すること。
