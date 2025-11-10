import React from 'react';
import { Purpose } from '../types/purpose';

interface PurposeBannerProps {
  purpose: Purpose;
  onPurposeChange: (purpose: Purpose) => void;
}

export const PurposeBanner: React.FC<PurposeBannerProps> = ({ purpose, onPurposeChange }) => {
  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPurposeChange({ ...purpose, goal: e.target.value });
  };

  const handleScopeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPurposeChange({ ...purpose, scope: e.target.value });
  };

  const handleModeToggle = () => {
    const newMode = purpose.mode === 'safe' ? 'power' : 'safe';
    onPurposeChange({ ...purpose, mode: newMode });
  };

  const isPurposeSet = purpose.goal.trim().length > 0 && purpose.scope.trim().length > 0;

  return (
    <div className="border-b bg-blue-50 shadow-sm">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* 左側: 目的入力 */}
          <div className="flex items-center space-x-4 flex-1">
            <span className="text-2xl">🎯</span>
            <div className="flex items-center space-x-2 flex-1">
              <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                目的:
              </label>
              <input
                type="text"
                value={purpose.goal}
                onChange={handleGoalChange}
                placeholder="例: カート放棄率を15%削減"
                className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                範囲:
              </label>
              <input
                type="text"
                value={purpose.scope}
                onChange={handleScopeChange}
                placeholder="例: 認証機能"
                className="w-40 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 右側: モード切替 */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-gray-700">モード:</span>
            <button
              onClick={handleModeToggle}
              className={`px-4 py-1 text-xs font-medium rounded transition-colors ${
                purpose.mode === 'safe'
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              {purpose.mode === 'safe' ? '🛡️ 安全' : '⚡ パワー'}
            </button>
          </div>
        </div>

        {/* 目的未設定の警告 */}
        {!isPurposeSet && (
          <div className="mt-2 text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded px-3 py-2">
            ⚠️ この編集の目的を設定してください。目的がない変更は承認できません。
          </div>
        )}
      </div>
    </div>
  );
};
