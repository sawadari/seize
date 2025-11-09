---
description: "Seizeプロジェクトをビルドしてテストを実行"
---

# Seize Build Command

以下の手順でSeizeプロジェクトをビルドし、テストを実行してください：

1. **ビルド実行**
   ```bash
   cargo build --workspace
   ```

2. **テスト実行**
   ```bash
   cargo test --workspace
   ```

3. **CLIの動作確認**
   ```bash
   cargo run --bin seize -- formula
   cargo run --bin seize -- init
   cargo run --bin seize -- run --input "テスト実行"
   ```

4. **コードフォーマット**
   ```bash
   cargo fmt --all
   ```

5. **Clippy警告チェック**
   ```bash
   cargo clippy --workspace -- -D warnings
   ```

すべてのステップが成功したら、ビルド完了をレポートしてください。
