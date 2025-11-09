## 🎯 統一エージェント方程式 (Unified Agent Formula)

```
𝔸(Input, World₀) = lim_{n→∞} [∫₀ⁿ (Θ ◦ 𝒞 ◦ ℐ)(t) dt] = World_∞
```

### 完全な定義

```
Where:
  ℐ : Intent Resolution (意図解決)
      Input → Fixed Goal

  𝒞 : Command Stack (コマンドスタック)
      Goal → Execution Plan
      𝒞 = C₃ ◦ C₂ ◦ C₁

  Θ : World Transformation (世界変換)
      World_t → World_{t+1}
      Θ = θ₆ ◦ θ₅ ◦ θ₄ ◦ θ₃ ◦ θ₂ ◦ θ₁

  ∫ : Continuous Integration (連続統合)
      各ステップの累積的適用

  lim : Convergence (収束)
      n→∞ で最適解に収束
```

### 基礎方程式（従来版）

```
Agent(Intent, World₀) = lim_{n→∞} (θ₆_{Learn} ◦ θ₅_{Integrate} ◦ θ₄_{Execute} ◦ θ₃_{Allocate} ◦ θ₂_{Generate} ◦ θ₁_{Understand})ⁿ(Intent, World₀)
```

**詳細**: `.claude/UNIFIED_FORMULA.md` を参照

---

## 🌍 World Model Logic - 世界モデルロジック

**概念**: 瞬く景色 (Mabataku Keshiki / Flickering Scenery)

エージェントが認識・操作する世界の状態とその遷移論理。

### World₀ (初期世界状態)
- ファイルシステム、コードベース、環境、外部リソース、コンテキスト、知識の完全な集合
- エージェントが動作を開始する時点における世界の完全なスナップショット

### 瞬く景色 (Flickering Scenery)
エージェントは世界を**離散的な「景色」として瞬間的に捉える**。各認識サイクルで世界は「瞬き」のように更新される。

```
World₀ → [瞬き] → World₁ → [瞬き] → World₂ → [瞬き] → World₃ → ... → World_∞
```

映画のフレーム（24fps）のように、世界は離散的なスナップショットとして認識され、各「瞬き」の間にエージェントは6つの変換（θ₁〜θ₆）を適用して世界を変換する。

**詳細**: `.claude/WORLD_MODEL_LOGIC.md` を参照

---

## 📖 フレームワーク構成

### 3つの核心コンポーネント

1. **ℐ: Intent Resolution** (意図解決)
   - ユーザーの曖昧な入力から明確な目標へ
   - Step-Back Questionによる本質的理解

2. **𝒞: Command Stack** (コマンドスタック)
   - 目標を実行可能なタスクに分解
   - [C1] 構造化 → [C2] プロンプト化 → [C3] 連鎖実行

3. **Θ: World Transformation** (世界変換)
   - 6つの変換フェーズによる世界状態の更新
   - 各タスク実行 = 1回の「瞬き」

**詳細**:
- `.claude/INTENT_RESOLUTION.md` - ℐの完全ドキュメント
- `.claude/COMMAND_STACK.md` - 𝒞の完全ドキュメント
- `.claude/WORLD_MODEL_LOGIC.md` - Θの完全ドキュメント
