import React, { useState } from 'react';
import { EditableKnowledgeGraph } from './components/EditableKnowledgeGraph';
import { PurposeBanner } from './components/PurposeBanner';
import { WhyBox } from './components/WhyBox';
import { DecisionLedger } from './components/DecisionLedger';
import { sampleKnowledgeGraph, sampleGraphLayout } from './data/sampleKnowledgeGraph';
import { Purpose } from './types/purpose';
import { GuardrailEvaluation } from './types/guardrail';
import { DecisionLedgerEntry } from './types/decisionLedger';

function App() {
  // 目的バナーの状態
  const [purpose, setPurpose] = useState<Purpose>({
    goal: 'カート放棄率を15%削減',
    scope: '認証機能',
    mode: 'safe',
  });

  // WhyBox用の評価結果
  const [currentEvaluation, setCurrentEvaluation] = useState<GuardrailEvaluation | null>(null);

  // 決定レジャー
  const [ledgerEntries, setLedgerEntries] = useState<DecisionLedgerEntry[]>([
    // サンプルエントリ
    {
      commitId: 'dec-20250110-001',
      timestamp: new Date('2025-01-10T14:30:00Z'),
      purpose: 'カート放棄率を15%削減',
      actionType: 'add_edge',
      selectedOption: '要求BR-001 → 機能Feature-001',
      rationale: 'ISO/IEC 29148準拠のトレーサビリティを確立するため',
      approver: 'user-12345',
      impactSummary: '要求1件、機能1件、テスト2件に影響',
      confidence: 0.92,
      rulesMatched: ['R001'],
    },
  ]);

  // 下部タブの状態
  const [activeTab, setActiveTab] = useState<'suggestion' | 'ledger'>('suggestion');

  const isPurposeSet = purpose.goal.trim().length > 0 && purpose.scope.trim().length > 0;

  const handleExportLedger = () => {
    const json = JSON.stringify(ledgerEntries, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'decision-ledger.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white">
      {/* 目的バナー */}
      <PurposeBanner purpose={purpose} onPurposeChange={setPurpose} />

      {/* ヘッダー */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-3">
          <h1 className="text-lg font-bold text-gray-900">
            人間とAIの共通認識
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            決定レジャーで説明責任を担保
          </p>
        </div>
      </header>

      {/* メインコンテンツ: グラフ + WhyBox */}
      <main className="flex-1 overflow-hidden flex">
        {/* 知識グラフ（75%） */}
        <div className="flex-1 relative">
          <EditableKnowledgeGraph
            initialNodes={sampleKnowledgeGraph.nodes}
            initialEdges={sampleKnowledgeGraph.edges}
            layout={sampleGraphLayout}
            purposeSet={isPurposeSet}
            isPowerMode={purpose.mode === 'power'}
            onEvaluationChange={setCurrentEvaluation}
          />
        </div>

        {/* WhyBox（25%） */}
        <div className="w-1/4 min-w-[300px]">
          <WhyBox evaluation={currentEvaluation} />
        </div>
      </main>

      {/* 下部ドッキングタブ */}
      <div className="border-t bg-white h-64 flex flex-col">
        {/* タブヘッダー */}
        <div className="flex border-b bg-gray-50">
          <button
            onClick={() => setActiveTab('suggestion')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'suggestion'
                ? 'bg-white border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🤖 AIサジェスチョン
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'ledger'
                ? 'bg-white border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📋 決定レジャー ({ledgerEntries.length})
          </button>
        </div>

        {/* タブコンテンツ */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'suggestion' && (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm p-4 text-center">
              エッジを作成すると、AIサジェスチョンがここに表示されます
              <br />
              <span className="text-xs text-gray-500 mt-2 inline-block">
                （承認機能は次フェーズで実装）
              </span>
            </div>
          )}

          {activeTab === 'ledger' && (
            <DecisionLedger entries={ledgerEntries} onExport={handleExportLedger} />
          )}
        </div>
      </div>

      {/* フッター */}
      <footer className="border-t bg-gray-50 py-2">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{sampleKnowledgeGraph.metadata.projectName}</span>
            <span>
              ノードをドラッグして配置 | ノード間をドラッグしてエッジ作成 | 選択して削除可能
            </span>
            <span className="text-blue-600 font-medium">
              モード: {purpose.mode === 'safe' ? '🛡️ 安全' : '⚡ パワー'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
