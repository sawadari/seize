import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../stores/chatStore';
import { Message } from '../types';

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isHuman = message.role === 'human';
  const isSystem = message.role === 'system';

  const roleIcon = isHuman ? '👤' : isSystem ? '⚙️' : '🤖';
  const roleLabel = isHuman ? 'あなた' : isSystem ? 'System' : 'AI Agent';

  const bubbleClass = isHuman
    ? 'bg-blue-500 text-white'
    : isSystem
    ? 'bg-gray-200 text-gray-700'
    : 'bg-green-500 text-white';

  const alignClass = isHuman ? 'justify-end' : 'justify-start';

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`flex ${alignClass} mb-4`}>
      <div className={`max-w-[70%] ${isHuman ? 'order-2' : 'order-1'}`}>
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-lg">{roleIcon}</span>
          <span className="text-xs font-semibold text-gray-600">{roleLabel}</span>
          <span className="text-xs text-gray-400">{formatTimestamp(message.timestamp)}</span>
          {message.metadata?.phase && (
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
              Phase: {message.metadata.phase}
            </span>
          )}
        </div>
        <div className={`${bubbleClass} rounded-2xl px-4 py-3 shadow-md`}>
          <div className="whitespace-pre-wrap text-sm">{message.content}</div>
        </div>
        {message.metadata?.worldVersion !== undefined && (
          <div className="text-xs text-gray-400 mt-1 ml-2">
            World_{message.metadata.worldVersion}
          </div>
        )}
      </div>
    </div>
  );
};

const TypingIndicator: React.FC = () => (
  <div className="flex justify-start mb-4">
    <div className="flex items-center space-x-2 bg-gray-200 rounded-2xl px-4 py-3">
      <span className="text-lg">🤖</span>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);

export const ChatInterface: React.FC = () => {
  const { messages, isTyping, addMessage, setTyping } = useChatStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 新しいメッセージが追加されたら自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 人間のメッセージを追加
    const humanMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'human',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    addMessage(humanMessage);
    setInputValue('');

    // デモ用: AIの応答をシミュレート
    setTyping(true);
    setTimeout(() => {
      const aiMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'ai',
        content: `了解しました。「${inputValue.trim()}」について処理を開始します。\n\n統一エージェント方程式を適用して、最適な実行プランを生成します。`,
        timestamp: new Date(),
        metadata: {
          phase: 'ℐ',
          worldVersion: messages.length,
        },
      };
      addMessage(aiMessage);
      setTyping(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* ヘッダー */}
      <div className="border-b p-4 bg-gradient-to-r from-blue-500 to-green-500">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>💬</span>
          <span>1on1 対話</span>
        </h2>
        <p className="text-sm text-white/80 mt-1">
          人間とAIエージェントの協働インターフェース
        </p>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p className="text-lg mb-2">👋</p>
              <p className="text-sm">メッセージを送信して会話を開始してください</p>
            </div>
          </div>
        )}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* 入力エリア */}
      <div className="border-t p-4 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="flex items-end space-x-2">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="メッセージを入力... (Shift+Enterで改行)"
              className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              送信
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            💡 Tip: Enterで送信、Shift+Enterで改行
          </div>
        </form>
      </div>
    </div>
  );
};
