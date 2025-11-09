import React from 'react';
import { GraphView } from './components/GraphView';
import { ChatInterface } from './components/ChatInterface';
import { AgentStatePanel } from './components/AgentStatePanel';
import { DemoControls } from './components/DemoControls';

function App() {

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center space-x-2">
                <span>⚡</span>
                <span>Seize - 統一エージェント方程式</span>
              </h1>
              <p className="text-sm opacity-90 mt-1">
                人間とAIの協働を、次のレベルへ
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-75">Unified Agent Formula</div>
              <div className="text-sm font-mono">
                𝔸(Input, World₀) = lim<sub>n→∞</sub> [∫₀ⁿ (Θ ◦ 𝒞 ◦ ℐ)(t) dt]
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full w-full p-4">
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 左: グラフビュー */}
            <div className="lg:col-span-2 h-full">
              <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-full">
                  <GraphView />
                </div>
              </div>
            </div>

            {/* 右: デモコントロール & チャット & エージェント状態 */}
            <div className="h-full flex flex-col space-y-4">
              {/* デモコントロール */}
              <div className="flex-shrink-0">
                <DemoControls />
              </div>

              {/* チャットインターフェース */}
              <div className="flex-[2] min-h-0">
                <ChatInterface />
              </div>

              {/* エージェント状態パネル */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <AgentStatePanel />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-3">
        <div className="container mx-auto px-6 text-center text-sm">
          <p>
            🌍 瞬く景色 (Flickering Scenery) |{' '}
            <span className="font-mono">World₀ → [瞬き] → World₁ → [瞬き] → World₂ → ...</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
