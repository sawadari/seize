//! # Seize Core - 統一エージェント方程式の実装
//!
//! ```text
//! 𝔸(Input, World₀) = lim_{n→∞} [∫₀ⁿ (Θ ◦ 𝒞 ◦ ℐ)(t) dt] = World_∞
//! ```
//!
//! ## 構成要素
//! - `ℐ`: Intent Resolution (意図解決)
//! - `𝒞`: Command Stack (コマンドスタック)
//! - `Θ`: World Transformation (世界変換)

pub mod world;
pub mod intent;
pub mod command;
pub mod transformation;
pub mod agent;
pub mod requirements;

pub use world::World;
pub use intent::{IntentResolver, Goal};
pub use command::{CommandStack, ExecutionPlan};
pub use transformation::{WorldTransformer, TransformationPhase};
pub use agent::UnifiedAgent;
pub use requirements::{RequirementsEngineer, Requirement, RequirementsSpecification};

/// エージェントのコア実行結果
#[derive(Debug, Clone)]
pub struct AgentResult {
    pub initial_world: World,
    pub final_world: World,
    pub iterations: usize,
    pub converged: bool,
}
