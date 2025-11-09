import { create } from 'zustand';
import { Message } from '../types';

interface ChatStore {
  messages: Message[];
  isTyping: boolean;

  addMessage: (message: Message) => void;
  removeMessage: (messageId: string) => void;
  updateMessage: (messageId: string, content: string) => void;

  setTyping: (typing: boolean) => void;

  clear: () => void;

  // ヘルパー関数
  getMessagesByRole: (role: Message['role']) => Message[];
  getLatestMessage: () => Message | null;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isTyping: false,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  removeMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== messageId),
    })),

  updateMessage: (messageId, content) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId
          ? { ...msg, content }
          : msg
      ),
    })),

  setTyping: (typing) =>
    set(() => ({
      isTyping: typing,
    })),

  clear: () =>
    set(() => ({
      messages: [],
      isTyping: false,
    })),

  // ヘルパー関数
  getMessagesByRole: (role) => {
    return get().messages.filter((msg) => msg.role === role);
  },

  getLatestMessage: () => {
    const messages = get().messages;
    return messages.length > 0 ? messages[messages.length - 1] : null;
  },
}));
