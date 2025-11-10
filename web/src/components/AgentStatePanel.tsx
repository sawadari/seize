import React from 'react';
import { useAgentStore } from '../stores/agentStore';
import { Phase } from '../types';

const getPhaseIcon = (phase: Phase): string => {
  switch (phase) {
    // 統一エージェント方程式フェーズ
    case 'ℐ':
      return '🎯';
    case '𝒞':
      return '📋';
    case 'Θ':
      return '⚡';
    // 人間中心協働フェーズ
    case 'questioning':
      return '❓';
    case 'exploring':
      return '🔍';
    case 'deciding':
      return '🤝';
    case 'learning':
      return '🌟';
    case 'idle':
      return '💤';
  }
};

const getPhaseLabel = (phase: Phase): string => {
  switch (phase) {
    // 統一エージェント方程式フェーズ
    case 'ℐ':
      return 'Intent Resolution (意図解決)';
    case '𝒞':
      return 'Command Stack (コマンドスタック)';
    case 'Θ':
      return 'World Transformation (世界変換)';
    // 人間中心協働フェーズ
    case 'questioning':
      return 'Questioning (問いかけ)';
    case 'exploring':
      return 'Exploring (情報探索)';
    case 'deciding':
      return 'Deciding (意思決定)';
    case 'learning':
      return 'Learning (学習)';
    case 'idle':
      return 'Idle (待機中)';
  }
};

const getPhaseColor = (phase: Phase): string => {
  switch (phase) {
    // 統一エージェント方程式フェーズ
    case 'ℐ':
      return 'bg-intent';
    case '𝒞':
      return 'bg-command';
    case 'Θ':
      return 'bg-transform';
    // 人間中心協働フェーズ
    case 'questioning':
      return 'bg-purple-500';
    case 'exploring':
      return 'bg-blue-500';
    case 'deciding':
      return 'bg-green-500';
    case 'learning':
      return 'bg-yellow-500';
    case 'idle':
      return 'bg-gray-400';
  }
};

export const AgentStatePanel: React.FC = () => {
  const {
    currentPhase,
    iteration,
    maxIterations,
    convergenceRate,
    worldVersion,
    taskProgress,
  } = useAgentStore();

  const completionPercentage = maxIterations > 0 ? (iteration / maxIterations) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* ヘッダー */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">エージェント状態</h2>
        <p className="text-sm text-gray-500 mt-1">
          統一エージェント方程式のリアルタイム状態
        </p>
      </div>

      {/* 現在のフェーズ */}
      <div>
        <div className="text-sm font-semibold text-gray-600 mb-2">現在のフェーズ</div>
        <div
          className={`flex items-center space-x-3 p-4 rounded-lg ${getPhaseColor(
            currentPhase
          )} text-white ${currentPhase === 'Θ' ? 'animate-blink' : ''}`}
        >
          <span className="text-3xl">{getPhaseIcon(currentPhase)}</span>
          <div>
            <div className="font-bold text-lg">{currentPhase}</div>
            <div className="text-xs opacity-90">{getPhaseLabel(currentPhase)}</div>
          </div>
        </div>
      </div>

      {/* 反復回数 */}
      <div>
        <div className="text-sm font-semibold text-gray-600 mb-2">反復回数</div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-gray-800">
            {iteration} / {maxIterations}
          </span>
          <span className="text-sm text-gray-500">{completionPercentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* 収束率 */}
      <div>
        <div className="text-sm font-semibold text-gray-600 mb-2">収束率</div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-gray-800">
            {convergenceRate.toFixed(1)}%
          </span>
          <span className="text-sm text-gray-500">
            {convergenceRate >= 90
              ? '収束済み'
              : convergenceRate >= 50
              ? '収束中'
              : '探索中'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              convergenceRate >= 90
                ? 'bg-green-500'
                : convergenceRate >= 50
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${convergenceRate}%` }}
          />
        </div>
      </div>

      {/* 世界バージョン */}
      <div>
        <div className="text-sm font-semibold text-gray-600 mb-2">世界バージョン</div>
        <div className="flex items-center space-x-2">
          <span className="text-3xl">🌍</span>
          <span className="text-2xl font-bold text-world">World_{worldVersion}</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {worldVersion === 0
            ? '初期状態'
            : `${worldVersion}回の「瞬き」が発生しました`}
        </div>
      </div>

      {/* タスク進捗 */}
      <div>
        <div className="text-sm font-semibold text-gray-600 mb-3">タスク進捗</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm font-medium text-gray-700">完了</span>
            </div>
            <span className="text-lg font-bold text-green-600">
              {taskProgress.completed}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 animate-pulse-slow">●</span>
              <span className="text-sm font-medium text-gray-700">実行中</span>
            </div>
            <span className="text-lg font-bold text-blue-600">
              {taskProgress.inProgress}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">○</span>
              <span className="text-sm font-medium text-gray-700">保留</span>
            </div>
            <span className="text-lg font-bold text-gray-600">
              {taskProgress.pending}
            </span>
          </div>
        </div>
        <div className="mt-3 text-center">
          <span className="text-sm text-gray-500">
            合計: <span className="font-bold">{taskProgress.total}</span> タスク
          </span>
        </div>
      </div>
    </div>
  );
};
