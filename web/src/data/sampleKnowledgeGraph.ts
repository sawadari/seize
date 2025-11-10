import { KnowledgeGraph, KnowledgeNode, KnowledgeEdge, Comment } from '../types/knowledgeGraph';

/**
 * サンプル知識グラフ: ECサイト認証機能
 */

// 要求ノード
const requirements: KnowledgeNode[] = [
  {
    id: 'req-001',
    type: 'requirement',
    label: 'BR-001',
    description: 'カート放棄率を15%削減',
    metadata: {
      priority: 'Must',
      status: 'completed',
      owner: 'Product Owner',
      createdAt: '2024-01-15',
    },
  },
  {
    id: 'req-002',
    type: 'requirement',
    label: 'UR-001',
    description: 'ソーシャルログインでログイン可能',
    metadata: {
      priority: 'Must',
      status: 'completed',
      owner: 'Users',
      createdAt: '2024-01-15',
    },
  },
  {
    id: 'req-003',
    type: 'requirement',
    label: 'NFR-001',
    description: 'パスワードはbcryptでハッシュ化',
    metadata: {
      priority: 'Must',
      status: 'completed',
      owner: 'CISO',
      createdAt: '2024-01-15',
    },
  },
];

// 機能ノード
const features: KnowledgeNode[] = [
  {
    id: 'feat-001',
    type: 'feature',
    label: 'Feature-001',
    description: 'Googleソーシャルログイン',
    metadata: {
      status: 'completed',
      owner: 'Dev Team',
      createdAt: '2024-01-20',
    },
  },
  {
    id: 'feat-002',
    type: 'feature',
    label: 'Feature-002',
    description: 'LINEソーシャルログイン',
    metadata: {
      status: 'in_progress',
      owner: 'Dev Team',
      createdAt: '2024-01-20',
    },
  },
  {
    id: 'feat-003',
    type: 'feature',
    label: 'Feature-003',
    description: 'パスワードハッシュ化（bcrypt）',
    metadata: {
      status: 'completed',
      owner: 'Dev Team',
      createdAt: '2024-01-18',
    },
  },
];

// テストノード
const tests: KnowledgeNode[] = [
  {
    id: 'test-001',
    type: 'test',
    label: 'Test-001',
    description: 'Googleログインの統合テスト',
    metadata: {
      status: 'completed',
      owner: 'QA Team',
      createdAt: '2024-01-25',
    },
  },
  {
    id: 'test-002',
    type: 'test',
    label: 'Test-002',
    description: 'bcryptハッシュ化の単体テスト',
    metadata: {
      status: 'completed',
      owner: 'QA Team',
      createdAt: '2024-01-22',
    },
  },
  {
    id: 'test-003',
    type: 'test',
    label: 'Test-003',
    description: 'カート放棄率の測定テスト',
    metadata: {
      status: 'in_progress',
      owner: 'QA Team',
      createdAt: '2024-01-26',
    },
  },
];

// エッジ（関係性）
const edges: KnowledgeEdge[] = [
  // 要求 → 機能
  {
    id: 'edge-001',
    source: 'req-002',
    target: 'feat-001',
    type: 'implements',
    label: '実装',
  },
  {
    id: 'edge-002',
    source: 'req-002',
    target: 'feat-002',
    type: 'implements',
    label: '実装',
  },
  {
    id: 'edge-003',
    source: 'req-003',
    target: 'feat-003',
    type: 'implements',
    label: '実装',
  },

  // テスト → 機能
  {
    id: 'edge-004',
    source: 'test-001',
    target: 'feat-001',
    type: 'tests',
    label: 'テスト',
  },
  {
    id: 'edge-005',
    source: 'test-002',
    target: 'feat-003',
    type: 'tests',
    label: 'テスト',
  },

  // テスト → 要求
  {
    id: 'edge-006',
    source: 'test-003',
    target: 'req-001',
    type: 'verifies',
    label: '検証',
  },
  {
    id: 'edge-007',
    source: 'test-001',
    target: 'req-002',
    type: 'verifies',
    label: '検証',
  },
  {
    id: 'edge-008',
    source: 'test-002',
    target: 'req-003',
    type: 'verifies',
    label: '検証',
  },
];

// コメント（吹き出し）
const comments: Comment[] = [
  {
    id: 'comment-001',
    nodeId: 'req-002',
    author: 'ai',
    content: 'この要求は18-24歳のユーザーから強く要望されています（89%）。優先度Mustが適切です。',
    timestamp: new Date('2024-01-15T10:30:00'),
  },
  {
    id: 'comment-002',
    nodeId: 'req-002',
    author: 'human',
    content: '了解しました。GoogleとLINEの両方を実装する方針で進めます。',
    timestamp: new Date('2024-01-15T10:35:00'),
  },
  {
    id: 'comment-003',
    nodeId: 'feat-002',
    author: 'ai',
    content: 'LINEログインは現在実装中です。OAuth 2.0 PKCE準拠で実装されています。',
    timestamp: new Date('2024-01-20T14:00:00'),
  },
  {
    id: 'comment-004',
    nodeId: 'req-003',
    author: 'human',
    content: 'セキュリティは最優先です。bcryptのコストファクターは12で設定してください。',
    timestamp: new Date('2024-01-18T09:15:00'),
  },
  {
    id: 'comment-005',
    nodeId: 'feat-003',
    author: 'ai',
    content: 'bcryptのコストファクター12で実装済みです。OWASP推奨値に準拠しています。',
    timestamp: new Date('2024-01-18T15:30:00'),
  },
  {
    id: 'comment-006',
    nodeId: 'test-003',
    author: 'ai',
    content: 'カート放棄率の測定テストは現在実施中です。A/Bテストで効果を検証しています。',
    timestamp: new Date('2024-01-26T11:00:00'),
  },
];

// 知識グラフ全体
export const sampleKnowledgeGraph: KnowledgeGraph = {
  nodes: [...requirements, ...features, ...tests],
  edges,
  comments,
  metadata: {
    projectName: 'ECサイト認証機能改善',
    version: '1.0.0',
    lastUpdated: new Date('2024-01-26'),
  },
};

// レイアウト情報（初期配置）
export const sampleGraphLayout = {
  nodes: [
    // 要求（左側）
    { id: 'req-001', position: { x: 100, y: 50 } },
    { id: 'req-002', position: { x: 100, y: 200 } },
    { id: 'req-003', position: { x: 100, y: 350 } },

    // 機能（中央）
    { id: 'feat-001', position: { x: 400, y: 150 } },
    { id: 'feat-002', position: { x: 400, y: 300 } },
    { id: 'feat-003', position: { x: 400, y: 400 } },

    // テスト（右側）
    { id: 'test-001', position: { x: 700, y: 100 } },
    { id: 'test-002', position: { x: 700, y: 350 } },
    { id: 'test-003', position: { x: 700, y: 50 } },
  ],
};
