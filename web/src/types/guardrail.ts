import { KnowledgeNodeType, KnowledgeEdgeType } from './knowledgeGraph';

/**
 * ガードレールの判定結果
 */
export type GuardrailVerdict = 'allowed' | 'warning' | 'forbidden';

/**
 * ガードレールルール
 */
export interface GuardrailRule {
  ruleId: string;               // 'R001'
  name: string;                 // '要求→機能は許可'
  pattern: {
    sourceType: KnowledgeNodeType | '*';
    targetType: KnowledgeNodeType | '*';
    edgeType?: KnowledgeEdgeType;
  };
  verdict: GuardrailVerdict;
  edgeColor: string;            // '#3B82F6' | '#EAB308' | '#EF4444'
  approvalRequirement: {
    approverCount: 1 | 2;
    reasonRequired: boolean;
    powerModeOnly?: boolean;    // 禁止はパワーモードのみ作成可
  };
  rationale: string;            // ルールの根拠説明
  references?: string[];        // ISO標準などへの参照
}

/**
 * ガードレール評価結果
 */
export interface GuardrailEvaluation {
  verdict: GuardrailVerdict;
  matchedRule: GuardrailRule;
  edgeColor: string;
  message: string;              // ユーザー向けメッセージ
  approvalRequired: boolean;
  reasonRequired: boolean;
  normalization?: {             // 自動正規化の提案
    canNormalize: boolean;
    normalizedSource: string;
    normalizedTarget: string;
    reason: string;
  };
}
