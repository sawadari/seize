import React, { useState } from 'react';
import { Comment } from '../types/knowledgeGraph';

interface CommentBubblesProps {
  comments: Comment[];
  selectedNodeId: string | null;
  onAddComment?: (nodeId: string, content: string) => void;
}

export const CommentBubbles: React.FC<CommentBubblesProps> = ({
  comments,
  selectedNodeId,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState('');

  // 選択されたノードのコメントのみ表示
  const filteredComments = selectedNodeId
    ? comments.filter((c) => c.nodeId === selectedNodeId)
    : [];

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'たった今';
    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    return `${days}日前`;
  };

  const handleAddComment = () => {
    if (newComment.trim() && selectedNodeId && onAddComment) {
      onAddComment(selectedNodeId, newComment.trim());
      setNewComment('');
    }
  };

  if (!selectedNodeId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        ノードを選択してコメントを表示
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* ヘッダー */}
      <div className="border-b px-4 py-3 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700">💬 コメント</h3>
        <p className="text-xs text-gray-500 mt-1">
          {filteredComments.length}件のコメント
        </p>
      </div>

      {/* コメントリスト */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredComments.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-8">
            まだコメントがありません
          </div>
        )}

        {filteredComments.map((comment) => (
          <div
            key={comment.id}
            className={`rounded-xl p-4 shadow-md transition-all ${
              comment.author === 'human'
                ? 'bg-white border-2 border-gray-200'
                : 'bg-blue-50 border-2 border-blue-100'
            }`}
          >
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {comment.author === 'human' ? '👤' : '🤖'}
                </span>
                <span className="text-xs font-semibold text-gray-700">
                  {comment.author === 'human' ? '人間' : 'AI'}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {formatTimestamp(comment.timestamp)}
              </span>
            </div>

            {/* コンテンツ */}
            <p className="text-sm text-gray-800 leading-relaxed">
              {comment.content}
            </p>
          </div>
        ))}
      </div>

      {/* 新しいコメント入力 */}
      <div className="border-t px-4 py-3 bg-gray-50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddComment();
              }
            }}
            placeholder="コメントを追加..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            送信
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Enterキーで送信
        </p>
      </div>
    </div>
  );
};
