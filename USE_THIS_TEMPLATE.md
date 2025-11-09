# 🚀 このテンプレートの使い方

**AI Agent Development Framework Template**

このリポジトリをフォークして、あなた独自のAIエージェントプロジェクトを始めましょう！

---

## ⚡ クイックスタート（5分）

### 1. このテンプレートを使用

```bash
# GitHubでこのリポジトリを開き、"Use this template" ボタンをクリック
# または、フォーク
git clone https://github.com/YOUR_USERNAME/YOUR_PROJECT_NAME.git
cd YOUR_PROJECT_NAME
```

### 2. プロジェクト名を変更

```bash
# すべての "SEIZE" を あなたのプロジェクト名に置換
find . -type f -name "*.md" -exec sed -i '' 's/SEIZE/YOUR_PROJECT/g' {} +
find . -type f -name "*.toml" -exec sed -i '' 's/mahjong_ai/your_project/g' {} +
```

### 3. 不要なドキュメントを削除

```bash
# サンプルドキュメントを削除
rm -rf docs/youtube
rm -rf docs/tmux_visualization
rm docs/PROJECT_SUMMARY.md
rm docs/PROJECT_COMPLETION_SUMMARY.md
```

### 4. あなたのプロジェクトを定義

```bash
# README.mdを編集
code README.md

# CLAUDE.mdを編集（必要に応じて）
code CLAUDE.md
```

### 5. 開発開始！

```bash
# Rust実装を開始する場合
cargo new crates/your-core
cargo new crates/your-cli

# ドキュメントを書く
code docs/YOUR_DESIGN.md
```

---

## 📦 このテンプレートに含まれるもの

### ✅ 完成済み

1. **理論フレームワーク**
   - `.claude/UNIFIED_FORMULA.md` - 統一エージェント方程式
   - `.claude/LAW_OF_FLICKERING_SCENERY.md` - 瞬く景色の法則
   - `.claude/WORLD_MODEL_LOGIC.md` - 世界モデル論理
   - `.claude/INTENT_RESOLUTION.md` - 意図解決
   - `.claude/COMMAND_STACK.md` - コマンドスタック

2. **Claude Code統合**
   - `.claude/agents/` - 11種類の専門エージェント定義
   - `.claude/hooks/` - ライフサイクルフック
   - `.claude/commands/` - スラッシュコマンド
   - `.claude/skills/` - 再利用可能スキル

3. **PlantUML図**
   - `.claude/*.puml` - 15個のアーキテクチャ図
   - システム全体図、状態機械、実行フロー等

4. **ビジネスドキュメント**
   - `docs/business_plan/` - マスタープラン
   - `docs/fundraising/` - 資金調達戦略
   - `docs/marketing/` - マーケティング戦略
   - `docs/branding/` - ブランディング

5. **技術ドキュメント**
   - `docs/architecture-docs/` - アーキテクチャ詳細
   - `docs/guides/` - 実装ガイド
   - `docs/examples/` - 使用例

6. **学術論文**
   - `docs/paper_law_of_flickering_scenery.pdf`
   - `docs/paper_law_of_flickering_scenery.tex`
   - `docs/references.bib`

### ⚙️ カスタマイズ可能

1. **Cargo.toml**
   - Workspaceメンバー定義
   - 依存関係
   - プロジェクトメタデータ

2. **README.md**
   - プロジェクト説明
   - インストール手順
   - 使用方法

3. **CLAUDE.md**
   - エージェント方程式のカスタマイズ
   - ドメイン特化の原理

### ❌ 含まれていないもの（あなたが実装）

1. **Rustコード**
   - `crates/`ディレクトリは空
   - Cargo.tomlに設計図あり
   - 自由に実装できる

2. **テストコード**
   - テスト構造は未定義
   - 自由に追加可能

3. **CI/CD**
   - GitHub Actionsなし
   - 自由に設定可能

---

## 🎯 推奨カスタマイズパス

### Path 1: 軽量カスタマイズ（1時間）

**このテンプレートをそのまま使用、最小限の変更で開始**

1. プロジェクト名変更
2. README.md更新
3. 不要なサンプルドキュメント削除
4. 開発開始

**向いている人:**
- すぐに開発を始めたい
- 理論フレームワークを活用したい
- Claude Code統合を使いたい

### Path 2: 中程度カスタマイズ（1日）

**ドメイン特化の理論を追加**

1. Path 1を実行
2. `.claude/YOUR_DOMAIN_LOGIC.md`を追加
3. カスタムエージェント定義
4. ドメイン特化のPlantUML図作成
5. ビジネス計画のカスタマイズ

**向いている人:**
- 特定ドメインに特化したい
- 独自の理論を組み込みたい
- ビジネス展開も視野に入れている

### Path 3: フルカスタマイズ（1週間）

**完全にあなた独自のプロジェクトに変身**

1. Path 2を実行
2. 理論フレームワークの大幅変更
3. 独自のエージェント体系構築
4. 完全なRust実装
5. テスト・CI/CD整備
6. ドキュメント全面書き直し

**向いている人:**
- 完全にオリジナルなものを作りたい
- 本格的なプロダクトを目指す
- 長期的なプロジェクト

---

## 📂 ディレクトリガイド

### 最重要ファイル（必ず確認）

```
README.md                          # プロジェクト概要
CLAUDE.md                          # エージェント方程式
.claude/UNIFIED_FORMULA.md         # 統一方程式
.claude/LAW_OF_FLICKERING_SCENERY.md  # 核心理論
Cargo.toml                         # Rust設計図
```

### カスタマイズすべきファイル

```
README.md                          # あなたのプロジェクト説明に変更
Cargo.toml                         # package.name変更
.claude/agents/*.md                # ドメイン特化エージェント追加
docs/YOUR_DOCS/                    # あなたのドキュメント追加
```

### 削除しても良いファイル

```
docs/youtube/                      # YouTube戦略（不要なら削除）
docs/tmux_visualization/           # tmux可視化（不要なら削除）
docs/PROJECT_SUMMARY.md            # 元のプロジェクトサマリー
PROJECT_ORGANIZATION_REPORT.md     # 整理レポート
USE_THIS_TEMPLATE.md               # このファイル（読んだら削除可）
```

### 保持すべきファイル

```
.claude/UNIFIED_FORMULA.md         # 核心理論
.claude/WORLD_MODEL_LOGIC.md       # 世界モデル
.claude/agents/*.md                # エージェント定義（参考に）
docs/paper_law_of_flickering_scenery.pdf  # 学術論文
```

---

## 🔧 実装のヒント

### Rust実装を開始する

#### ステップ1: コアcrateを作成

```bash
# あなたのドメインに合わせて命名
cargo new crates/your-core --lib
```

```rust
// crates/your-core/src/lib.rs

/// あなたのドメインの世界状態
pub struct World {
    // あなたの状態定義
}

/// Intent Resolution
pub struct IntentResolver;

impl IntentResolver {
    pub fn resolve(&self, input: &str) -> Goal {
        // ℐ(Input) → Goal
    }
}

/// Command Stack
pub struct CommandStack;

impl CommandStack {
    pub fn decompose(&self, goal: &Goal) -> ExecutionPlan {
        // 𝒞(Goal) → ExecutionPlan
    }
}

/// World Transformation
pub struct WorldTransformer;

impl WorldTransformer {
    pub fn apply(&self, plan: ExecutionPlan, world: World) -> World {
        // Θ(Intent, World_t) → World_{t+1}
    }
}
```

#### ステップ2: CLIを作成

```bash
cargo new crates/your-cli --bin
```

```rust
// crates/your-cli/src/main.rs

use clap::{Parser, Subcommand};
use your_core::*;

#[derive(Parser)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Start your agent
    Start {
        #[arg(short, long)]
        input: String,
    },
}

fn main() {
    let cli = Cli::parse();

    match cli.command {
        Commands::Start { input } => {
            // Agent実行
            let resolver = IntentResolver::new();
            let goal = resolver.resolve(&input);
            println!("Goal: {:?}", goal);
        }
    }
}
```

#### ステップ3: Cargo.tomlを更新

```toml
[workspace]
members = [
    "crates/your-core",
    "crates/your-cli",
]

[workspace.dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1.0", features = ["full"] }
clap = { version = "4.4", features = ["derive"] }
```

### Claude Code統合を活用

#### カスタムエージェントを追加

```bash
# .claude/agents/your-agent.md を作成
cat > .claude/agents/your-agent.md << 'EOF'
---
name: your-agent
description: あなたのドメイン特化エージェント
tools: Read, Write, Bash, Grep
model: opus
---

# Your Custom Agent

## 専門分野
あなたのドメインに特化したタスクを処理

## 使用タイミング
- [具体的なシチュエーション1]
- [具体的なシチュエーション2]

## 実装詳細
[エージェントの振る舞いを記述]
EOF
```

#### カスタムコマンドを追加

```bash
# .claude/commands/your-command.md を作成
cat > .claude/commands/your-command.md << 'EOF'
---
description: "あなたのカスタムコマンド"
---

# Your Custom Command

[コマンド実行時のプロンプト]
EOF
```

---

## 🎨 ビジネスモデルのカスタマイズ

### ビジネス計画を更新

```bash
# あなたのビジネスモデルに合わせて編集
code docs/business_plan/MASTER_BUSINESS_PLAN.md
```

**カスタマイズポイント:**
1. ターゲット市場
2. 収益モデル
3. 競合優位性
4. 資金調達計画
5. マイルストーン

### マーケティング戦略を更新

```bash
# あなたの市場に合わせて編集
code docs/marketing/00_EXECUTIVE_SUMMARY.md
```

**カスタマイズポイント:**
1. ターゲットペルソナ
2. コンテンツ戦略
3. SNS戦略
4. PRアプローチ
5. KPI設定

---

## 🚀 公開準備

### GitHub設定

#### 1. Template Repository化

```bash
# GitHubリポジトリ設定で:
Settings → Template repository → チェック
```

#### 2. README.mdバッジ追加

```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Use this template](https://img.shields.io/badge/Use%20this%20template-success.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/generate)
```

#### 3. Topics設定

```
Settings → Topics:
- ai-agent
- template
- rust
- claude-code
- flickering-scenery
- [あなたのドメイン]
```

### ライセンス選定

**推奨:**
- **MIT License** - 最も自由度が高い
- **Apache 2.0** - 特許保護あり
- **GPL v3** - コピーレフト

```bash
# MITライセンスを追加
cat > LICENSE << 'EOF'
MIT License

Copyright (c) [年] [あなたの名前]

Permission is hereby granted, free of charge...
EOF
```

### コントリビューションガイド

```bash
# CONTRIBUTING.mdを作成
cat > CONTRIBUTING.md << 'EOF'
# Contributing to [YOUR_PROJECT]

## How to contribute

1. Fork this repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Code of Conduct

Be respectful and constructive.
EOF
```

---

## 📚 リソース

### 参考ドキュメント

- [統一エージェント方程式](.claude/UNIFIED_FORMULA.md)
- [瞬く景色の法則](.claude/LAW_OF_FLICKERING_SCENERY.md)
- [学術論文](docs/paper_law_of_flickering_scenery.pdf)

### 外部リンク

- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)
- [Rust Book](https://doc.rust-lang.org/book/)
- [PlantUML Guide](https://plantuml.com/)

### コミュニティ

- [Discussions](https://github.com/YOUR_USERNAME/YOUR_REPO/discussions)
- [Issues](https://github.com/YOUR_USERNAME/YOUR_REPO/issues)
- [Discord - Miyabi](https://discord.gg/ZpY9sxfYNm) - AIエージェント開発コミュニティ

---

## ❓ FAQ

### Q1: 実装コードが含まれていないのはなぜ？

A: このテンプレートは**理論・設計・ビジネスモデル**を提供します。実装はあなたのドメインに合わせて自由にカスタマイズできるようにしています。

### Q2: Rust以外の言語でも使える？

A: はい！理論フレームワークは言語非依存です。Python、TypeScript、Goなど、任意の言語で実装できます。

### Q3: 商用利用は可能？

A: はい（ライセンスによる）。MITライセンスを選択すれば、自由に商用利用できます。

### Q4: フォーク後も元のリポジトリとの同期は必要？

A: いいえ。フォーク後は完全に独立したプロジェクトです。自由にカスタマイズしてください。

### Q5: このテンプレートを使ったプロジェクトを共有したい

A: ぜひ！元のリポジトリのDiscussionsやShowcaseセクションで共有してください。

---

## 🎉 成功事例（あなたのプロジェクトを追加してください！）

このテンプレートを使った素晴らしいプロジェクト:

- **[プロジェクト名]** - [簡単な説明] ([GitHub](リンク))
- あなたのプロジェクトをここに追加！

---

## 💬 サポート

質問や問題がある場合:

1. [Discussions](https://github.com/YOUR_USERNAME/YOUR_REPO/discussions) で質問
2. [Issues](https://github.com/YOUR_USERNAME/YOUR_REPO/issues) で問題報告
3. [Discord](#) でリアルタイムサポート

---

## 🙏 謝辞

このテンプレートを使用してくださり、ありがとうございます！

あなたの素晴らしいプロジェクトを楽しみにしています。

**Happy Coding! 🚀**

---

*"Through infinite blinks, the world converges to its ideal."*
*「無限の瞬きの先に、理想は現実となる」*
