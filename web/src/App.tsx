import React from 'react';
import { EditableKnowledgeGraph } from './components/EditableKnowledgeGraph';
import { sampleKnowledgeGraph, sampleGraphLayout } from './data/sampleKnowledgeGraph';

function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-white">
      {/* ヘッダー */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-3">
          <h1 className="text-lg font-bold text-gray-900">
            人間とAIの共通認識
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            知識グラフで要求・機能・テストのトレーサビリティを編集
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-hidden">
        <EditableKnowledgeGraph
          initialNodes={sampleKnowledgeGraph.nodes}
          initialEdges={sampleKnowledgeGraph.edges}
          layout={sampleGraphLayout}
        />
      </main>

      {/* フッター */}
      <footer className="border-t bg-gray-50 py-2">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{sampleKnowledgeGraph.metadata.projectName}</span>
            <span>
              ノードをドラッグして配置 | ノード間をドラッグしてエッジ作成 | 選択して削除可能
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
