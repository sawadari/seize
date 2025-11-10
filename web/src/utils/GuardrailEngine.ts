import { GuardrailRule, GuardrailEvaluation } from '../types/guardrail';
import { KnowledgeNodeType } from '../types/knowledgeGraph';

/**
 * 初期ルールセット（6ルール）
 */
export const DEFAULT_GUARDRAIL_RULES: GuardrailRule[] = [
  {
    ruleId: 'R001',
    name: '要求→機能は許可',
    pattern: { sourceType: 'requirement', targetType: 'feature' },
    verdict: 'allowed',
    edgeColor: '#3B82F6',
    approvalRequirement: { approverCount: 1, reasonRequired: false },
    rationale: 'ISO/IEC/IEEE 29148準拠の標準的なトレーサビリティパターン',
    references: ['ISO/IEC/IEEE 29148:2018 Section 5.2.6'],
  },
  {
    ruleId: 'R002',
    name: 'テスト→機能は許可',
    pattern: { sourceType: 'test', targetType: 'feature' },
    verdict: 'allowed',
    edgeColor: '#3B82F6',
    approvalRequirement: { approverCount: 1, reasonRequired: false },
    rationale: '機能の品質保証を確立するための標準パターン',
  },
  {
    ruleId: 'R003',
    name: 'テスト→要求は許可',
    pattern: { sourceType: 'test', targetType: 'requirement' },
    verdict: 'allowed',
    edgeColor: '#3B82F6',
    approvalRequirement: { approverCount: 1, reasonRequired: false },
    rationale: '要求の受入基準（Given-When-Then）を検証',
  },
  {
    ruleId: 'R004',
    name: '要求→テストは警告',
    pattern: { sourceType: 'requirement', targetType: 'test' },
    verdict: 'warning',
    edgeColor: '#EAB308',
    approvalRequirement: { approverCount: 1, reasonRequired: true },
    rationale: 'テスト→要求の方向が一般的だが、要求からテストへの参照も有効',
  },
  {
    ruleId: 'R005',
    name: '機能→要求は禁止',
    pattern: { sourceType: 'feature', targetType: 'requirement' },
    verdict: 'forbidden',
    edgeColor: '#EF4444',
    approvalRequirement: { approverCount: 2, reasonRequired: true, powerModeOnly: true },
    rationale: '逆方向接続はトレーサビリティが逆転するため原則禁止',
  },
  {
    ruleId: 'R006',
    name: '機能→テストは禁止',
    pattern: { sourceType: 'feature', targetType: 'test' },
    verdict: 'forbidden',
    edgeColor: '#EF4444',
    approvalRequirement: { approverCount: 2, reasonRequired: true, powerModeOnly: true },
    rationale: 'テストが機能に依存する形は推奨されない',
  },
];

/**
 * ガードレールエンジン
 */
export class GuardrailEngine {
  private rules: GuardrailRule[];

  constructor(rules: GuardrailRule[] = DEFAULT_GUARDRAIL_RULES) {
    this.rules = rules;
  }

  /**
   * エッジ接続を評価
   */
  evaluate(
    sourceType: KnowledgeNodeType,
    targetType: KnowledgeNodeType,
    sourceLabel: string,
    targetLabel: string
  ): GuardrailEvaluation {
    // ルールにマッチするか確認
    const matchedRule = this.rules.find(
      (rule) =>
        (rule.pattern.sourceType === '*' || rule.pattern.sourceType === sourceType) &&
        (rule.pattern.targetType === '*' || rule.pattern.targetType === targetType)
    );

    if (!matchedRule) {
      // デフォルト: 許可（新しいパターン）
      return {
        verdict: 'allowed',
        matchedRule: {
          ruleId: 'R000',
          name: 'デフォルト許可',
          pattern: { sourceType: '*', targetType: '*' },
          verdict: 'allowed',
          edgeColor: '#3B82F6',
          approvalRequirement: { approverCount: 1, reasonRequired: false },
          rationale: '未定義パターンは許可',
        },
        edgeColor: '#3B82F6',
        message: this.generateMessage('allowed', sourceLabel, targetLabel, sourceType, targetType),
        approvalRequired: true,
        reasonRequired: false,
      };
    }

    return {
      verdict: matchedRule.verdict,
      matchedRule,
      edgeColor: matchedRule.edgeColor,
      message: this.generateMessage(
        matchedRule.verdict,
        sourceLabel,
        targetLabel,
        sourceType,
        targetType,
        matchedRule
      ),
      approvalRequired: true,
      reasonRequired: matchedRule.approvalRequirement.reasonRequired,
    };
  }

  /**
   * メッセージ生成
   */
  private generateMessage(
    verdict: 'allowed' | 'warning' | 'forbidden',
    sourceLabel: string,
    targetLabel: string,
    sourceType: KnowledgeNodeType,
    targetType: KnowledgeNodeType,
    rule?: GuardrailRule
  ): string {
    const connection = `${sourceLabel} → ${targetLabel}`;

    if (verdict === 'allowed') {
      if (sourceType === 'requirement' && targetType === 'feature') {
        return `✅ 適切な接続です: 要求「${sourceLabel}」が機能「${targetLabel}」で実装されます。トレーサビリティが確立されました。`;
      }
      if (sourceType === 'test' && targetType === 'feature') {
        return `✅ 適切な接続です: テスト「${sourceLabel}」が機能「${targetLabel}」を検証します。品質保証が強化されました。`;
      }
      if (sourceType === 'test' && targetType === 'requirement') {
        return `✅ 適切な接続です: テスト「${sourceLabel}」が要求「${targetLabel}」を検証します。受入基準が明確になりました。`;
      }
      return `✅ 新しい接続: ${connection}`;
    }

    if (verdict === 'warning') {
      if (sourceType === 'requirement' && targetType === 'test') {
        return `⚠️ 警告: テスト → 要求の方向が一般的です。ただし、要求「${sourceLabel}」からテスト「${targetLabel}」への参照も有効です。承認理由を記録してください。`;
      }
      return `⚠️ 警告: ${connection}。${rule?.rationale || '承認理由を記録してください。'}`;
    }

    // forbidden
    if (sourceType === 'feature' && targetType === 'requirement') {
      return `🚫 禁止: 機能 → 要求の逆方向接続です。通常は要求 → 機能の方向です。パワーユーザーモードで承認者2名の承認が必要です。`;
    }
    if (sourceType === 'feature' && targetType === 'test') {
      return `🚫 禁止: 機能 → テストの逆方向接続です。テストが機能に依存する形は推奨されません。パワーユーザーモードで承認者2名の承認が必要です。`;
    }
    return `🚫 禁止: ${connection}。${rule?.rationale || 'パワーユーザーモードが必要です。'}`;
  }

  /**
   * ルール一覧を取得
   */
  getRules(): GuardrailRule[] {
    return this.rules;
  }

  /**
   * ルールIDでルールを取得
   */
  getRuleById(ruleId: string): GuardrailRule | undefined {
    return this.rules.find((rule) => rule.ruleId === ruleId);
  }
}

/**
 * シングルトンインスタンス
 */
export const guardrailEngine = new GuardrailEngine();
