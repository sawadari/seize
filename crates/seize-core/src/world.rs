//! # 世界モデル (World Model)
//!
//! **概念**: 瞬く景色 (Flickering Scenery)
//!
//! エージェントが認識・操作する世界の状態。
//! 世界は離散的な「景色」として瞬間的に捉えられ、
//! 各認識サイクルで「瞬き」のように更新される。

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// 世界の状態を表現する構造体
///
/// ## 構成要素
/// - ファイルシステム状態
/// - 実行コンテキスト
/// - 知識ベース
/// - メタデータ
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct World {
    /// 世界のバージョン番号（瞬きの回数）
    pub version: usize,

    /// ファイルシステムの状態
    pub filesystem: HashMap<String, String>,

    /// 実行コンテキスト
    pub context: ExecutionContext,

    /// 知識ベース
    pub knowledge: KnowledgeBase,

    /// メタデータ
    pub metadata: HashMap<String, String>,
}

/// 実行コンテキスト
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExecutionContext {
    /// 現在の作業ディレクトリ
    pub working_directory: String,

    /// 環境変数
    pub environment: HashMap<String, String>,

    /// 実行履歴
    pub history: Vec<String>,
}

/// 知識ベース
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KnowledgeBase {
    /// 組織の原則（憲章に基づく）
    pub principles: Vec<Principle>,

    /// 学習した知見
    pub learnings: Vec<Learning>,

    /// 意思決定の記録
    pub decisions: Vec<Decision>,
}

/// 組織原則
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Principle {
    pub name: String,
    pub description: String,
    pub category: PrincipleCategory,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PrincipleCategory {
    Human,           // 人間の宣言
    Organization,    // 組織の目的
    Behavioral,      // 行動指針
    AIUtilization,   // AI活用の原則
}

/// 学習した知見
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Learning {
    pub timestamp: String,
    pub content: String,
    pub source: String,
    pub confidence: f64,
}

/// 意思決定の記録
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Decision {
    pub timestamp: String,
    pub purpose: String,
    pub input: String,
    pub options: Vec<String>,
    pub rationale: String,
    pub approver: String,
    pub impact_scope: String,
    pub alternatives: Vec<String>,
    pub revocation_conditions: Vec<String>,
}

impl World {
    /// 新しい世界を初期化
    pub fn new() -> Self {
        Self {
            version: 0,
            filesystem: HashMap::new(),
            context: ExecutionContext::default(),
            knowledge: KnowledgeBase::default(),
            metadata: HashMap::new(),
        }
    }

    /// 世界を次の状態に進める（瞬く）
    pub fn advance(&mut self) {
        self.version += 1;
    }

    /// 意思決定を記録
    pub fn record_decision(&mut self, decision: Decision) {
        self.knowledge.decisions.push(decision);
    }

    /// 学習を記録
    pub fn record_learning(&mut self, learning: Learning) {
        self.knowledge.learnings.push(learning);
    }
}

impl Default for World {
    fn default() -> Self {
        Self::new()
    }
}

impl Default for ExecutionContext {
    fn default() -> Self {
        Self {
            working_directory: String::from("."),
            environment: HashMap::new(),
            history: Vec::new(),
        }
    }
}

impl Default for KnowledgeBase {
    fn default() -> Self {
        Self {
            principles: Self::load_charter_principles(),
            learnings: Vec::new(),
            decisions: Vec::new(),
        }
    }
}

impl KnowledgeBase {
    /// 憲章から原則を読み込む
    fn load_charter_principles() -> Vec<Principle> {
        vec![
            Principle {
                name: "人間は判断する".to_string(),
                description: "AIは情報を示す。最終的な選択と責任は人間にある".to_string(),
                category: PrincipleCategory::Human,
            },
            Principle {
                name: "意図を持って問いを立てる".to_string(),
                description: "正しい答えよりも、正しい問いを生み出す力を尊ぶ".to_string(),
                category: PrincipleCategory::Human,
            },
            Principle {
                name: "公正と透明性".to_string(),
                description: "意思決定の記録を保存し、説明可能性を維持する".to_string(),
                category: PrincipleCategory::Organization,
            },
            Principle {
                name: "目的の明確化".to_string(),
                description: "利用前に「何を・なぜ・どのように」使うかを定義する".to_string(),
                category: PrincipleCategory::AIUtilization,
            },
        ]
    }
}
