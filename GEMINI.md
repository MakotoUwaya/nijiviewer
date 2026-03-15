@./AGENTS.md

## Gemini CLI 日本語入力の既知の問題

- VSCode の統合ターミナルで Gemini CLI を使用すると、IME の未変換文字列がある状態で入力欄がスライドしていく不具合がある
- 原因: Gemini CLI が依存する ink ライブラリが IME の composition イベントを適切に処理できず、VSCode のターミナルレンダラーとの相性で発生する
- **Windows Terminal では問題なく日本語入力が可能**
- 回避策:
  - Gemini CLI は Windows Terminal で使用する
  - VSCode 内で使う場合はコピー&ペーストで日本語を入力する
