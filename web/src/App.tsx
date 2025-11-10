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
                <span>🌍</span>
                <span>人間中心AI時代の協働</span>
              </h1>
              <p className="text-sm opacity-90 mt-1">
                人間とAIが共通の目標を持ち、相互補完的に問題を解決
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-75">Human-Centered Organization Charter</div>
              <div className="text-xs font-light mt-1">
                人間は判断する | AIは情報を提供する | 共に学び、成長する
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
            📜 組織憲章の原則 |{' '}
            <span className="font-light">
              意図と責任 · 説明と透明性 · 共創と成長 · 倫理と敬意 · 学習と更新
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
