import { GraphNode, GraphEdge, Message } from '../types';

/**
 * 人間中心AI時代の組織憲章を体現するデモ
 *
 * コンセプト:
 * - 統一エージェント方程式は物理学的基盤（見えない土台）
 * - 可視化するのは「人間とAIの協働プロセス」
 * - 人間が判断し、AIが情報を提供し、共に目標を達成
 */

export interface HumanCenteredScenario {
  nodes: GraphNode[];
  edges: GraphEdge[];
  messages: Message[];
  agentState: {
    currentPhase: 'questioning' | 'exploring' | 'deciding' | 'learning' | 'idle';
    iteration: number;
    convergenceRate: number;
    worldVersion: number;
  };
}

export const humanCenteredDemoScenarios: HumanCenteredScenario[] = [
  // Step 0: 人間の問い
  {
    nodes: [
      {
        id: 'human_goal',
        type: 'goal',
        data: {
          label: '人間の目標',
          description: 'ECサイトのユーザー体験を改善したい',
          metadata: {
            owner: 'human',
            intent: 'カート放棄率を下げたい',
          },
        },
        position: { x: 400, y: 100 },
      },
    ],
    edges: [],
    messages: [
      {
        id: 'msg_0',
        role: 'system',
        content: '🌍 人間中心AI時代の協働\n\n人間とAIが共通の目標を持ち、相互補完的に問題を解決します。\n\n**組織憲章の原則**:\n1️⃣ 人間は判断する\n2️⃣ AIは情報を提供する\n3️⃣ 共に学び、成長する',
        timestamp: new Date('2024-01-15T10:00:00'),
      },
      {
        id: 'msg_1',
        role: 'human',
        content: 'ECサイトのユーザー体験を改善したいです。特にカート放棄率が高く、60%もあります。どうすればいいでしょうか？',
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

  // Step 1: AIの適切な問いかけ（Step-Back Question）
  {
    nodes: [
      {
        id: 'human_goal',
        type: 'goal',
        data: {
          label: '人間の目標',
          description: 'ECサイトのUX改善',
        },
        position: { x: 200, y: 100 },
      },
      {
        id: 'ai_question',
        type: 'intent',
        data: {
          label: 'AIの問いかけ',
          description: '本質的な問いを提示',
          metadata: {
            question: 'なぜユーザーは購入をやめるのか？',
            role: 'AIは理解を深める問いを提示',
          },
        },
        position: { x: 600, y: 100 },
      },
      {
        id: 'exploration',
        type: 'command',
        data: {
          label: '共同探索',
          description: '人間とAIが共に情報を集める',
        },
        position: { x: 400, y: 250 },
      },
    ],
    edges: [
      {
        id: 'edge_human_ai',
        source: 'human_goal',
        target: 'ai_question',
        label: '協働開始',
        animated: true,
      },
      {
        id: 'edge_question_explore',
        source: 'ai_question',
        target: 'exploration',
        animated: true,
      },
      {
        id: 'edge_goal_explore',
        source: 'human_goal',
        target: 'exploration',
        animated: true,
      },
    ],
    messages: [
      {
        id: 'msg_2',
        role: 'ai',
        content: '理解しました。カート放棄率60%は確かに高いですね。\n\nまず、本質的な問いを立てましょう:\n\n**❓ なぜユーザーは購入をやめるのか？**\n\n表面的な解決（例: UIの改善）の前に、根本原因を理解することが重要です。\n\n📊 **AIからの提案**: \n以下の情報源から探索しませんか？\n\n1. **プロダクトオーナー**の視点（ビジネス目標）\n2. **セキュリティチーム**の視点（技術的制約）\n3. **ユーザー**の声（実際の困りごと）\n\n**最終判断は、あなたにお任せします。** どの順序で調査しますか？',
        timestamp: new Date('2024-01-15T10:01:30'),
        metadata: {
          phase: 'questioning',
          worldVersion: 0,
        },
      },
    ],
    agentState: {
      currentPhase: 'questioning',
      iteration: 1,
      convergenceRate: 15,
      worldVersion: 0,
    },
  },

  // Step 2: 人間の判断とAIの情報提供
  {
    nodes: [
      {
        id: 'human_goal',
        type: 'goal',
        data: { label: '人間の目標', description: 'UX改善' },
        position: { x: 400, y: 50 },
      },
      {
        id: 'human_decision',
        type: 'world',
        data: {
          label: '人間の判断',
          description: '3つの視点から調査することを決定',
          metadata: {
            decision: 'すべてのステークホルダーの声を聞く',
            reason: '全体像を把握してから判断したい',
          },
        },
        position: { x: 400, y: 180 },
      },
      {
        id: 'ai_info_po',
        type: 'task',
        data: {
          label: 'AI: PO分析',
          description: 'ビジネス目標の整理',
          metadata: { status: 'in_progress', role: 'AI' },
        },
        position: { x: 150, y: 350 },
      },
      {
        id: 'ai_info_sec',
        type: 'task',
        data: {
          label: 'AI: セキュリティ分析',
          description: '技術的課題の特定',
          metadata: { status: 'in_progress', role: 'AI' },
        },
        position: { x: 400, y: 350 },
      },
      {
        id: 'ai_info_user',
        type: 'task',
        data: {
          label: 'AI: ユーザーFB分析',
          description: '1,247件の声を分析',
          metadata: { status: 'in_progress', role: 'AI' },
        },
        position: { x: 650, y: 350 },
      },
    ],
    edges: [
      {
        id: 'edge_goal_decision',
        source: 'human_goal',
        target: 'human_decision',
        label: '人間が判断',
        animated: true,
      },
      {
        id: 'edge_decision_po',
        source: 'human_decision',
        target: 'ai_info_po',
        label: 'AIが情報提供',
      },
      {
        id: 'edge_decision_sec',
        source: 'human_decision',
        target: 'ai_info_sec',
        label: 'AIが情報提供',
      },
      {
        id: 'edge_decision_user',
        source: 'human_decision',
        target: 'ai_info_user',
        label: 'AIが情報提供',
      },
    ],
    messages: [
      {
        id: 'msg_3',
        role: 'human',
        content: 'すべてのステークホルダーの声を聞いて、全体像を把握してから判断したいです。3つすべての調査をお願いできますか？',
        timestamp: new Date('2024-01-15T10:02:00'),
      },
      {
        id: 'msg_4',
        role: 'ai',
        content: '✅ 承知しました。あなたの判断を尊重します。\n\n**AIの役割**: 情報を整理して提示します\n**人間の役割**: 最終的な意思決定をします\n\n📊 **情報収集を開始します**:\n\n1️⃣ **プロダクトオーナーへのインタビュー分析中...**\n   - カート放棄率60%の背景\n   - ビジネス目標: 15%削減\n   - 予算制約: 6ヶ月で実装\n\n2️⃣ **セキュリティチーム（CISO）分析中...**\n   - 現在のセキュリティ課題\n   - MD5ハッシュ、予測可能なトークン\n   - GDPR Article 32準拠が必要\n\n3️⃣ **ユーザーフィードバック（1,247件）分析中...**\n   - 年齢層別の要望\n   - パスワード管理の困難さ（76%）\n   - ソーシャルログイン希望（89%）\n\n⏳ 分析完了まで少々お待ちください...',
        timestamp: new Date('2024-01-15T10:02:15'),
        metadata: {
          phase: 'exploring',
          worldVersion: 1,
        },
      },
    ],
    agentState: {
      currentPhase: 'exploring',
      iteration: 1,
      convergenceRate: 40,
      worldVersion: 1,
    },
  },

  // Step 3: AIからの情報提示と人間への選択肢提案
  {
    nodes: [
      {
        id: 'human_goal',
        type: 'goal',
        data: { label: '人間の目標' },
        position: { x: 400, y: 50 },
      },
      {
        id: 'ai_insights',
        type: 'transform',
        data: {
          label: 'AIの洞察',
          description: '情報を統合して選択肢を提示',
          metadata: {
            role: '人間の判断をサポート',
          },
        },
        position: { x: 400, y: 200 },
      },
      {
        id: 'option_1',
        type: 'task',
        data: {
          label: '選択肢1: ソーシャルログイン',
          description: 'Google/LINE/Apple統合',
          metadata: { status: 'pending', priority: 'Must' },
        },
        position: { x: 150, y: 380 },
      },
      {
        id: 'option_2',
        type: 'task',
        data: {
          label: '選択肢2: セキュリティ改善',
          description: 'bcrypt + TOTP 2FA',
          metadata: { status: 'pending', priority: 'Must' },
        },
        position: { x: 400, y: 380 },
      },
      {
        id: 'option_3',
        type: 'task',
        data: {
          label: '選択肢3: パスワードリセット',
          description: 'UX改善 + セルフサービス',
          metadata: { status: 'pending', priority: 'Should' },
        },
        position: { x: 650, y: 380 },
      },
      {
        id: 'human_choice',
        type: 'world',
        data: {
          label: '人間の選択',
          description: 'あなたの判断を待っています',
          metadata: { status: 'waiting' },
        },
        position: { x: 400, y: 530 },
      },
    ],
    edges: [
      {
        id: 'edge_goal_insights',
        source: 'human_goal',
        target: 'ai_insights',
        animated: true,
      },
      {
        id: 'edge_insights_opt1',
        source: 'ai_insights',
        target: 'option_1',
      },
      {
        id: 'edge_insights_opt2',
        source: 'ai_insights',
        target: 'option_2',
      },
      {
        id: 'edge_insights_opt3',
        source: 'ai_insights',
        target: 'option_3',
      },
      {
        id: 'edge_opt1_choice',
        source: 'option_1',
        target: 'human_choice',
        style: { strokeDasharray: '5,5' },
      },
      {
        id: 'edge_opt2_choice',
        source: 'option_2',
        target: 'human_choice',
        style: { strokeDasharray: '5,5' },
      },
      {
        id: 'edge_opt3_choice',
        source: 'option_3',
        target: 'human_choice',
        style: { strokeDasharray: '5,5' },
      },
    ],
    messages: [
      {
        id: 'msg_5',
        role: 'ai',
        content: '✅ 分析が完了しました！\n\n📊 **統合された洞察**:\n\n**共通する課題**:\n- 認証プロセスが複雑（18-24歳の89%が不満）\n- セキュリティが脆弱（MD5、予測可能トークン）\n- パスワードリセット問い合わせが多い\n\n---\n\n🎯 **AIからの選択肢提案**:\n\n**選択肢1: ソーシャルログイン導入** (Must)\n- 予想効果: カート放棄率 60% → 48%（12%削減）\n- 実装期間: 3ヶ月\n- コスト: 中\n- リスク: プライバシー懸念\n\n**選択肢2: セキュリティ基盤強化** (Must)\n- bcrypt/Argon2ハッシュ化\n- TOTP 2要素認証\n- OAuth 2.0 PKCE準拠\n- GDPR Article 32準拠\n\n**選択肢3: パスワードリセットUX改善** (Should)\n- セルフサービス化\n- サポートコスト50%削減\n\n---\n\n❓ **あなたの判断が必要です**:\n\nどの選択肢を優先しますか？複数選択も可能です。\n\n💡 **AIからの助言**: \n選択肢1と2は相互補完的です。セキュリティ基盤を整えてから、ソーシャルログインを導入するのが推奨パターンです。\n\n**最終決定は、あなたにお任せします。**',
        timestamp: new Date('2024-01-15T10:03:30'),
        metadata: {
          phase: 'deciding',
          worldVersion: 1,
        },
      },
    ],
    agentState: {
      currentPhase: 'deciding',
      iteration: 1,
      convergenceRate: 70,
      worldVersion: 1,
    },
  },

  // Step 4: 人間の決断と共同実行
  {
    nodes: [
      {
        id: 'human_decision_final',
        type: 'world',
        data: {
          label: '人間の決断',
          description: 'セキュリティ優先、次にソーシャルログイン',
          metadata: {
            decision: '選択肢2 → 選択肢1の順で実装',
            reasoning: '安全性を担保してからUX改善',
            責任者: '人間（あなた）',
          },
        },
        position: { x: 400, y: 100 },
      },
      {
        id: 'collab_spec',
        type: 'transform',
        data: {
          label: '共同で仕様化',
          description: '人間とAIが協働して要求仕様を作成',
        },
        position: { x: 400, y: 250 },
      },
      {
        id: 'result',
        type: 'world',
        data: {
          label: '成果物',
          description: '要求仕様書（ISO/IEC/IEEE 29148準拠）',
          metadata: {
            requirements: 13,
            mustHave: 7,
            shouldHave: 4,
            couldHave: 2,
            責任: '人間が最終承認',
          },
        },
        position: { x: 400, y: 400 },
      },
    ],
    edges: [
      {
        id: 'edge_decision_collab',
        source: 'human_decision_final',
        target: 'collab_spec',
        label: '協働',
        animated: true,
      },
      {
        id: 'edge_collab_result',
        source: 'collab_spec',
        target: 'result',
        label: '共創',
        animated: true,
      },
    ],
    messages: [
      {
        id: 'msg_6',
        role: 'human',
        content: 'セキュリティを優先します。選択肢2を先に実装してから、選択肢1のソーシャルログインを導入する方針で進めたいです。',
        timestamp: new Date('2024-01-15T10:04:00'),
      },
      {
        id: 'msg_7',
        role: 'ai',
        content: '✅ 素晴らしい判断です！\n\n**あなたの決断**:\n1. セキュリティ基盤強化（選択肢2）\n2. ソーシャルログイン導入（選択肢1）\n\n**判断の根拠**: 安全性を担保してからUX改善\n**責任者**: あなた\n\n---\n\n🤝 **共同で仕様化します**:\n\n**人間の役割**:\n- 優先順位の最終決定\n- ビジネス要件の承認\n- リスクの受容判断\n\n**AIの役割**:\n- 技術要件の整理\n- 標準規格への準拠確認（ISO/IEC/IEEE 29148）\n- トレーサビリティの維持\n\n📝 **生成中の要求仕様**:\n- ビジネス要求（BR）: 3件\n- ユーザー要求（UR）: 3件\n- 機能要求（FR）: 7件\n- 非機能要求（NFR）: 6件\n\n✅ 要求仕様書を生成しました！\n\n**最終承認**: あなたの署名が必要です。',
        timestamp: new Date('2024-01-15T10:04:30'),
        metadata: {
          phase: 'learning',
          worldVersion: 2,
        },
      },
    ],
    agentState: {
      currentPhase: 'learning',
      iteration: 2,
      convergenceRate: 95,
      worldVersion: 2,
    },
  },

  // Step 5: 学びと次のサイクル
  {
    nodes: [
      {
        id: 'reflection',
        type: 'goal',
        data: {
          label: '振り返りと学び',
          description: '人間とAIが共に成長',
          metadata: {
            humanLearning: '問いの重要性、全体像の把握',
            aiLearning: '人間の判断パターン、組織文化',
          },
        },
        position: { x: 400, y: 250 },
      },
    ],
    edges: [],
    messages: [
      {
        id: 'msg_8',
        role: 'system',
        content: '🎉 協働完了！\n\n---\n\n## 🌟 人間中心の協働プロセス\n\n### 人間の役割（実践したこと）\n✅ **判断**: 調査範囲・優先順位・実装方針を決定\n✅ **問い**: 本質的な課題を理解\n✅ **責任**: 最終承認と意思決定\n✅ **成長**: 全体像を把握する重要性を学習\n\n### AIの役割（実践したこと）\n✅ **情報提供**: 3つのステークホルダー分析\n✅ **選択肢提示**: 優先順位付けされた提案\n✅ **仕様化支援**: ISO標準準拠の要求書生成\n✅ **学習**: 人間の判断パターンを理解\n\n---\n\n## 📊 成果\n\n**生成された要求仕様書**:\n- ISO/IEC/IEEE 29148準拠\n- 13個の要求（Must×7, Should×4, Could×2）\n- トレーサビリティ確立\n- **人間が最終承認**\n\n**期待される効果**:\n- カート放棄率: 60% → 45%（15%削減）\n- セキュリティ: GDPR Article 32準拠\n- サポートコスト: 50%削減\n\n---\n\n## 💡 組織憲章の原則（実践済み）\n\n1️⃣ **人間は判断する** ✅\n   → あなたが優先順位と実装方針を決定\n\n2️⃣ **AIは情報を提供する** ✅\n   → AIが分析結果と選択肢を提示\n\n3️⃣ **共に学び、成長する** ✅\n   → 人間とAIが協働プロセスから学習\n\n4️⃣ **責任は人間が持つ** ✅\n   → 最終承認はあなたが実施\n\n5️⃣ **説明可能性を維持** ✅\n   → すべての判断根拠を記録\n\n---\n\n🔄 **次のサイクルへ**: \nこの経験を次のプロジェクトに活かせます。',
        timestamp: new Date('2024-01-15T10:05:00'),
      },
    ],
    agentState: {
      currentPhase: 'idle',
      iteration: 2,
      convergenceRate: 100,
      worldVersion: 2,
    },
  },
];
