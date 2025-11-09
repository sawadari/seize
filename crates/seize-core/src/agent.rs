//! # 統一エージェント (Unified Agent)
//!
//! ```text
//! 𝔸(Input, World₀) = lim_{n→∞} [∫₀ⁿ (Θ ◦ 𝒞 ◦ ℐ)(t) dt] = World_∞
//! ```

use crate::{
    command::CommandStack, intent::IntentResolver, transformation::WorldTransformer,
    AgentResult, World,
};

/// 統一エージェント
pub struct UnifiedAgent {
    /// 意図解決器
    intent_resolver: IntentResolver,

    /// コマンドスタック
    command_stack: CommandStack,

    /// 世界変換器
    world_transformer: WorldTransformer,

    /// 最大反復回数
    max_iterations: usize,

    /// 収束判定の閾値
    convergence_threshold: f64,
}

impl UnifiedAgent {
    /// 新しい統一エージェントを作成
    pub fn new(max_iterations: usize, convergence_threshold: f64) -> Self {
        Self {
            intent_resolver: IntentResolver::default(),
            command_stack: CommandStack::default(),
            world_transformer: WorldTransformer::default(),
            max_iterations,
            convergence_threshold,
        }
    }

    /// エージェントを実行
    ///
    /// ## プロセス
    /// 1. ℐ: 入力から目標を解決
    /// 2. 𝒞: 目標を実行計画に分解
    /// 3. Θ: 実行計画を適用して世界を変換
    /// 4. 収束判定: 目標が達成されたか確認
    /// 5. 未収束なら反復
    pub fn run(&self, input: &str, initial_world: World) -> anyhow::Result<AgentResult> {
        let mut world = initial_world.clone();
        let mut iterations = 0;
        let mut converged = false;

        tracing::info!("🎯 統一エージェント起動");
        tracing::info!("入力: {}", input);

        while iterations < self.max_iterations && !converged {
            iterations += 1;
            tracing::info!("\n📍 反復 {}/{}", iterations, self.max_iterations);

            // ℐ: Intent Resolution
            tracing::info!("ℐ: 意図解決中...");
            let goal = self.intent_resolver.resolve(input)?;
            tracing::info!("✓ 目標: {}", goal.description);
            tracing::info!("✓ 本質的な問い: {}", goal.essential_question);

            // 𝒞: Command Stack
            tracing::info!("𝒞: コマンドスタック分解中...");
            let plan = self.command_stack.decompose(goal)?;
            tracing::info!("✓ {}個のタスクに分解", plan.tasks.len());

            // Θ: World Transformation
            tracing::info!("Θ: 世界変換適用中...");
            world = self.world_transformer.apply(plan, world)?;
            tracing::info!("✓ World v{} に更新", world.version);

            // 収束判定
            converged = self.check_convergence(&world, iterations);
            if converged {
                tracing::info!("✅ 収束条件を満たしました");
            }
        }

        if !converged {
            tracing::warn!("⚠️ 最大反復回数に到達（収束せず）");
        }

        Ok(AgentResult {
            initial_world,
            final_world: world,
            iterations,
            converged,
        })
    }

    /// 収束判定
    ///
    /// ## 判定基準
    /// - タスク実行の履歴が一定数に達した
    /// - 学習内容が十分蓄積された
    /// - エラーが発生していない
    fn check_convergence(&self, world: &World, iterations: usize) -> bool {
        // 簡易実装: 反復回数と履歴の長さで判定
        let history_length = world.context.history.len();
        let learning_count = world.knowledge.learnings.len();

        // 十分な実行履歴と学習があれば収束とみなす
        if history_length >= iterations * 2 && learning_count >= iterations {
            return true;
        }

        // 閾値判定（将来的にはより高度な判定を実装）
        let convergence_score =
            (history_length as f64 / (iterations * 3) as f64).min(1.0);

        convergence_score >= self.convergence_threshold
    }

    /// エージェントの状態を表示
    pub fn status(&self) -> String {
        format!(
            "UnifiedAgent {{ max_iterations: {}, convergence_threshold: {} }}",
            self.max_iterations, self.convergence_threshold
        )
    }
}

impl Default for UnifiedAgent {
    fn default() -> Self {
        Self::new(10, 0.8)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_unified_agent() {
        let agent = UnifiedAgent::default();
        let world = World::new();

        let result = agent
            .run("ファイルを読み込んで分析してください", world)
            .unwrap();

        assert!(result.iterations > 0);
        assert!(result.final_world.version > 0);
    }
}
