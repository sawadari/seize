import { KnowledgeGraph } from './knowledgeGraph';

/**
 * 決定レジャーエントリ
 */
export interface DecisionLedgerEntry {
  commitId: string;             // 一意識別子（UUID）
  timestamp: Date;              // 決定日時
  purpose: string;              // 目的（目的バナーと連携）
  actionType: string;           // 操作種別
  alternatives?: Alternative[]; // 検討した選択肢
  selectedOption: string;       // 採用した案
  rationale: string;            // 採否理由（人間入力）
  approver: string;             // 承認者（識別子）
  impactSummary: string;        // 影響範囲
  rollbackCondition?: string;   // 撤回条件
  confidence?: number;          // AI信頼度
  rulesMatched?: string[];      // 命中ルール
  evidence?: string[];          // 過去類似例
}

/**
 * 代替案
 */
export interface Alternative {
  id: string;                   // 'alt-001'
  label: string;                // '推奨案' | '保守的案' | '革新的案'
  changes: Change[];            // 変更内容
  rationale: Rationale;         // 根拠
  guardrail: 'allowed' | 'warning' | 'forbidden';
}

/**
 * 変更内容
 */
export interface Change {
  op: 'add_edge' | 'delete_edge' | 'add_node' | 'update_node';
  data: any;                    // エッジやノードのデータ
}

/**
 * 根拠情報
 */
export interface Rationale {
  rulesMatched: string[];       // 命中ルールID ['R001', 'R002']
  evidence: string[];           // 過去類似例 ['case#123', 'case#456']
  riskNotes?: string[];         // リスク警告
  coverageDelta?: {
    requirementsCovered: number;
    testsMissing: number;
  };
  confidence: number;           // 0.0 ~ 1.0
}

/**
 * コミット
 */
export interface Commit {
  commitId: string;             // 'c001'
  timestamp: Date;
  message: string;              // '要求BR-001と機能Feature-001を接続'
  author: string;               // 'user-12345'
  graphSnapshot: KnowledgeGraph;  // この時点のグラフ全体
  decisionLedgerEntries: DecisionLedgerEntry[];  // この時点の決定レジャー
  parentCommitId?: string;      // 親コミット（巻き戻し用）
}
