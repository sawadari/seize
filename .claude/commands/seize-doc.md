---
description: "Seizeプロジェクトのドキュメントを生成"
---

# Seize Documentation Command

以下の手順でドキュメントを生成してください：

1. **Rustdocの生成**
   ```bash
   cargo doc --workspace --no-deps --open
   ```

2. **ドキュメントの確認項目**
   - 統一エージェント方程式の説明が含まれているか
   - すべてのpublic APIにドキュメントコメントがあるか
   - コード例が動作するか

3. **不足しているドキュメントの追加**
   ドキュメントコメントが不足している箇所を特定し、追加してください。

4. **例の追加**
   各主要構造体・関数に使用例を追加：
   ```rust
   /// # Examples
   /// ```
   /// use seize_core::World;
   /// let world = World::new();
   /// ```
   ```

ドキュメント生成が完了したら、レポートしてください。
