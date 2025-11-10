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
    name: '機能→要求は警告（自動正規化可能）',
    pattern: { sourceType: 'feature', targetType: 'requirement' },
    verdict: 'warning',
    edgeColor: '#EAB308',
    approvalRequirement: { approverCount: 1, reasonRequired: true },
    rationale: '逆方向接続です。要求→機能の方向に自動正規化を推奨します',
  },
  {
    ruleId: 'R006',
    name: '機能→テストは警告（自動正規化可能）',
    pattern: { sourceType: 'feature', targetType: 'test' },
    verdict: 'warning',
    edgeColor: '#EAB308',
    approvalRequirement: { approverCount: 1, reasonRequired: true },
    rationale: '逆方向接続です。テスト→機能の方向に自動正規化を推奨します',
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
   * エッジ接続を評価（正規化提案付き）
   */
  evaluate(
    sourceType: KnowledgeNodeType,
    targetType: KnowledgeNodeType,
    sourceLabel: string,
    targetLabel: string,
    sourceId?: string,
    targetId?: string
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

    // 正規化提案（逆向きエッジの場合）
    const normalization = this.checkNormalization(
      sourceType,
      targetType,
      sourceId || sourceLabel,
      targetId || targetLabel
    );

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
        matchedRule,
        normalization
      ),
      approvalRequired: true,
      reasonRequired: matchedRule.approvalRequirement.reasonRequired,
      normalization,
    };
  }

  /**
   * 正規化チェック（逆向きエッジの検出）
   */
  private checkNormalization(
    sourceType: KnowledgeNodeType,
    targetType: KnowledgeNodeType,
    sourceId: string,
    targetId: string
  ) {
    // 機能→要求 → 要求→機能に正規化
    if (sourceType === 'feature' && targetType === 'requirement') {
      return {
        canNormalize: true,
        normalizedSource: targetId,
        normalizedTarget: sourceId,
        reason: '要求→機能の標準的な方向に自動正規化します',
      };
    }

    // 機能→テスト → テスト→機能に正規化
    if (sourceType === 'feature' && targetType === 'test') {
      return {
        canNormalize: true,
        normalizedSource: targetId,
        normalizedTarget: sourceId,
        reason: 'テスト→機能の標準的な方向に自動正規化します',
      };
    }

    return undefined;
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
    rule?: GuardrailRule,
    normalization?: { canNormalize: boolean; reason: string }
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

    // forbidden (変更: 正規化提案を含める)
    if (normalization?.canNormalize) {
      return `⚠️ 逆方向接続: ${connection}。${normalization.reason}。「正規化して続行」を選択すると、自動的に標準方向に変換されます。`;
    }
    return `⚠️ 警告: ${connection}。${rule?.rationale || '承認理由を記録してください。'}`;
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
