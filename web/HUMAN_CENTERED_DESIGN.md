# 人間中心AI時代の組織憲章 - Web UI設計書 v2.0

## 🎯 結論（設計の核心）

**人間が最終判断し、説明責任を負う**という憲章の核心（Purpose／Explainability／Accountability）を、UI仕組みに完全実装する。

### 5つの補強要素

1. **意思決定の記録様式**（Decision Ledger）
2. **代替案比較**（Alternatives Board）
3. **取り消しと再現性**（Time Travel）
4. **安全制約**（Guardrails）
5. **エビデンス提示**（Why-Box）

これらを既存の「知識グラフ + AIサジェスチョン」に統合し、憲章の実装度を最大化する。

---

## 📋 目次

1. [憲章 ⇄ UI の整合性](#憲章--ui-の整合性)
2. [体験アーキテクチャ](#体験アーキテクチャ)
3. [コア機能の"人間強度"アップデート](#コア機能の人間強度アップデート)
4. [ガードレール設計](#ガードレール設計)
5. [AIエージェントI/F仕様](#aiエージェントif仕様)
6. [データモデル](#データモデル)
7. [コンポーネント設計](#コンポーネント設計)
8. [エラー状態と復旧](#エラー状態と復旧)
9. [アクセシビリティ/国際化](#アクセシビリティ国際化)
10. [セキュリティ/監査](#セキュリティ監査)
11. [成功指標（KPI）](#成功指標kpi)
12. [実装フェーズ](#実装フェーズ)
13. [マイクロコピー](#マイクロコピー)
14. [技術スタック](#技術スタック)

---

## 憲章 ⇄ UI の整合性

### 差分マップ（原則 → UI実体化）

| 原則 | UI実装 | ファイル/コンポーネント |
|---|---|---|
| **目的の明確化**<br>(Purpose Driven) | 画面最上部に**目的バナー**を固定表示<br>目的未設定時は接続作成を抑止 | `PurposeBanner.tsx` |
| **説明可能性**<br>(Explainability) | 各サジェスチョンに**根拠パネル（Why-Box）**<br>ルール照合結果／過去類似例／信頼度を展開表示<br>承認時に決定レジャーへ自動記帳 | `WhyBox.tsx`<br>`DecisionLedger.tsx` |
| **責任の所在**<br>(Human Accountability) | **署名付きコミット**（承認者・理由・撤回条件）<br>承認ボタンに「承認者」必須入力 | `ApprovalDialog.tsx` |
| **最小限データ/安全**<br>(Fairness & Safety) | **接続ガードレール**<br>許可=青／警告=黄／禁止=赤でブロック<br>ルールはUIから可視 | `GuardrailEngine.ts` |
| **フィードバック循環**<br>(Feedback Loop) | **タイムトラベル**<br>リビュー/撤回をワンクリック<br>撤回理由が学習データに再登録 | `TimeTravel.tsx` |

### Web UIでの体現方法（更新版）

- **知識グラフ**: 人間とAIが共有する「共通認識」のデータベース
- **決定レジャー**: 全ての意思決定を自動記録（監査証跡）
- **代替案比較**: AIが最大3案を提示、人間が選択
- **根拠パネル**: AIの判断根拠を即座に確認可能
- **ガードレール**: 禁止接続は作成不可（パワーモード除く）
- **タイムトラベル**: 任意時点に巻き戻し可能

## 体験アーキテクチャ

### ページ構成（v2.0）

```
┌──────────────────────────────────────────────────────────────┐
│ 🎯 目的バナー（PurposeBanner）                               │
│ 目的: カート放棄率15%削減 | 範囲: 認証機能 | モード: 安全     │
└──────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────┐
│ ヘッダー: 人間とAIの共通認識                                  │
│ サブタイトル: 決定レジャーで説明責任を担保                    │
└──────────────────────────────────────────────────────────────┘
│                                                                │
│  ┌────────┐  ┌──────────────────────────┐  ┌───────────────┐ │
│  │ツール  │  │知識グラフ (React Flow)   │  │根拠パネル     │ │
│  │バー    │  │                          │  │(Why-Box)      │ │
│  │+ 要求  │  │[ノード]─→[ノード]─→[ノード]│  │               │ │
│  │+ 機能  │  │  ↓       ↓       ↓      │  │ルール命中:    │ │
│  │+ テスト│  │[ノード] [ノード] [ノード]│  │ - 要求→機能✅ │ │
│  │削除    │  │                          │  │               │ │
│  │────────│  │                          │  │過去類似:      │ │
│  │検証実行│  │                          │  │ - case#123   │ │
│  │レンズ  │  │                          │  │               │ │
│  │Coverage│  │                          │  │信頼度: 0.92  │ │
│  │Impact  │  │                          │  │[詳細を見る]   │ │
│  │Risk    │  │                          │  └───────────────┘ │
│  └────────┘  └──────────────────────────┘                    │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 下部ドッキングタブ                                        │ │
│  │ [AIサジェスチョン] [代替案比較] [決定レジャー]           │ │
│  │                                                            │ │
│  │ 🤖 推奨案: 要求BR-001 → 機能Feature-001                   │ │
│  │    ✅ 適切な接続です（信頼度: 0.92）                      │ │
│  │    [📊 代替案を比較] [✓ 承認] [✗ 拒否]                   │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────┐
│ フッター: 状態タイムライン（コミット履歴）| ショートカット   │
└──────────────────────────────────────────────────────────────┘
```

### キーモード

| モード | 動作 | ガードレール | 承認要件 |
|---|---|---|---|
| **安全モード（既定）** | 禁止接続は作成不能<br>警告接続は暫定（ドラフト）扱い | 厳格 | 承認者1名 |
| **パワーユーザーモード** | 禁止接続も作成可能<br>赤フレーム表示 | 緩和 | 承認者2名<br>（ツーペルソンルール） |

### カラーパレット（ガードレール対応）

| 色 | 用途 | コード | 意味 |
|---|---|---|---|
| **グレー200** | 要求ノード | `bg-gray-200 border-gray-400` | 中立 |
| **グレー300** | 機能ノード | `bg-gray-300 border-gray-500` | 中立 |
| **グレー400** | テストノード | `bg-gray-400 border-gray-600 text-white` | 中立 |
| **青500** | エッジ（新規・許可） | `#3B82F6` | 許可接続 |
| **黄500** | エッジ（警告） | `#EAB308` | 警告接続 |
| **赤500** | エッジ（禁止） | `#EF4444` | 禁止接続 |
| **グレー500** | エッジ（確定後） | `#9CA3AF` | 承認済み |

## コア機能の"人間強度"アップデート

### 1. 決定レジャー（Decision Ledger）

**目的**: 全ての意思決定を自動記録し、監査・説明・再利用を可能にする

#### 自動記帳内容

| フィールド | 説明 | 例 |
|---|---|---|
| **commitId** | 一意識別子（UUID） | `dec-20250110-001` |
| **timestamp** | 決定日時 | `2025-01-10T14:30:00Z` |
| **purpose** | 目的（目的バナーと連携） | カート放棄率15%削減 |
| **actionType** | 操作種別 | `add_edge` / `delete_node` / `update_metadata` |
| **alternatives** | 検討した選択肢 | `[推奨案, 保守的案, 革新的案]` |
| **selectedOption** | 採用した案 | `推奨案: 要求BR-001 → 機能Feature-001` |
| **rationale** | 採否理由（人間入力） | ISO/IEC 29148準拠のトレーサビリティ確立のため |
| **approver** | 承認者（識別子） | `user-12345` |
| **impactSummary** | 影響範囲 | `要求1件、機能1件、テスト2件に影響` |
| **rollbackCondition** | 撤回条件 | テストカバレッジが80%未満になった場合 |
| **confidence** | AI信頼度 | `0.92` |
| **rulesMatched** | 命中ルール | `["R001: 要求→機能は許可"]` |
| **evidence** | 過去類似例 | `["case#123", "case#456"]` |

#### UI

- 下部タブ「決定レジャー」で全履歴を表示
- CSV/JSONエクスポート機能
- 検索・フィルタ（日付／承認者／影響範囲）
- コミットIDクリックで該当時点にタイムトラベル

#### 価値

- **監査**: 第三者が意思決定プロセスを追跡可能
- **説明**: ステークホルダーへの説明時間を短縮
- **再利用**: 過去の成功パターンを学習データ化

---

### 2. 代替案比較（Alternatives Board）

**目的**: AIが複数案を提示し、人間が比較して選択

#### 提示方式

| 案 | 説明 | 特徴 |
|---|---|---|
| **①推奨案** | AIが最も適切と判断 | 信頼度が最高 |
| **②保守的案** | リスクを最小化 | 実績のあるパターンのみ使用 |
| **③革新的案** | 新しいアプローチ | 効率は高いがリスクも高い |

#### 比較軸

| 軸 | 説明 | 表示形式 |
|---|---|---|
| **要件適合** | 目的バナーの目的に合致するか | ✅✅✅ / ✅✅ / ✅ |
| **影響範囲** | 変更対象のノード数 | 3ノード / 5ノード / 8ノード |
| **実装コスト** | 見積もり工数 | 低／中／高 |
| **リスク** | 失敗確率 | 5% / 10% / 20% |
| **テストカバレッジ変化** | カバレッジの増減 | +5% / ±0% / -2% |

#### UI

- 下部タブ「代替案比較」で3案を横並び表示
- ラジオボタンで選択 → 「✓ 承認」ボタン
- 各案の根拠を「詳細を見る」で展開

#### 価値

- **正しい問い**: 人間が意図をもって選択できる
- **学習データ**: 選択されなかった案も記録（なぜ採用されなかったか）

---

### 3. 根拠パネル（Why-Box）

**目的**: AIの判断根拠を即座に確認可能にする

#### 表示内容

| セクション | 内容 | 例 |
|---|---|---|
| **命中ルール** | どのガードレールが適用されたか | `R001: 要求→機能は許可` |
| **過去類似例** | 同様のパターンの成功事例 | `case#123: BR-005 → Feature-012 (成功)` |
| **信頼度根拠** | なぜこの信頼度なのか | 過去20件中18件成功（90%） |
| **カバレッジ差分** | この変更でカバレッジがどう変わるか | 要求カバレッジ 85% → 90% (+5%) |
| **リスクノート** | 注意点・警告 | この機能は外部API依存のためテスト強化推奨 |

#### UI

- 右サイド固定パネル（400px幅）
- サジェスチョン行をクリックで詳細展開
- 「引用を見る」で過去の決定レジャーへリンク

#### 価値

- **透明性**: AIがブラックボックスにならない
- **学習**: 人間がAIの判断パターンを学べる

---

### 4. タイムトラベル（Undo/Time Machine）

**目的**: 任意時点に巻き戻し可能、試行錯誤を安全に

#### 機能

| 機能 | 説明 | UI |
|---|---|---|
| **コミット履歴** | 全ての変更をコミットとして記録 | フッターに状態タイムライン |
| **巻き戻し** | 任意のコミットIDに戻る | コミットをクリック→「この時点に戻る」 |
| **ブランチ** | 現在の状態から分岐して実験 | 「ブランチを作成」ボタン |
| **差分表示** | 2つのコミット間の差分を表示 | コミットを2つ選択→「差分を見る」 |

#### コミットメタデータ

```typescript
interface Commit {
  commitId: string;           // 'c001'
  timestamp: Date;
  message: string;            // '要求BR-001と機能Feature-001を接続'
  author: string;             // 'user-12345'
  graphSnapshot: KnowledgeGraph;  // この時点のグラフ全体
  decisionLedgerEntries: DecisionLedgerEntry[];  // この時点の決定レジャー
  parentCommitId?: string;    // 親コミット（巻き戻し用）
}
```

#### UI

- フッターに水平タイムライン（最新10コミット）
- コミットIDホバーで変更要約をツールチップ表示
- 「もっと見る」で全履歴モーダル

#### 価値

- **安全性**: いつでも元に戻せるため、大胆な実験が可能
- **学習ループ**: 失敗パターンも記録され、学習データになる

---

### 5. レンズ（Lens Overlay）

**目的**: グラフの異なる側面を可視化

#### レンズの種類

| レンズ | 表示内容 | 視覚効果 |
|---|---|---|
| **Coverage** | 要求→機能→テストの到達度 | ヒートマップ（赤=未カバー、緑=完全カバー） |
| **Impact** | 選択エッジの影響範囲 | 波及ノードをグロー表示 |
| **Risk** | リスクの高いノード | 未検証・孤立・逆方向接続を赤枠強調 |

#### UI

- 左ツールバーに「レンズ」ボタン3つ
- レンズ選択時、グラフにオーバーレイ表示
- レンズOFF時は通常表示に戻る

#### 価値

- **品質保証**: テストカバレッジの穴を即座に発見
- **影響分析**: 変更の波及範囲を事前に把握
- **リスク管理**: 問題箇所を早期発見

## ガードレール設計

### 許可関係（初期設定）

| 接続パターン | ガードレール | エッジ色 | 承認要件 | 理由 |
|---|---|---|---|---|
| **要求 → 機能**<br>(implements) | ✅ 許可 | 青 | 承認者1名 | ISO/IEC/IEEE 29148準拠の標準トレーサビリティ |
| **テスト → 機能**<br>(tests) | ✅ 許可 | 青 | 承認者1名 | 機能の品質保証を確立 |
| **テスト → 要求**<br>(verifies) | ✅ 許可 | 青 | 承認者1名 | 要求の受入基準を検証 |
| **要求 → テスト**<br>(参照) | ⚠️ 警告 | 黄 | 承認者1名<br>+ 理由必須 | 一般的ではないが有効（要求からテストケースへの参照） |
| **機能 → 要求**<br>(逆方向) | 🚫 禁止 | 赤 | 承認者2名<br>+ 理由必須<br>（パワーモード） | 逆方向接続は原則禁止（トレーサビリティが逆転） |
| **機能 → テスト**<br>(逆方向) | 🚫 禁止 | 赤 | 承認者2名<br>（パワーモード） | テストが機能に依存する形は推奨されない |

### ガードレールルール記述形式

```typescript
interface GuardrailRule {
  ruleId: string;               // 'R001'
  name: string;                 // '要求→機能は許可'
  pattern: {
    sourceType: KnowledgeNodeType | '*';
    targetType: KnowledgeNodeType | '*';
    edgeType?: KnowledgeEdgeType;
  };
  verdict: 'allowed' | 'warning' | 'forbidden';
  edgeColor: string;            // '#3B82F6' | '#EAB308' | '#EF4444'
  approvalRequirement: {
    approverCount: 1 | 2;
    reasonRequired: boolean;
    powerModeOnly?: boolean;    // 禁止はパワーモードのみ作成可
  };
  rationale: string;            // ルールの根拠説明
  references?: string[];        // ISO標準などへの参照
}
```

### 初期ルールセット（`GuardrailEngine.ts`）

```typescript
export const DEFAULT_GUARDRAIL_RULES: GuardrailRule[] = [
  {
    ruleId: 'R001',
    name: '要求→機能は許可',
    pattern: { sourceType: 'requirement', targetType: 'feature', edgeType: 'implements' },
    verdict: 'allowed',
    edgeColor: '#3B82F6',
    approvalRequirement: { approverCount: 1, reasonRequired: false },
    rationale: 'ISO/IEC/IEEE 29148準拠の標準的なトレーサビリティパターン',
    references: ['ISO/IEC/IEEE 29148:2018 Section 5.2.6'],
  },
  {
    ruleId: 'R002',
    name: 'テスト→機能は許可',
    pattern: { sourceType: 'test', targetType: 'feature', edgeType: 'tests' },
    verdict: 'allowed',
    edgeColor: '#3B82F6',
    approvalRequirement: { approverCount: 1, reasonRequired: false },
    rationale: '機能の品質保証を確立するための標準パターン',
  },
  {
    ruleId: 'R003',
    name: 'テスト→要求は許可',
    pattern: { sourceType: 'test', targetType: 'requirement', edgeType: 'verifies' },
    verdict: 'allowed',
    edgeColor: '#3B82F6',
    approvalRequirement: { approverCount: 1, reasonRequired: false },
    rationale: '要求の受入基準（Given-When-Then）を検証',
  },
  {
    ruleId: 'R004',
    name: '要求→テストは警告',
    pattern: { sourceType: 'requirement', targetType: 'test' },
    verdict: 'warning',
    edgeColor: '#EAB308',
    approvalRequirement: { approverCount: 1, reasonRequired: true },
    rationale: 'テスト→要求の方向が一般的だが、要求からテストへの参照も有効',
  },
  {
    ruleId: 'R005',
    name: '機能→要求は禁止',
    pattern: { sourceType: 'feature', targetType: 'requirement' },
    verdict: 'forbidden',
    edgeColor: '#EF4444',
    approvalRequirement: { approverCount: 2, reasonRequired: true, powerModeOnly: true },
    rationale: '逆方向接続はトレーサビリティが逆転するため原則禁止',
  },
  {
    ruleId: 'R006',
    name: '機能→テストは禁止',
    pattern: { sourceType: 'feature', targetType: 'test' },
    verdict: 'forbidden',
    edgeColor: '#EF4444',
    approvalRequirement: { approverCount: 2, reasonRequired: true, powerModeOnly: true },
    rationale: 'テストが機能に依存する形は推奨されない',
  },
];
```

### UI表示

- **エッジ作成時**: ガードレールエンジンが即座に評価し、エッジの色を変更
- **禁止接続**: 安全モードでは作成不可（トースト通知）、パワーモードでは赤ドラフト作成可
- **ルール確認**: 左ツールバーに「ルールカード」ボタン → モーダルで全ルール表示

---

## AIエージェントI/F仕様

### 設計原則

**AIは提案者であり、実行者ではない。UIが最終操作を担う。**

### リクエスト: サジェスチョン生成

```typescript
interface SuggestionRequest {
  purpose: string;              // 目的（PurposeBannerと連携）
  graph: KnowledgeGraph;        // 現在のグラフ状態
  event:
    | { type: 'edge_proposed'; sourceId: string; targetId: string }
    | { type: 'node_created'; node: KnowledgeNode }
    | { type: 'validate_all' };
}
```

### レスポンス: サジェスチョン（最大3案）

```typescript
interface SuggestionResponse {
  alternatives: Alternative[];  // 最大3案
}

interface Alternative {
  id: string;                   // 'alt-001'
  label: string;                // '推奨案' | '保守的案' | '革新的案'
  changes: Change[];            // 変更内容
  rationale: Rationale;         // 根拠
  guardrail: 'allowed' | 'warning' | 'forbidden';
}

interface Change {
  op: 'add_edge' | 'delete_edge' | 'add_node' | 'update_node';
  data: any;                    // エッジやノードのデータ
}

interface Rationale {
  rulesMatched: string[];       // 命中ルールID ['R001', 'R002']
  evidence: string[];           // 過去類似例 ['case#123', 'case#456']
  riskNotes?: string[];         // リスク警告
  coverageDelta?: {
    requirementsCovered: number;
    testsMissing: number;
  };
  confidence: number;           // 0.0 ~ 1.0
}
```

### 承認API: 決定レジャーへの記帳

```typescript
interface ApprovalRequest {
  alternativeId: string;        // 選択された案のID
  approver: string;             // 承認者ID
  rationale: string;            // 承認理由（人間入力）
  rollbackCondition?: string;   // 撤回条件
}

interface ApprovalResponse {
  decisionLedgerEntry: DecisionLedgerEntry;
  commitId: string;
}

interface DecisionLedgerEntry {
  commitId: string;
  timestamp: Date;
  purpose: string;
  actionType: string;
  alternatives: Alternative[];  // 全ての選択肢
  selectedOption: Alternative;  // 採用案
  rationale: string;            // 承認理由
  approver: string;
  impactSummary: string;
  rollbackCondition?: string;
  confidence: number;
  rulesMatched: string[];
  evidence: string[];
}
```

### エンドポイント（将来的なバックエンド統合用）

| エンドポイント | メソッド | 説明 |
|---|---|---|
| `/api/suggestions` | POST | サジェスチョン生成 |
| `/api/approvals` | POST | 承認・決定レジャー記帳 |
| `/api/ledger` | GET | 決定レジャー取得 |
| `/api/commits` | GET | コミット履歴取得 |
| `/api/guardrails` | GET | ガードレールルール取得 |

---

## 技術スタック

### フロントエンド

| 技術 | バージョン | 用途 |
|---|---|---|
| **React** | 18.x | UIコンポーネント |
| **TypeScript** | 5.x | 型安全性 |
| **React Flow** | 11.10.4 | グラフ可視化 |
| **Tailwind CSS** | 3.x | スタイリング |
| **Vite** | 5.x | ビルドツール |

### 依存関係

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "reactflow": "^11.10.4",
  "typescript": "^5.2.2",
  "vite": "^5.0.0",
  "tailwindcss": "^3.4.0"
}
```

---

## データモデル

### ノードタイプ (KnowledgeNode)

```typescript
export type KnowledgeNodeType = 'requirement' | 'feature' | 'test';

export interface KnowledgeNode {
  id: string;                         // 一意ID (例: 'req-001')
  type: KnowledgeNodeType;            // ノードタイプ
  label: string;                      // ラベル (例: 'BR-001')
  description: string;                // 説明文
  metadata?: {
    priority?: 'Must' | 'Should' | 'Could' | 'Wont';  // MoSCoW優先順位
    status?: 'pending' | 'in_progress' | 'completed'; // ステータス
    owner?: string;                   // 担当者
    createdAt?: string;               // 作成日時
  };
}
```

### エッジタイプ (KnowledgeEdge)

```typescript
export type KnowledgeEdgeType = 'implements' | 'tests' | 'verifies';

export interface KnowledgeEdge {
  id: string;                         // 一意ID (例: 'edge-001')
  source: string;                     // 始点ノードID
  target: string;                     // 終点ノードID
  label?: string;                     // エッジラベル (例: '実装')
  type: KnowledgeEdgeType;            // エッジタイプ
}
```

### エッジタイプの意味

| タイプ | 方向 | 意味 | 例 |
|---|---|---|---|
| **implements** | 要求 → 機能 | 要求が機能で実装される | BR-001 → Feature-001 |
| **tests** | テスト → 機能 | テストが機能を検証する | Test-001 → Feature-001 |
| **verifies** | テスト → 要求 | テストが要求を検証する | Test-001 → BR-001 |

### 知識グラフ全体 (KnowledgeGraph)

```typescript
export interface KnowledgeGraph {
  nodes: KnowledgeNode[];             // 全ノード
  edges: KnowledgeEdge[];             // 全エッジ
  comments?: Comment[];               // コメント（将来拡張用）
  metadata: {
    projectName: string;              // プロジェクト名
    version: string;                  // バージョン
    lastUpdated: Date;                // 最終更新日時
  };
}
```

---

## コンポーネント設計

### ファイル構成

```
web/src/
├── components/
│   ├── EditableKnowledgeGraph.tsx   # メイングラフコンポーネント
│   └── (CommentBubbles.tsx)         # 将来拡張用（現在は未使用）
├── types/
│   └── knowledgeGraph.ts            # データ型定義
├── data/
│   └── sampleKnowledgeGraph.ts      # サンプルデータ
└── App.tsx                          # アプリケーションルート
```

### EditableKnowledgeGraph.tsx

#### 主要な状態管理

```typescript
const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes);
const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges);
const [suggestion, setSuggestion] = useState<{
  message: string;
  edgeId: string;
} | null>(null);
```

#### CustomNodeコンポーネント

```typescript
const CustomNode = ({ data }: any) => {
  const getNodeStyle = () => {
    switch (data.type) {
      case 'requirement':
        return 'bg-gray-200 border-gray-400';
      case 'feature':
        return 'bg-gray-300 border-gray-500';
      case 'test':
        return 'bg-gray-400 border-gray-600 text-white';
      default:
        return 'bg-white border-gray-300';
    }
  };

  return (
    <div className={`px-4 py-3 rounded-lg border-2 shadow-sm min-w-[150px] ${getNodeStyle()} relative`}>
      {/* 入力ハンドル（左側） */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-gray-500 border-2 border-white"
      />

      <div className="text-xs font-bold mb-1">{data.label}</div>
      <div className="text-sm">{data.description}</div>
      {data.metadata?.priority && (
        <div className="text-xs mt-1 opacity-75">
          {data.metadata.priority}
        </div>
      )}

      {/* 出力ハンドル（右側） */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-gray-500 border-2 border-white"
      />
    </div>
  );
};
```

**重要ポイント**:
- `Handle` コンポーネントで左右に接続ポイントを配置
- `type="target"` (入力) と `type="source"` (出力) を明示
- `Position.Left` / `Position.Right` で位置を指定
- `relative` を親要素に指定してハンドルを正しく配置

#### エッジ接続ハンドラー

```typescript
const onConnect = useCallback(
  (connection: Connection) => {
    const newEdge = {
      ...connection,
      id: `edge-${Date.now()}`,
      type: 'smoothstep',
      style: {
        stroke: '#3B82F6',     // 新規作成時は青色
        strokeWidth: 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#3B82F6',
      },
    };

    setEdges((eds) => addEdge(newEdge, eds));

    // AIサジェスチョン生成
    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);

    if (sourceNode && targetNode) {
      const suggestion = generateSuggestion(
        sourceNode.data.type,
        targetNode.data.type,
        sourceNode.data.label,
        targetNode.data.label
      );

      setSuggestion({
        message: suggestion,
        edgeId: newEdge.id!,
      });
    }

    // コールバック呼び出し（将来拡張用）
    if (onEdgeChange) {
      const kgEdges: KnowledgeEdge[] = [...edges, newEdge].map((e) => ({
        id: e.id!,
        source: e.source,
        target: e.target,
        label: e.label as string,
        type: 'implements', // デフォルト
      }));
      onEdgeChange(kgEdges);
    }
  },
  [edges, nodes, onEdgeChange, setEdges]
);
```

#### ReactFlowの設定

```typescript
<ReactFlow
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}
  nodeTypes={nodeTypes}
  connectionMode={ConnectionMode.Loose}  // 柔軟な接続を許可
  fitView
  minZoom={0.3}
  maxZoom={1.5}
>
  <Background color="#E5E7EB" gap={20} />
  <Controls />
  <MiniMap
    nodeColor={(node) => {
      switch (node.data?.type) {
        case 'requirement': return '#E5E7EB';
        case 'feature': return '#D1D5DB';
        case 'test': return '#9CA3AF';
        default: return '#F3F4F6';
      }
    }}
    maskColor="rgba(0, 0, 0, 0.05)"
  />
</ReactFlow>
```

**重要ポイント**:
- `connectionMode={ConnectionMode.Loose}` でエッジ作成を柔軟に
- `nodeTypes` でカスタムノードを登録
- `onConnect` でエッジ作成時の処理をフック

---

## AIサジェスチョンロジック

### generateSuggestion関数

```typescript
const generateSuggestion = (
  sourceType: string,
  targetType: string,
  sourceLabel: string,
  targetLabel: string
): string => {
  if (sourceType === 'requirement' && targetType === 'feature') {
    return `✅ 適切な接続です: 要求「${sourceLabel}」が機能「${targetLabel}」で実装されます。トレーサビリティが確立されました。`;
  }

  if (sourceType === 'test' && targetType === 'feature') {
    return `✅ 適切な接続です: テスト「${sourceLabel}」が機能「${targetLabel}」を検証します。品質保証が強化されました。`;
  }

  if (sourceType === 'test' && targetType === 'requirement') {
    return `✅ 適切な接続です: テスト「${sourceLabel}」が要求「${targetLabel}」を検証します。受入基準が明確になりました。`;
  }

  if (sourceType === 'feature' && targetType === 'requirement') {
    return `⚠️ 逆方向の接続です: 通常は要求 → 機能の方向です。エッジを削除して逆にすることをお勧めします。`;
  }

  if (sourceType === 'requirement' && targetType === 'test') {
    return `💡 提案: テスト → 要求の方向が一般的です。ただし、この接続も有効です（要求からテストケースへの参照）。`;
  }

  return `ℹ️ 新しい接続を作成しました: ${sourceLabel} → ${targetLabel}`;
};
```

### サジェスチョンの評価基準

| 接続パターン | 評価 | アイコン | 理由 |
|---|---|---|---|
| 要求 → 機能 | ✅ 適切 | ✅ | ISO/IEC/IEEE 29148準拠の標準的なトレーサビリティ |
| テスト → 機能 | ✅ 適切 | ✅ | 機能の品質保証を確立 |
| テスト → 要求 | ✅ 適切 | ✅ | 要求の受入基準を検証 |
| 機能 → 要求 | ⚠️ 警告 | ⚠️ | 逆方向（通常は要求→機能） |
| 要求 → テスト | 💡 提案 | 💡 | 一般的ではないが有効 |
| その他 | ℹ️ 情報 | ℹ️ | 新しい接続パターン |

### サジェスチョンUIの表示

```typescript
{suggestion && (
  <Panel position="bottom-center" className="bg-white rounded-lg shadow-xl p-4 max-w-md">
    <div className="flex items-start space-x-3">
      <span className="text-2xl">🤖</span>
      <div className="flex-1">
        <div className="text-xs font-bold text-gray-700 mb-1">AI サジェスチョン</div>
        <p className="text-sm text-gray-800 mb-3">{suggestion.message}</p>
        <div className="flex space-x-2">
          <button
            onClick={handleAcceptSuggestion}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            ✓ Yes
          </button>
          <button
            onClick={handleRejectSuggestion}
            className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
          >
            ✗ No
          </button>
        </div>
      </div>
    </div>
  </Panel>
)}
```

### サジェスチョン承認/拒否の処理

```typescript
// サジェスチョン承認
const handleAcceptSuggestion = () => {
  setSuggestion(null);
  // エッジの色を確定（青 → グレー）
  setEdges((eds) =>
    eds.map((e) =>
      e.id === suggestion?.edgeId
        ? {
            ...e,
            style: { stroke: '#9CA3AF', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#9CA3AF' },
          }
        : e
    )
  );
};

// サジェスチョン拒否
const handleRejectSuggestion = () => {
  // エッジを削除
  if (suggestion) {
    setEdges((eds) => eds.filter((e) => e.id !== suggestion.edgeId));
  }
  setSuggestion(null);
};
```

---

## ユーザーインタラクション

### インタラクションフロー

```
1. ユーザーがノードAの右ハンドルをクリック
   ↓
2. ノードBの左ハンドルまでドラッグ
   ↓
3. エッジが青色で作成される
   ↓
4. AIサジェスチョンパネルが下部中央に表示
   ↓
5a. ユーザーが「✓ Yes」をクリック
    → エッジが灰色に変わり、確定
   ↓
   完了

5b. ユーザーが「✗ No」をクリック
    → エッジが削除される
   ↓
   完了
```

### キーボード操作

| キー | 操作 |
|---|---|
| **Delete** | 選択したノード/エッジを削除 |
| **Ctrl + ホイール** | ズーム |
| **Space + ドラッグ** | パン（グラフ移動） |

### マウス操作

| 操作 | 動作 |
|---|---|
| **ノードをドラッグ** | ノードの位置を移動 |
| **背景をドラッグ** | グラフ全体を移動（パン） |
| **ホイール** | ズーム |
| **ハンドル間をドラッグ** | エッジ作成 |
| **ノードをクリック** | ノード選択 |
| **エッジをクリック** | エッジ選択 |

---

## 今後の拡張計画

### Phase 1: コメント機能の復活（オプション）

- ノードを選択したときに右サイドバーでコメント表示
- 人間とAIの対話履歴を蓄積
- タイムスタンプ付きのコメントスレッド

### Phase 2: ノード編集機能

- ノードをダブルクリックで編集モード
- label、description、metadataをインラインで編集
- 変更履歴の記録

### Phase 3: エクスポート/インポート機能

- JSON形式でグラフをエクスポート
- 外部ツール（Jira、GitHub Issues）との連携
- バージョン管理（Git統合）

### Phase 4: 自動レイアウト

- Dagre、ELKなどのレイアウトアルゴリズム適用
- 階層構造の自動配置
- レイアウトアニメーション

### Phase 5: コラボレーション機能

- リアルタイム共同編集（WebSocket）
- ユーザープレゼンス表示（誰が編集中か）
- コメントでの@メンション

### Phase 6: AI機能の強化

- 自然言語からノード/エッジの自動生成
- トレーサビリティギャップの自動検出
- テストカバレッジの分析と提案

---

## 開発コマンド

### ローカル開発

```bash
cd web
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開く

### ビルド

```bash
npm run build
```

### プレビュー

```bash
npm run preview
```

---

## サンプルデータ

現在は `web/src/data/sampleKnowledgeGraph.ts` にECサイト認証機能改善プロジェクトのサンプルデータが格納されています。

### サンプルプロジェクト概要

- **プロジェクト名**: ECサイト認証機能改善
- **要求**: 3件（カート放棄率削減、ソーシャルログイン、パスワードハッシュ化）
- **機能**: 3件（Googleログイン、LINEログイン、bcrypt）
- **テスト**: 3件（統合テスト、単体テスト、測定テスト）
- **エッジ**: 8件（トレーサビリティ関係）

---

## エラー状態と復旧

### エラーパターンと対処

| エラー | トリガー | UI表示 | 復旧方法 |
|---|---|---|---|
| **禁止接続を試行** | 機能→要求を接続試行（安全モード） | トースト通知<br>「契約上の禁止。承認2名か、パワーモードに戻してください」 | パワーモードに切替 or<br>エッジを逆向きに作成 |
| **信頼度しきい値未満** | AI信頼度 < 0.5 | 承認ボタンが無効化<br>「信頼度が低いため承認できません」 | 代替案を選択 or<br>ノード情報を追加して再評価 |
| **循環参照検出** | A→B→C→Aの循環 | ルールカードに赤カウント<br>「循環参照が3件検出されました」 | クリックで該当ノードへジャンプ<br>エッジを削除 |
| **孤立ノード検出** | 接続のないノード | Riskレンズで赤枠強調 | エッジを追加して接続 |
| **目的未設定** | 目的バナーが空 | エッジ作成を抑止<br>「目的を設定してください」 | 目的バナーで目的を入力 |
| **未保存変更** | ブラウザ閉じる試行 | 確認ダイアログ<br>「未保存の変更があります」 | 自動ドラフト保存 or<br>明示的に保存 |

### 失敗復旧の原則

- **常にタイムトラベル可能**: いつでも任意時点に巻き戻せる
- **自動ドラフト保存**: 30秒ごとに自動保存（localStorage）
- **エラーメッセージの具体性**: 「エラーが発生しました」ではなく「なぜ」「どうすればいいか」を明示

---

## アクセシビリティ/国際化

### アクセシビリティ（A11y）

| 要件 | 実装 |
|---|---|
| **キーボード全操作** | Tab/Shift+Tab、Enter、Space、Delete |
| **WAI-ARIA** | role/名称/値を全要素に設定 |
| **コントラスト** | WCAG AA準拠（4.5:1以上） |
| **スクリーンリーダー** | alt属性、aria-label、aria-describedby |
| **フォーカス表示** | 青枠（2px solid #3B82F6） |

### 国際化（i18n）

- 全マイクロコピーを辞書化（`i18n/ja.json`, `i18n/en.json`）
- React i18nextで`<Trans>`採用
- 日付/時刻はIntl.DateTimeFormatで自動ローカライズ

### 操作性

- ズーム・パン・選択は既存React Flow実装を踏襲
- ショートカット表示を右下ヘルプボタンに常駐
- マウスホバーで詳細ツールチップ表示

---

## セキュリティ/監査

### レジャー改ざん防止

```typescript
interface SignedCommit extends Commit {
  signature: string;        // HMAC-SHA256
  previousHash?: string;    // 親コミットのハッシュ（ブロックチェーン様式）
}

// ハッシュ計算
const computeHash = (commit: Commit): string => {
  const data = JSON.stringify(commit);
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
};
```

### 権限管理

| ロール | 権限 | 備考 |
|---|---|---|
| **閲覧者** | グラフ閲覧のみ | 編集不可 |
| **編集者** | ノード/エッジ追加・削除<br>安全モードの承認 | 承認者1名 |
| **管理者** | パワーモード切替<br>ガードレールルール編集<br>ツーペルソンルール承認 | 承認者2名 |

### 個人情報最小化

- 担当者は識別子表示（`user-12345`）
- 実名は監査画面でのみ表示（管理者のみ）
- 決定レジャーのエクスポート時は識別子のまま

---

## 成功指標（KPI）

### プロセス効率

| 指標 | 目標値 | 計測方法 |
|---|---|---|
| **承認までの平均所要時間** | < 2分 | 承認ダイアログ表示から承認完了まで |
| **1決定あたり代替案参照数** | ≥ 1.5案 | 平均で複数案を比較しているか |
| **撤回率** | 5-10% | 低すぎる(0%)は学習不足、高すぎる(>20%)は判断不良 |

### 品質指標

| 指標 | 目標値 | 計測方法 |
|---|---|---|
| **テストカバレッジ率** | ≥ 80% | 要求のうち、テストで検証されている割合 |
| **孤立ノード率** | < 5% | 接続のないノードの割合 |
| **逆方向接続率** | < 2% | 機能→要求などの逆方向接続の割合 |

### 説明責任

| 指標 | 目標値 | 計測方法 |
|---|---|---|
| **説明時間** | < 5分 | 第三者に決定を説明する所要時間（レジャー導入で短縮期待） |
| **監査通過率** | 100% | 監査で指摘なく通過する割合 |

---

## 実装フェーズ

### P0（即価値、2週間）

| 機能 | 実装内容 | ファイル |
|---|---|---|
| **目的バナー** | 最上部に固定表示<br>目的未設定時は接続作成を抑止 | `PurposeBanner.tsx` |
| **決定レジャー（最小）** | 承認時に自動記帳<br>下部タブで履歴表示 | `DecisionLedger.tsx`<br>`types/decisionLedger.ts` |
| **根拠パネル（ルール命中のみ）** | 右サイドに固定<br>命中ルールを表示 | `WhyBox.tsx` |
| **ガードレール（基本6ルール）** | R001-R006を実装<br>エッジ色を変更 | `utils/GuardrailEngine.ts` |

### P1（中核機能、4週間）

| 機能 | 実装内容 | ファイル |
|---|---|---|
| **代替案比較** | 3案を横並び表示<br>ラジオ選択 | `AlternativesBoard.tsx` |
| **Coverageレンズ** | ヒートマップ表示 | `LensOverlay.tsx` |
| **タイムトラベル** | コミット履歴<br>巻き戻し機能 | `TimeTravel.tsx`<br>`types/commit.ts` |
| **根拠パネル（完全版）** | 過去類似例、信頼度根拠、カバレッジ差分 | `WhyBox.tsx` 拡張 |

### P2（高度機能、6週間）

| 機能 | 実装内容 | ファイル |
|---|---|---|
| **ツーペルソンルール** | 禁止接続の承認フロー | `ApprovalDialog.tsx` |
| **Impact/Riskレンズ** | 影響範囲・リスク可視化 | `LensOverlay.tsx` 拡張 |
| **パワーモード** | 禁止接続のドラフト作成 | `ModeSelector.tsx` |
| **決定レジャーエクスポート** | CSV/JSONエクスポート | `DecisionLedger.tsx` 拡張 |

---

## マイクロコピー

### そのまま使える文言

#### 目的バナー

```
「この編集の目的を設定してください。目的がない変更は承認できません。」

入力プレースホルダー: 「例: カート放棄率を15%削減」
```

#### 承認ダイアログ

```
タイトル: 「あなたが最終判断者です」

本文: 「この決定の理由と撤回条件を記録します。監査時に第三者がこの判断を理解できるように記述してください。」

承認理由（必須）: 「なぜこの案を選択しましたか？」
撤回条件（任意）: 「どのような場合にこの決定を取り消しますか？」

例: 「ISO/IEC 29148準拠のトレーサビリティを確立するため」
例: 「テストカバレッジが80%未満になった場合」
```

#### 警告接続

```
「⚠️ 警告: 一般則は要求→機能です。逆接続は例外運用として記録します。」

「この接続を承認する理由を必ず記録してください。」
```

#### 撤回

```
タイトル: 「この決定を取り消します」

本文: 「撤回理由を記録してください。影響を受けるノードに見直しタスクを自動生成します。」

撤回理由（必須）: 「なぜこの決定を取り消しますか？」
```

#### 禁止接続（安全モード）

```
トースト: 「🚫 契約上の禁止接続です。パワーユーザーモードに切り替えるか、承認者2名の承認が必要です。」

ボタン: [パワーモードに切替] [キャンセル]
```

#### 信頼度不足

```
「⚠️ AI信頼度が低いため、この案は承認できません（現在: 0.42）。代替案を選択するか、ノード情報を追加して再評価してください。」

ボタン: [代替案を見る] [ノード情報を編集]
```

---

## まとめ

この設計書は、**人間が最終判断し、説明責任を負う**という憲章の核心を、UIの恒久的な仕組みに完全実装した仕様です。

### 核心的な価値（v2.0）

1. **目的駆動**: 目的バナーで「なぜ」を明確化
2. **決定レジャー**: 全ての意思決定を自動記録（監査証跡）
3. **代替案比較**: AIが複数案を提示、人間が選択
4. **根拠の可視化**: Why-Boxで判断根拠を即座に確認
5. **ガードレール**: 安全制約を明文化・自動適用
6. **タイムトラベル**: いつでも巻き戻し可能、試行錯誤を促進

### 技術的な特徴

- React Flow + TypeScript による型安全なグラフ編集
- ガードレールエンジンによる自動ルール適用
- 決定レジャーによる完全な監査証跡
- タイムトラベルによる安全な試行錯誤
- レンズによる多角的な品質可視化

### 実装の優先順位

- **P0（2週間）**: 目的バナー、決定レジャー（最小）、根拠パネル（基本）、ガードレール
- **P1（4週間）**: 代替案比較、Coverageレンズ、タイムトラベル
- **P2（6週間）**: ツーペルソンルール、Impact/Riskレンズ、パワーモード

今後の更新指示は、このファイルを参照して行ってください。
