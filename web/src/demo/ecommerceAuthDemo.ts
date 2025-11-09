import { GraphNode, GraphEdge, Message } from '../types';

/**
 * ECサイト認証機能の要求抽出デモ
 * examples/ecommerce-auth/ のサンプルプロジェクトを可視化
 */

export interface DemoScenario {
  nodes: GraphNode[];
  edges: GraphEdge[];
  messages: Message[];
  agentState: {
    currentPhase: 'ℐ' | '𝒞' | 'Θ' | 'idle';
    iteration: number;
    convergenceRate: number;
    worldVersion: number;
  };
}

export const ecommerceAuthDemoScenarios: DemoScenario[] = [
  // Step 0: 初期状態
  {
    nodes: [
      {
        id: 'world_0',
        type: 'world',
        data: {
          label: 'World₀',
          description: '現在のECサイト: カート放棄率60%, パスワードリセット問い合わせ多数',
          metadata: {
            cartAbandonmentRate: 60,
            passwordResetTickets: 'high',
            securityIssues: ['MD5ハッシュ', '予測可能なセッショントークン'],
          },
        },
        position: { x: 400, y: 50 },
      },
    ],
    edges: [],
    messages: [
      {
        id: 'msg_0',
        role: 'system',
        content: '🎯 ECサイト ユーザー認証機能改善プロジェクト\n\nステークホルダーインタビューから要求を抽出します。',
        timestamp: new Date('2024-01-15T10:00:00'),
      },
      {
        id: 'msg_1',
        role: 'human',
        content: 'ECサイトのユーザー認証機能を改善したいです。カート放棄率が60%と高く、パスワードリセットの問い合わせが多いです。ステークホルダーインタビューから要求を抽出してください。',
        timestamp: new Date('2024-01-15T10:01:00'),
      },
    ],
    agentState: {
      currentPhase: 'idle',
      iteration: 0,
      convergenceRate: 0,
      worldVersion: 0,
    },
  },

  // Step 1: Intent Resolution (ℐ)
  {
    nodes: [
      {
        id: 'world_0',
        type: 'world',
        data: {
          label: 'World₀',
          description: '現在のECサイト: カート放棄率60%, パスワードリセット問い合わせ多数',
        },
        position: { x: 400, y: 50 },
      },
      {
        id: 'intent_1',
        type: 'intent',
        data: {
          label: 'Intent (ℐ)',
          description: 'ユーザー認証UXを改善し、カート放棄率を削減する',
          metadata: {
            stepBackQuestion: 'なぜユーザーは認証プロセスで離脱するのか？',
          },
        },
        position: { x: 400, y: 180 },
      },
      {
        id: 'goal_1',
        type: 'goal',
        data: {
          label: 'Goal',
          description: 'ステークホルダーインタビューから要求を抽出し、ISO/IEC/IEEE 29148準拠の要求仕様を作成する',
          metadata: {
            priority: 'Must',
            essentialQuestion: 'ユーザー認証の本質的な課題は何か？',
          },
        },
        position: { x: 400, y: 310 },
      },
    ],
    edges: [
      {
        id: 'edge_world_intent',
        source: 'world_0',
        target: 'intent_1',
        label: 'ℐ',
        animated: true,
      },
      {
        id: 'edge_intent_goal',
        source: 'intent_1',
        target: 'goal_1',
        label: '意図解決',
        animated: true,
      },
    ],
    messages: [
      {
        id: 'msg_2',
        role: 'ai',
        content: '✅ ℐ (意図解決) フェーズを開始します...\n\n**Step-Back Question**: なぜユーザーは認証プロセスで離脱するのか？\n\n目標を設定しました:\n- ステークホルダーインタビューから要求を抽出\n- ISO/IEC/IEEE 29148準拠の要求仕様を作成\n- カート放棄率15%削減を目指す',
        timestamp: new Date('2024-01-15T10:01:30'),
        metadata: {
          phase: 'ℐ',
          worldVersion: 0,
        },
      },
    ],
    agentState: {
      currentPhase: 'ℐ',
      iteration: 1,
      convergenceRate: 10,
      worldVersion: 0,
    },
  },

  // Step 2: Command Stack (𝒞)
  {
    nodes: [
      {
        id: 'world_0',
        type: 'world',
        data: { label: 'World₀', description: '初期状態' },
        position: { x: 400, y: 50 },
      },
      {
        id: 'intent_1',
        type: 'intent',
        data: { label: 'Intent (ℐ)', description: '認証UX改善' },
        position: { x: 400, y: 180 },
      },
      {
        id: 'goal_1',
        type: 'goal',
        data: { label: 'Goal', description: '要求抽出・仕様化' },
        position: { x: 400, y: 310 },
      },
      {
        id: 'command_1',
        type: 'command',
        data: {
          label: 'Command Stack (𝒞)',
          description: 'タスク分解: C₁ → C₂ → C₃',
        },
        position: { x: 400, y: 440 },
      },
      {
        id: 'task_1',
        type: 'task',
        data: {
          label: 'Task 1',
          description: 'プロダクトオーナーインタビュー分析',
          metadata: { status: 'in_progress' },
        },
        position: { x: 150, y: 600 },
      },
      {
        id: 'task_2',
        type: 'task',
        data: {
          label: 'Task 2',
          description: 'セキュリティチーム（CISO）インタビュー分析',
          metadata: { status: 'pending' },
        },
        position: { x: 400, y: 600 },
      },
      {
        id: 'task_3',
        type: 'task',
        data: {
          label: 'Task 3',
          description: 'ユーザーフィードバック（1,247件）分析',
          metadata: { status: 'pending' },
        },
        position: { x: 650, y: 600 },
      },
    ],
    edges: [
      {
        id: 'edge_world_intent',
        source: 'world_0',
        target: 'intent_1',
      },
      {
        id: 'edge_intent_goal',
        source: 'intent_1',
        target: 'goal_1',
      },
      {
        id: 'edge_goal_command',
        source: 'goal_1',
        target: 'command_1',
        label: '𝒞',
        animated: true,
      },
      {
        id: 'edge_command_task1',
        source: 'command_1',
        target: 'task_1',
        animated: true,
      },
      {
        id: 'edge_command_task2',
        source: 'command_1',
        target: 'task_2',
        animated: true,
      },
      {
        id: 'edge_command_task3',
        source: 'command_1',
        target: 'task_3',
        animated: true,
      },
    ],
    messages: [
      {
        id: 'msg_3',
        role: 'ai',
        content: '✅ 𝒞 (コマンドスタック) フェーズを開始します...\n\n目標を3つのタスクに分解しました:\n\n**Task 1**: プロダクトオーナーインタビュー分析\n- カート放棄率60%の課題\n- ソーシャルログイン要望\n- パスワードリセット改善\n\n**Task 2**: セキュリティチーム（CISO）インタビュー分析\n- MD5ハッシュ脆弱性対応\n- OAuth 2.0 PKCE実装\n- TOTP 2FA導入\n\n**Task 3**: ユーザーフィードバック（1,247件）分析\n- 18-24歳: ソーシャルログイン希望89%\n- 50歳以上: パスワード管理困難76%',
        timestamp: new Date('2024-01-15T10:02:00'),
        metadata: {
          phase: '𝒞',
          worldVersion: 0,
        },
      },
    ],
    agentState: {
      currentPhase: '𝒞',
      iteration: 1,
      convergenceRate: 25,
      worldVersion: 0,
    },
  },

  // Step 3: World Transformation (Θ) - 6つの変換フェーズ
  {
    nodes: [
      {
        id: 'world_0',
        type: 'world',
        data: { label: 'World₀', description: '初期状態' },
        position: { x: 250, y: 50 },
      },
      {
        id: 'intent_1',
        type: 'intent',
        data: { label: 'Intent (ℐ)' },
        position: { x: 250, y: 160 },
      },
      {
        id: 'goal_1',
        type: 'goal',
        data: { label: 'Goal' },
        position: { x: 250, y: 270 },
      },
      {
        id: 'command_1',
        type: 'command',
        data: { label: 'Command (𝒞)' },
        position: { x: 250, y: 380 },
      },
      {
        id: 'task_1',
        type: 'task',
        data: {
          label: 'Task 1',
          description: 'PO分析',
          metadata: { status: 'completed' },
        },
        position: { x: 50, y: 500 },
      },
      {
        id: 'task_2',
        type: 'task',
        data: {
          label: 'Task 2',
          description: 'CISO分析',
          metadata: { status: 'completed' },
        },
        position: { x: 250, y: 500 },
      },
      {
        id: 'task_3',
        type: 'task',
        data: {
          label: 'Task 3',
          description: 'ユーザーFB分析',
          metadata: { status: 'completed' },
        },
        position: { x: 450, y: 500 },
      },
      {
        id: 'transform_1',
        type: 'transform',
        data: {
          label: 'Transform (Θ)',
          description: 'θ₁→θ₂→θ₃→θ₄→θ₅→θ₆',
          metadata: {
            phases: [
              'θ₁: Understand (理解)',
              'θ₂: Generate (生成)',
              'θ₃: Allocate (割当)',
              'θ₄: Execute (実行)',
              'θ₅: Integrate (統合)',
              'θ₆: Learn (学習)',
            ],
          },
        },
        position: { x: 250, y: 650 },
      },
      {
        id: 'world_1',
        type: 'world',
        data: {
          label: 'World₁',
          description: '要求仕様完成: 13個の要求（BR×3, UR×3, FR×7, NFR×6）',
          metadata: {
            requirements: {
              business: 3,
              user: 3,
              functional: 7,
              nonFunctional: 6,
            },
            expectedCartReduction: '15%',
            compliance: ['ISO/IEC/IEEE 29148', 'GDPR Article 32', 'OWASP Top 10'],
          },
        },
        position: { x: 600, y: 650 },
      },
    ],
    edges: [
      {
        id: 'edge_world_intent',
        source: 'world_0',
        target: 'intent_1',
      },
      {
        id: 'edge_intent_goal',
        source: 'intent_1',
        target: 'goal_1',
      },
      {
        id: 'edge_goal_command',
        source: 'goal_1',
        target: 'command_1',
      },
      {
        id: 'edge_command_task1',
        source: 'command_1',
        target: 'task_1',
      },
      {
        id: 'edge_command_task2',
        source: 'command_1',
        target: 'task_2',
      },
      {
        id: 'edge_command_task3',
        source: 'command_1',
        target: 'task_3',
      },
      {
        id: 'edge_task1_transform',
        source: 'task_1',
        target: 'transform_1',
      },
      {
        id: 'edge_task2_transform',
        source: 'task_2',
        target: 'transform_1',
      },
      {
        id: 'edge_task3_transform',
        source: 'task_3',
        target: 'transform_1',
      },
      {
        id: 'edge_transform_world1',
        source: 'transform_1',
        target: 'world_1',
        label: '「瞬き」',
        animated: true,
        style: { strokeWidth: 3 },
      },
    ],
    messages: [
      {
        id: 'msg_4',
        role: 'ai',
        content: '✅ Θ (世界変換) フェーズを開始します...\n\n6つの変換を適用中:\n\n**θ₁ (Understand)**: 3つのインタビューを理解\n**θ₂ (Generate)**: 要求候補を生成\n**θ₃ (Allocate)**: MoSCoW優先順位付け\n**θ₄ (Execute)**: 5C原則で検証\n**θ₅ (Integrate)**: トレーサビリティ確立\n**θ₆ (Learn)**: 組織憲章との整合性確認',
        timestamp: new Date('2024-01-15T10:03:00'),
        metadata: {
          phase: 'Θ',
          worldVersion: 0,
        },
      },
      {
        id: 'msg_5',
        role: 'ai',
        content: '🎉 要求抽出が完了しました！\n\n**抽出された要求**:\n- ビジネス要求 (BR): 3件\n- ユーザー要求 (UR): 3件\n- 機能要求 (FR): 7件\n- 非機能要求 (NFR): 6件\n\n**主要な要求**:\n✅ FR-001: Google/LINE/Appleソーシャルログイン (Must)\n✅ FR-002: 多要素認証（TOTP） (Must)\n✅ NFR-001: bcrypt/Argon2ハッシュ化 (Must)\n✅ NFR-003: OAuth 2.0 PKCE準拠 (Must)\n\n**期待される効果**:\n- カート放棄率: 60% → 45%（15%削減）\n- サポートコスト: 50%削減\n- セキュリティ: GDPR Article 32準拠',
        timestamp: new Date('2024-01-15T10:04:00'),
        metadata: {
          phase: 'Θ',
          worldVersion: 1,
        },
      },
    ],
    agentState: {
      currentPhase: 'Θ',
      iteration: 1,
      convergenceRate: 85,
      worldVersion: 1,
    },
  },

  // Step 4: Convergence (収束)
  {
    nodes: [
      {
        id: 'world_1',
        type: 'world',
        data: {
          label: 'World₁',
          description: '要求仕様完成',
        },
        position: { x: 400, y: 300 },
      },
    ],
    edges: [],
    messages: [
      {
        id: 'msg_6',
        role: 'system',
        content: '✨ 統一エージェント方程式が収束しました\n\n**最終状態**:\n- 反復回数: 1/10\n- 収束率: 100%\n- 世界バージョン: World₁\n\n**成果物**:\n📄 `examples/ecommerce-auth/requirements/requirements_v1.md`\n- ISO/IEC/IEEE 29148準拠\n- 5C原則（Clear/Verifiable/Complete/Consistent/Feasible）検証済み\n- MoSCoW優先順位付け完了\n- Given-When-Then受入基準定義済み\n- トレーサビリティマトリクス確立',
        timestamp: new Date('2024-01-15T10:05:00'),
        metadata: {
          worldVersion: 1,
        },
      },
    ],
    agentState: {
      currentPhase: 'idle',
      iteration: 1,
      convergenceRate: 100,
      worldVersion: 1,
    },
  },
];
