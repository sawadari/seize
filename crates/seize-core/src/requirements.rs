//! # 要求工学モジュール (Requirements Engineering)
//!
//! システムズエンジニアリングおよび要求工学の原則に基づいた
//! 要求の開発・管理・検証を行うモジュール

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// 要求（Requirement）
///
/// ## ISO/IEC/IEEE 29148準拠
/// - 機能要求（Functional Requirements）
/// - 非機能要求（Non-Functional Requirements）
/// - 制約（Constraints）
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Requirement {
    /// 要求ID（例: REQ-001, FR-001, NFR-001）
    pub id: String,

    /// 要求の種類
    pub req_type: RequirementType,

    /// 要求の記述（明確・検証可能・完全・一貫性・実現可能）
    pub description: String,

    /// 優先度（MoSCoW法）
    pub priority: RequirementPriority,

    /// ステークホルダー
    pub stakeholders: Vec<String>,

    /// 受入基準（Acceptance Criteria）
    pub acceptance_criteria: Vec<AcceptanceCriterion>,

    /// トレーサビリティ（上位要求・下位要求）
    pub traceability: Traceability,

    /// 検証方法
    pub verification_method: VerificationMethod,

    /// ステータス
    pub status: RequirementStatus,

    /// メタデータ
    pub metadata: HashMap<String, String>,
}

/// 要求の種類
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum RequirementType {
    /// 機能要求 (Functional Requirement)
    Functional,

    /// 非機能要求 (Non-Functional Requirement)
    NonFunctional {
        category: NonFunctionalCategory,
    },

    /// システム要求 (System Requirement)
    System,

    /// ビジネス要求 (Business Requirement)
    Business,

    /// ユーザー要求 (User Requirement)
    User,

    /// 制約 (Constraint)
    Constraint,

    /// インターフェース要求 (Interface Requirement)
    Interface,
}

/// 非機能要求のカテゴリ
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum NonFunctionalCategory {
    /// パフォーマンス
    Performance,
    /// セキュリティ
    Security,
    /// 信頼性
    Reliability,
    /// 可用性
    Availability,
    /// 保守性
    Maintainability,
    /// スケーラビリティ
    Scalability,
    /// ユーザビリティ
    Usability,
}

/// 要求の優先度（MoSCoW法）
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, PartialOrd, Ord)]
pub enum RequirementPriority {
    /// Must have - 必須
    Must,
    /// Should have - 重要
    Should,
    /// Could have - 可能なら
    Could,
    /// Won't have (this time) - 今回は対象外
    Wont,
}

/// 受入基準
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AcceptanceCriterion {
    /// Given-When-Then形式
    pub given: String,
    pub when: String,
    pub then: String,

    /// 検証可能性
    pub measurable: bool,
}

/// トレーサビリティ
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Traceability {
    /// 上位要求（親要求）
    pub parent_requirements: Vec<String>,

    /// 下位要求（子要求）
    pub child_requirements: Vec<String>,

    /// 関連要求
    pub related_requirements: Vec<String>,

    /// 設計要素へのトレース
    pub design_elements: Vec<String>,

    /// テストケースへのトレース
    pub test_cases: Vec<String>,
}

/// 検証方法（Verification Method）
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum VerificationMethod {
    /// 検査（Inspection）
    Inspection,
    /// 分析（Analysis）
    Analysis,
    /// デモンストレーション（Demonstration）
    Demonstration,
    /// テスト（Test）
    Test,
}

/// 要求のステータス
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum RequirementStatus {
    /// 提案中
    Proposed,
    /// 承認済み
    Approved,
    /// 実装中
    InProgress,
    /// 検証中
    Verified,
    /// 完了
    Completed,
    /// 却下
    Rejected,
    /// 延期
    Deferred,
}

/// 要求仕様書（Requirements Specification）
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RequirementsSpecification {
    /// プロジェクト名
    pub project_name: String,

    /// バージョン
    pub version: String,

    /// 要求のリスト
    pub requirements: Vec<Requirement>,

    /// ステークホルダー分析
    pub stakeholder_analysis: StakeholderAnalysis,

    /// システム境界
    pub system_boundary: SystemBoundary,

    /// 用語集
    pub glossary: HashMap<String, String>,
}

/// ステークホルダー分析
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StakeholderAnalysis {
    /// ステークホルダーのリスト
    pub stakeholders: Vec<Stakeholder>,
}

/// ステークホルダー
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Stakeholder {
    pub name: String,
    pub role: String,
    pub interests: Vec<String>,
    pub influence: InfluenceLevel,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum InfluenceLevel {
    High,
    Medium,
    Low,
}

/// システム境界
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemBoundary {
    /// システム内の要素
    pub in_scope: Vec<String>,

    /// システム外の要素
    pub out_of_scope: Vec<String>,

    /// 外部インターフェース
    pub external_interfaces: Vec<String>,
}

/// 要求エンジニア（Requirements Engineer）
pub struct RequirementsEngineer {
    /// 現在の要求仕様書
    specification: RequirementsSpecification,

    /// 組織憲章準拠フラグ
    enforce_charter: bool,
}

impl RequirementsEngineer {
    /// 新しい要求エンジニアを作成
    pub fn new(project_name: String, enforce_charter: bool) -> Self {
        Self {
            specification: RequirementsSpecification {
                project_name,
                version: "1.0.0".to_string(),
                requirements: Vec::new(),
                stakeholder_analysis: StakeholderAnalysis {
                    stakeholders: Vec::new(),
                },
                system_boundary: SystemBoundary {
                    in_scope: Vec::new(),
                    out_of_scope: Vec::new(),
                    external_interfaces: Vec::new(),
                },
                glossary: HashMap::new(),
            },
            enforce_charter,
        }
    }

    /// 要求を抽出（Elicitation）
    ///
    /// ## 技法
    /// - インタビュー
    /// - ワークショップ
    /// - プロトタイピング
    /// - 観察
    /// - ドキュメント分析
    pub fn elicit_requirements(
        &mut self,
        input: &str,
        stakeholder: &str,
    ) -> anyhow::Result<Vec<Requirement>> {
        tracing::info!("要求抽出開始: ステークホルダー={}", stakeholder);

        // 自然言語から要求を抽出（簡易実装）
        let requirements = self.extract_requirements_from_text(input, stakeholder)?;

        tracing::info!("{}個の要求を抽出しました", requirements.len());

        Ok(requirements)
    }

    /// 要求を分析（Analysis）
    ///
    /// ## チェック項目
    /// - 明確性（Clear）
    /// - 検証可能性（Verifiable）
    /// - 完全性（Complete）
    /// - 一貫性（Consistent）
    /// - 実現可能性（Feasible）
    pub fn analyze_requirement(&self, requirement: &Requirement) -> anyhow::Result<AnalysisResult> {
        let mut issues = Vec::new();

        // 明確性チェック
        if requirement.description.len() < 10 {
            issues.push("要求の記述が短すぎます（明確性）".to_string());
        }

        // 検証可能性チェック
        if requirement.acceptance_criteria.is_empty() {
            issues.push("受入基準が定義されていません（検証可能性）".to_string());
        }

        // 一貫性チェック（親要求との整合性）
        if !requirement.traceability.parent_requirements.is_empty() {
            // 親要求との整合性を確認
            // （実際の実装では親要求を取得して比較）
        }

        // 憲章準拠チェック
        if self.enforce_charter {
            self.validate_against_charter(requirement, &mut issues)?;
        }

        Ok(AnalysisResult {
            requirement_id: requirement.id.clone(),
            is_valid: issues.is_empty(),
            issues,
            recommendations: self.generate_recommendations(requirement),
        })
    }

    /// 要求を仕様化（Specification）
    pub fn add_requirement(&mut self, requirement: Requirement) -> anyhow::Result<()> {
        // 分析実行
        let analysis = self.analyze_requirement(&requirement)?;

        if !analysis.is_valid {
            tracing::warn!("要求 {} に問題があります: {:?}", requirement.id, analysis.issues);
        }

        // 要求を追加
        self.specification.requirements.push(requirement);

        Ok(())
    }

    /// 要求を検証（Validation）
    ///
    /// ## 質問
    /// - 正しいシステムを作っているか？
    /// - ステークホルダーのニーズを満たしているか？
    pub fn validate_requirements(&self) -> anyhow::Result<ValidationReport> {
        let mut report = ValidationReport {
            total_requirements: self.specification.requirements.len(),
            valid_requirements: 0,
            issues: Vec::new(),
        };

        for req in &self.specification.requirements {
            let analysis = self.analyze_requirement(req)?;
            if analysis.is_valid {
                report.valid_requirements += 1;
            } else {
                report.issues.extend(analysis.issues);
            }
        }

        Ok(report)
    }

    /// 要求のトレーサビリティ分析
    pub fn analyze_traceability(&self) -> TraceabilityMatrix {
        let mut matrix = TraceabilityMatrix {
            requirements: HashMap::new(),
        };

        for req in &self.specification.requirements {
            let entry = TraceabilityEntry {
                requirement_id: req.id.clone(),
                parent_ids: req.traceability.parent_requirements.clone(),
                child_ids: req.traceability.child_requirements.clone(),
                test_case_ids: req.traceability.test_cases.clone(),
            };
            matrix.requirements.insert(req.id.clone(), entry);
        }

        matrix
    }

    /// 要求仕様書をエクスポート
    pub fn export_specification(&self) -> &RequirementsSpecification {
        &self.specification
    }

    // === プライベートメソッド ===

    fn extract_requirements_from_text(
        &self,
        text: &str,
        stakeholder: &str,
    ) -> anyhow::Result<Vec<Requirement>> {
        let mut requirements = Vec::new();

        // 簡易実装: "〜する必要がある"などのパターンで要求を抽出
        let sentences: Vec<&str> = text.split('。').collect();

        for (i, sentence) in sentences.iter().enumerate() {
            if sentence.contains("必要") || sentence.contains("べき") || sentence.contains("する") {
                let req = Requirement {
                    id: format!("REQ-{:03}", i + 1),
                    req_type: RequirementType::User,
                    description: sentence.trim().to_string(),
                    priority: RequirementPriority::Should,
                    stakeholders: vec![stakeholder.to_string()],
                    acceptance_criteria: Vec::new(),
                    traceability: Traceability::default(),
                    verification_method: VerificationMethod::Test,
                    status: RequirementStatus::Proposed,
                    metadata: HashMap::new(),
                };
                requirements.push(req);
            }
        }

        Ok(requirements)
    }

    fn validate_against_charter(
        &self,
        requirement: &Requirement,
        issues: &mut Vec<String>,
    ) -> anyhow::Result<()> {
        // 組織憲章に基づく検証
        let desc_lower = requirement.description.to_lowercase();

        // AI自動判断の禁止チェック
        if desc_lower.contains("自動判断") && !desc_lower.contains("人間") {
            issues.push("憲章違反: 自動判断には人間の承認が必要です".to_string());
        }

        // データ最小化原則
        if desc_lower.contains("すべてのデータ") || desc_lower.contains("全データ") {
            issues.push("憲章推奨: 必要最小限のデータ収集を検討してください".to_string());
        }

        // 説明可能性
        if requirement.req_type == RequirementType::NonFunctional {
            if let RequirementType::NonFunctional { category } = &requirement.req_type {
                if *category == NonFunctionalCategory::Security {
                    if requirement.acceptance_criteria.is_empty() {
                        issues.push("セキュリティ要求には明確な受入基準が必要です".to_string());
                    }
                }
            }
        }

        Ok(())
    }

    fn generate_recommendations(&self, requirement: &Requirement) -> Vec<String> {
        let mut recommendations = Vec::new();

        if requirement.acceptance_criteria.is_empty() {
            recommendations.push("Given-When-Then形式の受入基準を追加してください".to_string());
        }

        if requirement.traceability.parent_requirements.is_empty()
            && requirement.req_type != RequirementType::Business
        {
            recommendations.push("上位要求とのトレーサビリティを確立してください".to_string());
        }

        if requirement.stakeholders.is_empty() {
            recommendations.push("ステークホルダーを明記してください".to_string());
        }

        recommendations
    }
}

/// 分析結果
#[derive(Debug, Clone)]
pub struct AnalysisResult {
    pub requirement_id: String,
    pub is_valid: bool,
    pub issues: Vec<String>,
    pub recommendations: Vec<String>,
}

/// 検証レポート
#[derive(Debug, Clone)]
pub struct ValidationReport {
    pub total_requirements: usize,
    pub valid_requirements: usize,
    pub issues: Vec<String>,
}

/// トレーサビリティマトリクス
#[derive(Debug, Clone)]
pub struct TraceabilityMatrix {
    pub requirements: HashMap<String, TraceabilityEntry>,
}

#[derive(Debug, Clone)]
pub struct TraceabilityEntry {
    pub requirement_id: String,
    pub parent_ids: Vec<String>,
    pub child_ids: Vec<String>,
    pub test_case_ids: Vec<String>,
}

impl Default for Traceability {
    fn default() -> Self {
        Self {
            parent_requirements: Vec::new(),
            child_requirements: Vec::new(),
            related_requirements: Vec::new(),
            design_elements: Vec::new(),
            test_cases: Vec::new(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_requirements_elicitation() {
        let mut engineer = RequirementsEngineer::new("Test Project".to_string(), true);
        let input = "システムはユーザー認証機能を提供する必要がある。パフォーマンスは1秒以内であるべき。";

        let requirements = engineer.elicit_requirements(input, "Product Owner").unwrap();

        assert!(!requirements.is_empty());
        assert_eq!(requirements[0].stakeholders[0], "Product Owner");
    }

    #[test]
    fn test_requirement_analysis() {
        let engineer = RequirementsEngineer::new("Test Project".to_string(), true);
        let mut req = Requirement {
            id: "REQ-001".to_string(),
            req_type: RequirementType::Functional,
            description: "ユーザー認証機能".to_string(),
            priority: RequirementPriority::Must,
            stakeholders: vec!["User".to_string()],
            acceptance_criteria: Vec::new(),
            traceability: Traceability::default(),
            verification_method: VerificationMethod::Test,
            status: RequirementStatus::Proposed,
            metadata: HashMap::new(),
        };

        let result = engineer.analyze_requirement(&req).unwrap();
        assert!(!result.is_valid); // 受入基準がないため

        // 受入基準を追加
        req.acceptance_criteria.push(AcceptanceCriterion {
            given: "ユーザーがログインフォームにアクセスした時".to_string(),
            when: "正しいユーザー名とパスワードを入力する".to_string(),
            then: "システムにログインできる".to_string(),
            measurable: true,
        });

        let result2 = engineer.analyze_requirement(&req).unwrap();
        assert!(result2.is_valid);
    }
}
