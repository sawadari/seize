import React, { useState } from 'react';

interface ApprovalDialogProps {
  message: string;
  onApprove: (data: ApprovalData) => void;
  onReject: () => void;
}

export interface ApprovalData {
  rationale: string;            // 承認理由（必須）
  rationaleType: string;        // 理由の種別
  reference?: string;           // 参照（Issue/規格/設計票）
  rollbackCondition?: string;   // 撤回条件
  purposeAlignment: boolean;    // 目的との整合（必須チェック）
}

export const ApprovalDialog: React.FC<ApprovalDialogProps> = ({
  message,
  onApprove,
  onReject,
}) => {
  const [rationale, setRationale] = useState('');
  const [rationaleType, setRationaleType] = useState<string>('standard_compliance');
  const [reference, setReference] = useState('');
  const [rollbackCondition, setRollbackCondition] = useState('');
  const [purposeAlignment, setPurposeAlignment] = useState(false);

  const rationaleTypes = [
    { value: 'standard_compliance', label: '規格準拠（ISO/IEC/IEEE等）' },
    { value: 'minimal_impact', label: '影響最小化' },
    { value: 'schedule_priority', label: '納期優先' },
    { value: 'quality_priority', label: '品質優先' },
    { value: 'security_priority', label: 'セキュリティ優先' },
    { value: 'other', label: 'その他' },
  ];

  const isValid =
    rationale.trim().length >= 10 && // 最小10文字
    purposeAlignment; // 目的整合の確認必須

  const handleApprove = () => {
    if (!isValid) return;

    onApprove({
      rationale: rationale.trim(),
      rationaleType,
      reference: reference.trim() || undefined,
      rollbackCondition: rollbackCondition.trim() || undefined,
      purposeAlignment,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="border-b px-6 py-4 bg-blue-50">
          <h2 className="text-lg font-bold text-gray-900">
            この判断に署名します（承認）
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            この決定の理由と撤回条件を記録します。監査時に第三者がこの判断を理解できるように記述してください。
          </p>
        </div>

        {/* メッセージ */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="text-sm text-gray-800">{message}</div>
        </div>

        {/* フォーム */}
        <div className="px-6 py-4 space-y-4">
          {/* 理由の種別 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              理由の種別（必須）
            </label>
            <select
              value={rationaleType}
              onChange={(e) => setRationaleType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {rationaleTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* 承認理由 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              承認理由（必須、最小10文字）
            </label>
            <textarea
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="例: ISO/IEC/IEEE 29148:2018 Section 5.2.6に準拠したトレーサビリティを確立するため"
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="text-xs text-gray-500 mt-1">
              {rationale.length}/10文字以上
            </div>
          </div>

          {/* 参照 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              参照（任意）
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="例: Issue #123, ISO/IEC 29148:2018, 設計書 v2.0"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-xs text-gray-500 mt-1">
              Issue番号、規格、設計書などへの参照
            </div>
          </div>

          {/* 撤回条件 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              撤回条件（任意）
            </label>
            <textarea
              value={rollbackCondition}
              onChange={(e) => setRollbackCondition(e.target.value)}
              placeholder="例: テストカバレッジが80%未満になった場合、または要求仕様が変更された場合"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-xs text-gray-500 mt-1">
              どのような場合にこの決定を取り消すべきか
            </div>
          </div>

          {/* 目的との整合確認 */}
          <div className="border-t pt-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={purposeAlignment}
                onChange={(e) => setPurposeAlignment(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="text-sm font-semibold text-gray-900">
                  この決定は設定された目的と整合しています（必須）
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  目的バナーで設定した目的・範囲と矛盾しないことを確認してください。
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* アクション */}
        <div className="border-t px-6 py-4 bg-gray-50 flex items-center justify-end space-x-3">
          <button
            onClick={onReject}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            ✗ キャンセル
          </button>
          <button
            onClick={handleApprove}
            disabled={!isValid}
            className={`px-6 py-2 text-sm font-medium text-white rounded transition-colors ${
              isValid
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            ✓ 署名して承認
          </button>
        </div>

        {/* 無効理由 */}
        {!isValid && (
          <div className="px-6 pb-4">
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {rationale.length < 10 && '・承認理由を10文字以上入力してください'}
              {rationale.length >= 10 && !purposeAlignment && '・目的との整合を確認してください'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
