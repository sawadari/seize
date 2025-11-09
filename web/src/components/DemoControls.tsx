import React, { useState } from 'react';
import { ecommerceAuthDemoScenarios } from '../demo/ecommerceAuthDemo';
import { useGraphStore } from '../stores/graphStore';
import { useAgentStore } from '../stores/agentStore';
import { useChatStore } from '../stores/chatStore';

export const DemoControls: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const graphStore = useGraphStore();
  const agentStore = useAgentStore();
  const chatStore = useChatStore();

  const totalSteps = ecommerceAuthDemoScenarios.length;

  const loadScenario = (stepIndex: number) => {
    const scenario = ecommerceAuthDemoScenarios[stepIndex];

    // グラフをクリア
    graphStore.clear();

    // ノードとエッジを追加
    scenario.nodes.forEach((node) => graphStore.addNode(node));
    scenario.edges.forEach((edge) => graphStore.addEdge(edge));

    // エージェント状態を更新
    agentStore.setPhase(scenario.agentState.currentPhase);
    agentStore.updateConvergenceRate(scenario.agentState.convergenceRate);

    // チャットをクリアしてメッセージを追加
    chatStore.clear();
    scenario.messages.forEach((msg) => chatStore.addMessage(msg));

    // タスク進捗を更新
    const tasks = scenario.nodes.filter((n) => n.type === 'task');
    const completed = tasks.filter((t) => t.data.metadata?.status === 'completed').length;
    const inProgress = tasks.filter((t) => t.data.metadata?.status === 'in_progress').length;
    const pending = tasks.filter((t) => t.data.metadata?.status === 'pending').length;

    agentStore.updateTaskProgress({
      total: tasks.length,
      completed,
      inProgress,
      pending,
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      loadScenario(nextStep);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      loadScenario(prevStep);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    loadScenario(0);
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    let step = currentStep;

    const interval = setInterval(() => {
      step += 1;
      if (step >= totalSteps) {
        clearInterval(interval);
        setIsPlaying(false);
        return;
      }
      setCurrentStep(step);
      loadScenario(step);
    }, 3000); // 3秒ごとに次のステップ
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    loadScenario(stepIndex);
  };

  const getStepLabel = (stepIndex: number): string => {
    switch (stepIndex) {
      case 0:
        return '初期状態';
      case 1:
        return 'ℐ 意図解決';
      case 2:
        return '𝒞 コマンドスタック';
      case 3:
        return 'Θ 世界変換';
      case 4:
        return '✨ 収束';
      default:
        return `Step ${stepIndex}`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          🎬 デモ: ECサイト認証機能改善
        </h3>
        <p className="text-sm text-gray-600">
          統一エージェント方程式による要求抽出プロセスを可視化
        </p>
      </div>

      {/* ステップインジケーター */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Step {currentStep + 1} / {totalSteps}
          </span>
          <span className="text-sm text-gray-500">{getStepLabel(currentStep)}</span>
        </div>
        <div className="flex space-x-1">
          {ecommerceAuthDemoScenarios.map((_, index) => (
            <button
              key={index}
              onClick={() => handleStepClick(index)}
              className={`flex-1 h-2 rounded ${
                index === currentStep
                  ? 'bg-blue-500'
                  : index < currentStep
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              } transition-colors hover:opacity-80`}
              title={getStepLabel(index)}
            />
          ))}
        </div>
      </div>

      {/* コントロールボタン */}
      <div className="flex space-x-2">
        <button
          onClick={handleReset}
          className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          🔄 リセット
        </button>
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          ⬅️ 前へ
        </button>
        <button
          onClick={handlePlay}
          disabled={isPlaying || currentStep >= totalSteps - 1}
          className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isPlaying ? '▶️ 再生中...' : '▶️ 再生'}
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep >= totalSteps - 1}
          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          次へ ➡️
        </button>
      </div>

      {/* 現在のステップ説明 */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          {currentStep === 0 &&
            '初期状態: カート放棄率60%, パスワードリセット問い合わせ多数'}
          {currentStep === 1 &&
            'ℐ (意図解決): Step-Back Questionで本質的課題を理解し、目標を設定'}
          {currentStep === 2 &&
            '𝒞 (コマンドスタック): 目標を3つのタスクに分解（PO/CISO/ユーザーFB分析）'}
          {currentStep === 3 &&
            'Θ (世界変換): 6つの変換フェーズで要求を抽出・仕様化（θ₁〜θ₆）'}
          {currentStep === 4 &&
            '収束: ISO/IEC/IEEE 29148準拠の要求仕様が完成（13個の要求）'}
        </p>
      </div>
    </div>
  );
};
