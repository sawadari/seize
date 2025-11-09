# システムズエンジニアリングおよび要求工学を用いた要求開発

**統一エージェント方程式による要求工学の実装**

---

## 🎯 プロジェクト概要

このプロジェクトは、**システムズエンジニアリング**および**要求工学**の原則に基づいた
要求開発プロセスを、**統一エージェント方程式**を用いて実装したものです。

### コアコンセプト

```
要求開発 = 𝔸(ステークホルダーニーズ, World₀) → 要求仕様書
```

統一エージェント方程式を適用することで、以下のプロセスを自動化・支援します：

1. **ℐ (Intent Resolution)**: ステークホルダーの曖昧な要求から明確な目標へ
2. **𝒞 (Command Stack)**: 要求抽出→分析→仕様化→検証のタスク分解
3. **Θ (World Transformation)**: 要求仕様書の段階的な構築

---

## 📚 理論的基盤

### 1. システムズエンジニアリング

**ISO/IEC/IEEE 15288 準拠**

システムライフサイクルプロセスに基づく体系的アプローチ：

- **ステークホルダーニーズと要求定義プロセス**
- **システム要求定義プロセス**
- **アーキテクチャ定義プロセス**
- **設計定義プロセス**

### 2. 要求工学

**ISO/IEC/IEEE 29148 準拠**

要求の特性（5C原則）：

| 特性 | 英語 | 説明 |
|------|------|------|
| **明確性** | Clear | 曖昧さがなく一意に解釈できる |
| **検証可能性** | Verifiable | テスト可能な受入基準がある |
| **完全性** | Complete | 必要な情報がすべて含まれる |
| **一貫性** | Consistent | 他の要求と矛盾しない |
| **実現可能性** | Feasible | 技術的・経済的に実現可能 |

### 3. 人間中心AI時代の組織憲章

すべての要求開発プロセスは組織憲章に準拠：

- **最終判断は人間が行う** - AI自動判断の禁止
- **意思決定の記録** - すべての要求決定を記録
- **説明可能性の維持** - トレーサビリティの確保
- **最小限データ原則** - 必要十分な情報のみ収集

---

## 🔧 実装アーキテクチャ

### モジュール構成

```
seize-core/
└── requirements.rs       # 要求工学モジュール
    ├── Requirement       # 要求構造体
    ├── RequirementType   # 機能要求・非機能要求・制約
    ├── RequirementsEngineer  # 要求エンジニア
    └── RequirementsSpecification  # 要求仕様書

seize-cli/
├── main.rs              # CLIエントリーポイント
└── requirements_handler.rs  # 要求コマンドハンドラー
```

### データモデル

#### 要求 (Requirement)

```rust
pub struct Requirement {
    pub id: String,                    // REQ-001, FR-001, NFR-001
    pub req_type: RequirementType,     // 機能/非機能/制約
    pub description: String,           // 要求の記述
    pub priority: RequirementPriority, // Must/Should/Could/Won't
    pub stakeholders: Vec<String>,     // ステークホルダー
    pub acceptance_criteria: Vec<AcceptanceCriterion>,  // 受入基準
    pub traceability: Traceability,    // トレーサビリティ
    pub verification_method: VerificationMethod,  // 検証方法
    pub status: RequirementStatus,     // ステータス
    pub metadata: HashMap<String, String>,  // メタデータ
}
```

#### 要求の種類

```rust
pub enum RequirementType {
    Functional,                        // 機能要求
    NonFunctional { category },        // 非機能要求
    System,                            // システム要求
    Business,                          // ビジネス要求
    User,                              // ユーザー要求
    Constraint,                        // 制約
    Interface,                         // インターフェース要求
}
```

#### 受入基準 (Acceptance Criterion)

```rust
pub struct AcceptanceCriterion {
    pub given: String,   // Given: 前提条件
    pub when: String,    // When: アクション
    pub then: String,    // Then: 期待される結果
    pub measurable: bool,  // 測定可能性
}
```

---

## 🛠️ 使用方法

### 1. プロジェクトの初期化

```bash
seize requirements init --project "MyProject" --output-dir "."
```

ディレクトリ構造が作成されます：

```
MyProject/
├── README.md
├── stakeholders/
│   └── interview_template.md
├── requirements/
└── analysis/
```

### 2. ステークホルダーインタビュー

`stakeholders/product_owner_interview.md` を作成：

```markdown
# ステークホルダーインタビュー

**日時**: 2025-01-15
**インタビュー対象**: Product Owner

## 主要な要求

1. システムはユーザー認証機能を提供する必要がある
2. ログイン処理は1秒以内に完了するべき
3. パスワードは暗号化して保存する必要がある
```

### 3. 要求の抽出

```bash
seize requirements elicit \
  --input "stakeholders/product_owner_interview.md" \
  --stakeholder "Product Owner" \
  --project "MyProject" \
  --output "requirements/requirements_v1.json"
```

出力例：

```json
{
  "project_name": "MyProject",
  "version": "1.0.0",
  "requirements": [
    {
      "id": "REQ-001",
      "req_type": "User",
      "description": "システムはユーザー認証機能を提供する必要がある",
      "priority": "Should",
      "stakeholders": ["Product Owner"],
      "acceptance_criteria": [],
      "status": "Proposed"
    }
  ]
}
```

### 4. 要求の分析

```bash
seize requirements analyze \
  --spec "requirements/requirements_v1.json" \
  --report "analysis/analysis_report_v1.md"
```

分析レポート例：

```markdown
# 要求分析レポート - MyProject

バージョン: 1.0.0
要求数: 3

---

## REQ-001: システムはユーザー認証機能を提供する必要がある
**ステータス**: ⚠️ 問題あり

**問題点**:
- 受入基準が定義されていません（検証可能性）

**推奨事項**:
- Given-When-Then形式の受入基準を追加してください
- 上位要求とのトレーサビリティを確立してください
```

### 5. トレーサビリティマトリクス生成

```bash
seize requirements trace \
  --spec "requirements/requirements_v1.json" \
  --format "markdown" \
  --output "analysis/traceability_matrix.md"
```

---

## 📊 要求開発プロセス

### Phase 1: 要求抽出 (Elicitation)

**技法**：
- インタビュー
- ワークショップ
- プロトタイピング
- 観察
- ドキュメント分析

**成果物**：
- ステークホルダーインタビュー記録
- 初期要求リスト

### Phase 2: 要求分析 (Analysis)

**チェック項目**：
1. 明確性（Clear）- 曖昧な表現がないか
2. 検証可能性（Verifiable）- 受入基準が定義されているか
3. 完全性（Complete）- 必要な情報が含まれているか
4. 一貫性（Consistent）- 他の要求と矛盾していないか
5. 実現可能性（Feasible）- 実装可能か

**成果物**：
- 要求分析レポート
- 問題点リスト
- 推奨事項リスト

### Phase 3: 要求仕様化 (Specification)

**記述方法**：

#### 機能要求テンプレート

```
REQ-F-XXX: システムは、<主語>が<動作>できるようにする必要がある。

条件: <前提条件>

受入基準:
  Given: <前提状態>
  When: <実行アクション>
  Then: <期待結果>

優先度: Must/Should/Could/Won't
ステークホルダー: <役割>
検証方法: Test/Inspection/Analysis/Demonstration
```

#### 非機能要求テンプレート

```
REQ-NFR-XXX (<カテゴリ>): システムは、<品質特性>を<測定可能な値>で
                          満たす必要がある。

測定方法: <具体的な測定手順>
目標値: <数値>
許容範囲: <範囲>

優先度: Must/Should/Could/Won't
検証方法: Test/Analysis
```

### Phase 4: 要求検証 (Validation)

**質問**：
- 正しいシステムを作っているか？
- ステークホルダーのニーズを満たしているか？
- 要求は実現可能か？
- 要求は検証可能か？

**成果物**：
- 検証レポート
- ステークホルダー承認記録

### Phase 5: 要求管理 (Management)

**トレーサビリティ**：

```
ビジネス要求 (BR)
    ↓
ユーザー要求 (UR)
    ↓
システム要求 (SR)
    ↓
機能要求 (FR) / 非機能要求 (NFR)
    ↓
設計 (DS)
    ↓
実装 (CODE)
    ↓
テスト (TC)
```

**変更管理**：
- 変更要求の記録
- 影響分析
- トレーサビリティの更新

---

## 🎓 ベストプラクティス

### 1. SMART原則

すべての要求はSMARTであるべき：

- **S**pecific (具体的) - 曖昧さがない
- **M**easurable (測定可能) - 定量的に評価できる
- **A**chievable (達成可能) - 実現可能である
- **R**elevant (関連性がある) - ビジネス目標と整合
- **T**ime-bound (期限がある) - リリース計画と連動

### 2. MoSCoW優先順位付け

- **Must have** (必須) - リリースに不可欠
- **Should have** (重要) - 可能な限り含める
- **Could have** (可能なら) - リソースがあれば実装
- **Won't have** (今回は対象外) - 将来的に検討

### 3. Given-When-Then形式

すべての受入基準は以下の形式で記述：

```
Given: ユーザーがログインフォームにアクセスした時
When: 正しいユーザー名とパスワードを入力する
Then: システムにログインしてホーム画面に遷移する
```

### 4. トレーサビリティの維持

すべての要求は以下とリンク：
- 親要求（なぜ必要か）
- 子要求（どう実現するか）
- 設計要素（どこに実装されるか）
- テストケース（どう検証するか）

---

## 🔌 統合

### Claude Codeエージェント

```bash
# Systems Engineerエージェントを起動
/task --agent systems-engineer "新しい機能の要求を抽出"
```

### カスタムコマンド

`.claude/commands/requirements-workflow.md` を作成して、
要求開発の全プロセスを自動化できます。

---

## 📖 参考資料

### 標準・規格

- **ISO/IEC/IEEE 15288**: Systems and software engineering - System life cycle processes
- **ISO/IEC/IEEE 29148**: Systems and software engineering - Life cycle processes - Requirements engineering
- **ISO/IEC 25010**: Systems and software Quality Requirements and Evaluation (SQuaRE)

### 書籍

- "Software Requirements" by Karl Wiegers & Joy Beatty
- "Requirements Engineering Fundamentals" by Klaus Pohl & Chris Rupp
- "Mastering the Requirements Process" by Suzanne Robertson & James Robertson

---

## 🚀 ロードマップ

- [x] 要求工学モジュールの実装
- [x] CLIコマンドの実装
- [x] システムズエンジニアエージェント
- [ ] GUIツールの追加
- [ ] 要求変更管理機能
- [ ] 自動トレーサビリティ分析
- [ ] AI支援要求抽出（LLM統合）
- [ ] リスク分析機能
- [ ] 要求優先順位付けアルゴリズム

---

## 💡 例：実際の要求開発

### シナリオ: ECサイトの開発

#### 1. ビジネス要求

```
BR-001: 顧客満足度を向上させる
BR-002: オンライン売上を増加させる
```

#### 2. ユーザー要求

```
UR-001: ユーザーは簡単に商品を検索できる必要がある
UR-002: ユーザーは安全に決済できる必要がある
```

#### 3. システム要求

```
SR-001: システムは全文検索機能を提供する
SR-002: システムはPCI DSS準拠の決済システムを統合する
```

#### 4. 機能要求

```
FR-001: システムは、ユーザーがキーワードで商品を検索できるようにする

受入基準:
  Given: ユーザーが検索フォームにアクセスしている
  When: キーワード「ノートパソコン」を入力して検索ボタンをクリックする
  Then: 「ノートパソコン」を含む商品リストが表示される

優先度: Must
ステークホルダー: エンドユーザー, Product Owner
検証方法: Test
```

#### 5. 非機能要求

```
NFR-001 (Performance): 検索結果は1秒以内に表示される必要がある

測定方法: 95パーセンタイルのレスポンスタイムを測定
目標値: 1秒以内
許容範囲: 平均0.5秒、最大2秒

優先度: Should
検証方法: Test（負荷テスト）
```

---

**このドキュメントは、統一エージェント方程式を用いた要求工学の実践ガイドです。**
