import React, { useState } from 'react';
import { GuardrailEvaluation } from '../types/guardrail';

interface WhyBoxProps {
  evaluation: GuardrailEvaluation | null;
}

export const WhyBox: React.FC<WhyBoxProps> = ({ evaluation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!evaluation) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 text-gray-400 text-sm p-4 text-center">
        エッジを作成すると、AIの判断根拠がここに表示されます
      </div>
    );
  }

  const { verdict, matchedRule, message } = evaluation;

  return (
    <div className="h-full flex flex-col bg-white border-l">
      {/* ヘッダー */}
      <div className="border-b px-4 py-3 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700">🤖 根拠パネル（Why-Box）</h3>
        <p className="text-xs text-gray-500 mt-1">AIの判断根拠を確認</p>
      </div>

      {/* コンテンツ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 評価結果 */}
        <div>
          <div className="text-xs font-semibold text-gray-600 mb-2">評価結果</div>
          <div
            className={`px-3 py-2 rounded text-sm font-medium ${
              verdict === 'allowed'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : verdict === 'warning'
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {verdict === 'allowed' && '✅ 許可'}
            {verdict === 'warning' && '⚠️ 警告'}
            {verdict === 'forbidden' && '🚫 禁止'}
          </div>
        </div>

        {/* メッセージ */}
        <div>
          <div className="text-xs font-semibold text-gray-600 mb-2">メッセージ</div>
          <div className="text-sm text-gray-800 leading-relaxed">{message}</div>
        </div>

        {/* 命中ルール */}
        <div>
          <div className="text-xs font-semibold text-gray-600 mb-2">命中ルール</div>
          <div className="bg-blue-50 border border-blue-200 rounded px-3 py-2">
            <div className="text-sm font-medium text-blue-900 mb-1">
              {matchedRule.ruleId}: {matchedRule.name}
            </div>
            <div className="text-xs text-blue-700">{matchedRule.rationale}</div>
          </div>
        </div>

        {/* ISO参照（あれば） */}
        {matchedRule.references && matchedRule.references.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-2">ISO標準参照</div>
            <div className="space-y-1">
              {matchedRule.references.map((ref, index) => (
                <div
                  key={index}
                  className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                >
                  {ref}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 承認要件 */}
        <div>
          <div className="text-xs font-semibold text-gray-600 mb-2">承認要件</div>
          <div className="space-y-1 text-xs text-gray-700">
            <div>
              <span className="font-medium">承認者数:</span>{' '}
              {matchedRule.approvalRequirement.approverCount}名
            </div>
            <div>
              <span className="font-medium">理由記録:</span>{' '}
              {matchedRule.approvalRequirement.reasonRequired ? '必須' : '任意'}
            </div>
            {matchedRule.approvalRequirement.powerModeOnly && (
              <div className="text-orange-600 bg-orange-50 border border-orange-200 rounded px-2 py-1 mt-1">
                ⚡ パワーユーザーモードが必要
              </div>
            )}
          </div>
        </div>

        {/* 詳細表示（将来拡張用） */}
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {isExpanded ? '▼ 詳細を隠す' : '▶ 詳細を見る'}
          </button>

          {isExpanded && (
            <div className="mt-2 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded px-3 py-2 space-y-2">
              <div>
                <span className="font-semibold">エッジ色:</span> {matchedRule.edgeColor}
              </div>
              <div>
                <span className="font-semibold">パターン:</span>{' '}
                {matchedRule.pattern.sourceType} → {matchedRule.pattern.targetType}
              </div>
              <div className="text-xs text-gray-500 italic">
                ※ 過去類似例・信頼度根拠・カバレッジ差分は次フェーズで実装
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
