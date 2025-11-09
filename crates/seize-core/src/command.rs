//! # コマンドスタック (Command Stack) - 𝒞
//!
//! 目標を実行可能なタスクに分解
//! 𝒞 = C₃ ◦ C₂ ◦ C₁

use crate::intent::Goal;
use serde::{Deserialize, Serialize};

/// 実行計画
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExecutionPlan {
    /// 目標
    pub goal: Goal,

    /// タスクのリスト
    pub tasks: Vec<Task>,

    /// 実行戦略
    pub strategy: ExecutionStrategy,
}

/// タスク
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Task {
    /// タスクID
    pub id: String,

    /// タスクの説明
    pub description: String,

    /// タスクタイプ
    pub task_type: TaskType,

    /// 依存タスク
    pub dependencies: Vec<String>,

    /// プロンプト（実行用）
    pub prompt: String,

    /// 状態
    pub status: TaskStatus,
}

/// タスクタイプ
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TaskType {
    /// ファイル読み込み
    FileRead,
    /// ファイル書き込み
    FileWrite,
    /// コード生成
    CodeGeneration,
    /// 検証・テスト
    Validation,
    /// 分析
    Analysis,
    /// 意思決定
    Decision,
}

/// タスクステータス
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum TaskStatus {
    Pending,
    InProgress,
    Completed,
    Failed,
}

/// 実行戦略
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ExecutionStrategy {
    /// 逐次実行
    Sequential,
    /// 並列実行
    Parallel,
    /// 適応的実行（状況に応じて変更）
    Adaptive,
}

/// コマンドスタック
pub struct CommandStack;

impl CommandStack {
    /// 新しいコマンドスタックを作成
    pub fn new() -> Self {
        Self
    }

    /// 目標を実行計画に分解
    ///
    /// ## プロセス
    /// 1. C₁: 構造化 - 目標をタスクツリーに分解
    /// 2. C₂: プロンプト化 - 各タスクを実行可能なプロンプトに変換
    /// 3. C₃: 連鎖実行 - 依存関係を考慮した実行順序を決定
    pub fn decompose(&self, goal: Goal) -> anyhow::Result<ExecutionPlan> {
        // C₁: 構造化
        let task_tree = self.structure_goal(&goal)?;

        // C₂: プロンプト化
        let prompted_tasks = self.generate_prompts(task_tree)?;

        // C₃: 連鎖実行の準備
        let strategy = self.determine_strategy(&goal);

        Ok(ExecutionPlan {
            goal,
            tasks: prompted_tasks,
            strategy,
        })
    }

    /// C₁: 目標を構造化されたタスクツリーに分解
    fn structure_goal(&self, goal: &Goal) -> anyhow::Result<Vec<Task>> {
        let mut tasks = Vec::new();
        let mut task_counter = 0;

        // 目標のカテゴリに基づいてタスクを生成
        match &goal.category {
            crate::intent::GoalCategory::Understanding => {
                tasks.push(Task {
                    id: format!("task_{}", task_counter),
                    description: "情報収集".to_string(),
                    task_type: TaskType::FileRead,
                    dependencies: vec![],
                    prompt: String::new(), // C₂で生成
                    status: TaskStatus::Pending,
                });
                task_counter += 1;

                tasks.push(Task {
                    id: format!("task_{}", task_counter),
                    description: "分析・理解".to_string(),
                    task_type: TaskType::Analysis,
                    dependencies: vec!["task_0".to_string()],
                    prompt: String::new(),
                    status: TaskStatus::Pending,
                });
            }
            crate::intent::GoalCategory::CodeGeneration => {
                tasks.push(Task {
                    id: format!("task_{}", task_counter),
                    description: "既存コードの読み込み".to_string(),
                    task_type: TaskType::FileRead,
                    dependencies: vec![],
                    prompt: String::new(),
                    status: TaskStatus::Pending,
                });
                task_counter += 1;

                tasks.push(Task {
                    id: format!("task_{}", task_counter),
                    description: "コード生成".to_string(),
                    task_type: TaskType::CodeGeneration,
                    dependencies: vec!["task_0".to_string()],
                    prompt: String::new(),
                    status: TaskStatus::Pending,
                });
                task_counter += 1;

                tasks.push(Task {
                    id: format!("task_{}", task_counter),
                    description: "検証".to_string(),
                    task_type: TaskType::Validation,
                    dependencies: vec!["task_1".to_string()],
                    prompt: String::new(),
                    status: TaskStatus::Pending,
                });
            }
            crate::intent::GoalCategory::DecisionSupport => {
                tasks.push(Task {
                    id: format!("task_{}", task_counter),
                    description: "情報収集".to_string(),
                    task_type: TaskType::FileRead,
                    dependencies: vec![],
                    prompt: String::new(),
                    status: TaskStatus::Pending,
                });
                task_counter += 1;

                tasks.push(Task {
                    id: format!("task_{}", task_counter),
                    description: "選択肢の分析".to_string(),
                    task_type: TaskType::Analysis,
                    dependencies: vec!["task_0".to_string()],
                    prompt: String::new(),
                    status: TaskStatus::Pending,
                });
                task_counter += 1;

                tasks.push(Task {
                    id: format!("task_{}", task_counter),
                    description: "意思決定記録の作成".to_string(),
                    task_type: TaskType::Decision,
                    dependencies: vec!["task_1".to_string()],
                    prompt: String::new(),
                    status: TaskStatus::Pending,
                });
            }
            _ => {
                // デフォルトタスク
                tasks.push(Task {
                    id: format!("task_{}", task_counter),
                    description: goal.description.clone(),
                    task_type: TaskType::Analysis,
                    dependencies: vec![],
                    prompt: String::new(),
                    status: TaskStatus::Pending,
                });
            }
        }

        Ok(tasks)
    }

    /// C₂: タスクを実行可能なプロンプトに変換
    fn generate_prompts(&self, mut tasks: Vec<Task>) -> anyhow::Result<Vec<Task>> {
        for task in &mut tasks {
            task.prompt = match task.task_type {
                TaskType::FileRead => {
                    format!("以下のファイルを読み込んで分析してください:\n{}", task.description)
                }
                TaskType::FileWrite => {
                    format!("以下の内容でファイルを作成してください:\n{}", task.description)
                }
                TaskType::CodeGeneration => {
                    format!("以下の要件に基づいてコードを生成してください:\n{}", task.description)
                }
                TaskType::Validation => {
                    format!("以下の内容を検証してください:\n{}", task.description)
                }
                TaskType::Analysis => {
                    format!("以下について分析してください:\n{}", task.description)
                }
                TaskType::Decision => {
                    format!(
                        "以下の意思決定を記録してください（目的・入力・選択肢・根拠を含む）:\n{}",
                        task.description
                    )
                }
            };
        }

        Ok(tasks)
    }

    /// C₃: 実行戦略を決定
    fn determine_strategy(&self, goal: &Goal) -> ExecutionStrategy {
        // 優先度が高い場合は適応的実行
        if goal.priority >= crate::intent::Priority::High {
            ExecutionStrategy::Adaptive
        } else {
            ExecutionStrategy::Sequential
        }
    }
}

impl Default for CommandStack {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::intent::{Goal, GoalCategory, Priority};

    #[test]
    fn test_command_decomposition() {
        let stack = CommandStack::new();
        let goal = Goal {
            description: "コードを生成する".to_string(),
            essential_question: "何を実現したいのか?".to_string(),
            category: GoalCategory::CodeGeneration,
            priority: Priority::Medium,
            constraints: vec![],
        };

        let plan = stack.decompose(goal).unwrap();
        assert_eq!(plan.tasks.len(), 3); // Read, Generate, Validate
    }
}
