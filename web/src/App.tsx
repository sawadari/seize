import React, { useState } from 'react';
import { KnowledgeGraphView } from './components/KnowledgeGraphView';
import { CommentBubbles } from './components/CommentBubbles';
import { sampleKnowledgeGraph, sampleGraphLayout } from './data/sampleKnowledgeGraph';
import { Comment } from './types/knowledgeGraph';

function App() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>(sampleKnowledgeGraph.comments);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const handleAddComment = (nodeId: string, content: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      nodeId,
      author: 'human',
      content,
      timestamp: new Date(),
    };
    setComments([...comments, newComment]);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white">
      {/* ヘッダー */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">
            人間とAIの共通認識
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            知識グラフで要求・機能・テストのトレーサビリティを可視化
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* 知識グラフ（左側 - 広め）*/}
          <div className="flex-[3] border-r">
            <KnowledgeGraphView
              nodes={sampleKnowledgeGraph.nodes}
              edges={sampleKnowledgeGraph.edges}
              layout={sampleGraphLayout}
              onNodeClick={handleNodeClick}
            />
          </div>

          {/* コメント（右側 - 狭め）*/}
          <div className="flex-[1] min-w-[320px] max-w-[400px]">
            <CommentBubbles
              comments={comments}
              selectedNodeId={selectedNodeId}
              onAddComment={handleAddComment}
            />
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="border-t bg-gray-50 py-2">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs text-gray-500">
            {sampleKnowledgeGraph.metadata.projectName} - v{sampleKnowledgeGraph.metadata.version}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
