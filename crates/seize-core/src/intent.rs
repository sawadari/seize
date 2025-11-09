//! # 意図解決 (Intent Resolution) - ℐ
//!
//! ユーザーの曖昧な入力から明確な目標へ変換する

use serde::{Deserialize, Serialize};

/// 解決された目標
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Goal {
    /// 目標の明確な記述
    pub description: String,

    /// 本質的な問い (Step-Back Question)
    pub essential_question: String,

    /// 目標のカテゴリ
    pub category: GoalCategory,

    /// 優先度
    pub priority: Priority,

    /// 制約条件
    pub constraints: Vec<String>,
}

/// 目標のカテゴリ
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum GoalCategory {
    /// 情報収集・理解
    Understanding,
    /// コード生成・修正
    CodeGeneration,
    /// システム設計
    SystemDesign,
    /// 組織運営
    OrganizationalManagement,
    /// 意思決定支援
    DecisionSupport,
}

/// 優先度
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, PartialOrd, Ord)]
pub enum Priority {
    Low,
    Medium,
    High,
    Critical,
}

/// 意図解決器
pub struct IntentResolver {
    /// 憲章の原則に基づく検証フラグ
    enforce_charter: bool,
}

impl IntentResolver {
    /// 新しい意図解決器を作成
    pub fn new(enforce_charter: bool) -> Self {
        Self { enforce_charter }
    }

    /// 入力から目標を解決
    ///
    /// ## Step-Back Question
    /// より本質的な問いを生成し、表面的な要求から本当の目的を引き出す
    pub fn resolve(&self, input: &str) -> anyhow::Result<Goal> {
        // Step 1: 入力の解析
        let description = input.trim().to_string();

        // Step 2: Step-Back Questionの生成
        let essential_question = self.generate_step_back_question(&description);

        // Step 3: カテゴリの推定
        let category = self.infer_category(&description);

        // Step 4: 優先度の決定
        let priority = self.determine_priority(&description);

        // Step 5: 制約の抽出
        let constraints = self.extract_constraints(&description);

        // Step 6: 憲章に基づく検証
        if self.enforce_charter {
            self.validate_against_charter(&description)?;
        }

        Ok(Goal {
            description,
            essential_question,
            category,
            priority,
            constraints,
        })
    }

    /// Step-Back Questionを生成
    ///
    /// 例:
    /// - "ファイルを読み込んで" → "どのような情報を得たいのか?"
    /// - "コードを修正して" → "何を実現したいのか?"
    fn generate_step_back_question(&self, input: &str) -> String {
        // 簡易実装: より高度なNLP処理が可能
        if input.contains("読み込") || input.contains("取得") {
            "どのような情報を得て、何を実現したいのか?".to_string()
        } else if input.contains("修正") || input.contains("変更") {
            "この変更によって何を達成したいのか?".to_string()
        } else if input.contains("作成") || input.contains("生成") {
            "なぜこれが必要で、どのような価値を生むのか?".to_string()
        } else {
            "この要求の本質的な目的は何か?".to_string()
        }
    }

    /// カテゴリを推定
    fn infer_category(&self, input: &str) -> GoalCategory {
        if input.contains("理解") || input.contains("調査") || input.contains("確認") {
            GoalCategory::Understanding
        } else if input.contains("コード") || input.contains("実装") || input.contains("修正") {
            GoalCategory::CodeGeneration
        } else if input.contains("設計") || input.contains("アーキテクチャ") {
            GoalCategory::SystemDesign
        } else if input.contains("組織") || input.contains("運営") {
            GoalCategory::OrganizationalManagement
        } else if input.contains("判断") || input.contains("決定") {
            GoalCategory::DecisionSupport
        } else {
            GoalCategory::Understanding
        }
    }

    /// 優先度を決定
    fn determine_priority(&self, input: &str) -> Priority {
        if input.contains("緊急") || input.contains("至急") {
            Priority::Critical
        } else if input.contains("重要") || input.contains("優先") {
            Priority::High
        } else if input.contains("後で") || input.contains("余裕") {
            Priority::Low
        } else {
            Priority::Medium
        }
    }

    /// 制約を抽出
    fn extract_constraints(&self, input: &str) -> Vec<String> {
        let mut constraints = Vec::new();

        // 簡易実装: パターンマッチング
        if input.contains("安全") {
            constraints.push("安全性を確保すること".to_string());
        }
        if input.contains("説明") {
            constraints.push("説明可能性を維持すること".to_string());
        }
        if input.contains("記録") {
            constraints.push("プロセスを記録すること".to_string());
        }

        constraints
    }

    /// 憲章に基づく検証
    fn validate_against_charter(&self, input: &str) -> anyhow::Result<()> {
        // 禁止パターンのチェック
        if input.contains("自動判断") && !input.contains("人間") {
            anyhow::bail!("憲章違反: 最終判断は人間が行う必要があります");
        }

        if input.contains("データ収集") && !input.contains("最小限") {
            tracing::warn!("警告: 必要最小限のデータ収集を推奨します");
        }

        Ok(())
    }
}

impl Default for IntentResolver {
    fn default() -> Self {
        Self::new(true)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_intent_resolution() {
        let resolver = IntentResolver::default();
        let goal = resolver.resolve("ファイルを読み込んで内容を確認したい").unwrap();

        assert_eq!(goal.category, GoalCategory::Understanding);
        assert!(!goal.essential_question.is_empty());
    }
}
