/**
 * 知識グラフのデータモデル
 *
 * 要求・機能・テストとそのトレーサビリティを表現
 */

// ノードの種類
export type KnowledgeNodeType =
  | 'requirement'  // 要求
  | 'feature'      // 機能
  | 'test';        // テスト

// ノード
export interface KnowledgeNode {
  id: string;
  type: KnowledgeNodeType;
  label: string;
  description: string;

  // メタデータ
  metadata?: {
    priority?: 'Must' | 'Should' | 'Could' | 'Wont';
    status?: 'pending' | 'in_progress' | 'completed';
    owner?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

// エッジ（関係性）
export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  label?: string;

  // 関係の種類
  type:
    | 'implements'   // 要求 → 機能
    | 'tests'        // テスト → 機能
    | 'verifies';    // テスト → 要求
}

// 吹き出し（コメント）
export interface Comment {
  id: string;
  nodeId: string;        // どのノードへのコメントか
  author: 'human' | 'ai';
  content: string;
  timestamp: Date;

  // 吹き出しの位置（オプション）
  position?: {
    x: number;
    y: number;
  };
}

// 知識グラフ全体
export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  comments: Comment[];

  // メタデータ
  metadata: {
    projectName: string;
    version: string;
    lastUpdated: Date;
  };
}

// グラフのレイアウト情報（表示用）
export interface GraphLayout {
  nodes: Array<{
    id: string;
    position: { x: number; y: number };
  }>;
}
