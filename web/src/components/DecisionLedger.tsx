import React from 'react';
import { DecisionLedgerEntry } from '../types/decisionLedger';

interface DecisionLedgerProps {
  entries: DecisionLedgerEntry[];
  onExport?: () => void;
}

export const DecisionLedger: React.FC<DecisionLedgerProps> = ({ entries, onExport }) => {
  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* ヘッダー */}
      <div className="border-b px-4 py-3 bg-gray-50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-700">📋 決定レジャー</h3>
          <p className="text-xs text-gray-500 mt-1">
            全ての意思決定を自動記録（監査証跡）
          </p>
        </div>
        {onExport && (
          <button
            onClick={onExport}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            📥 エクスポート
          </button>
        )}
      </div>

      {/* エントリリスト */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {entries.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-8">
            まだ決定が記録されていません
          </div>
        )}

        {entries.map((entry) => (
          <div
            key={entry.commitId}
            className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
          >
            {/* ヘッダー行 */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-500">
                  {entry.commitId}
                </span>
                <span className="text-xs text-gray-400">
                  {formatTimestamp(entry.timestamp)}
                </span>
              </div>
              {entry.confidence !== undefined && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${
                    entry.confidence >= 0.8
                      ? 'bg-green-100 text-green-700'
                      : entry.confidence >= 0.5
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  信頼度: {(entry.confidence * 100).toFixed(0)}%
                </span>
              )}
            </div>

            {/* 目的 */}
            <div className="mb-2">
              <span className="text-xs font-semibold text-gray-600">目的:</span>{' '}
              <span className="text-sm text-gray-800">{entry.purpose}</span>
            </div>

            {/* 選択内容 */}
            <div className="mb-2">
              <span className="text-xs font-semibold text-gray-600">選択:</span>{' '}
              <span className="text-sm text-gray-800">{entry.selectedOption}</span>
            </div>

            {/* 理由 */}
            <div className="mb-2">
              <span className="text-xs font-semibold text-gray-600">理由:</span>{' '}
              <span className="text-sm text-gray-700">{entry.rationale}</span>
            </div>

            {/* 承認者 */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>
                <span className="font-semibold">承認者:</span> {entry.approver}
              </span>
              <span>
                <span className="font-semibold">影響:</span> {entry.impactSummary}
              </span>
            </div>

            {/* 撤回条件（あれば） */}
            {entry.rollbackCondition && (
              <div className="mt-2 text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded px-2 py-1">
                <span className="font-semibold">撤回条件:</span> {entry.rollbackCondition}
              </div>
            )}

            {/* 命中ルール */}
            {entry.rulesMatched && entry.rulesMatched.length > 0 && (
              <div className="mt-2 flex items-center space-x-1">
                <span className="text-xs text-gray-500 font-semibold">ルール:</span>
                {entry.rulesMatched.map((ruleId) => (
                  <span
                    key={ruleId}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
                  >
                    {ruleId}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
