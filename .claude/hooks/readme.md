# Claude Code Hooks - VOICEVOX Integration

**霊夢と魔理沙がClaude Codeの操作を自動で読み上げます！**

## 🎤 機能

- **自動音声読み上げ**: Claude Codeのツール実行時に霊夢・魔理沙が喋る
- **キャッシュ対応**: 一度生成した音声は再利用（高速）
- **非同期再生**: Claude Codeの動作をブロックしない
- **自動フェールセーフ**: VOICEVOXが起動していなくても正常動作

## 🚀 使い方

### 1. VOICEVOXインストール & 起動
```bash
brew install --cask voicevox
open -a VOICEVOX
```

### 2. テスト
```bash
.claude/hooks/voicevox-narration.sh tool-call Read
```

### 3. Claude Codeを使うと自動で喋ります！

## 🎭 読み上げ例

- `Read` → 霊夢: "ファイルを読むよ！"
- `Write` → 魔理沙: "ファイルに書き込むぜ"
- `Task` → 霊夢→魔理沙: "エージェントを起動したよ！" → "複雑な作業を分解して実行するんだ"

詳細は完全版ドキュメント参照: `/devb/seize/docs/tmux_visualization/voicevox/`
