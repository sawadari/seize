import { create } from 'zustand';
import { AgentState, Phase } from '../types';

interface AgentStore extends AgentState {
  setPhase: (phase: Phase) => void;
  incrementIteration: () => void;
  updateConvergenceRate: (rate: number) => void;
  updateTaskProgress: (progress: Partial<AgentState['taskProgress']>) => void;
  reset: () => void;
}

const initialState: AgentState = {
  currentPhase: 'idle',
  iteration: 0,
  maxIterations: 10,
  convergenceRate: 0,
  worldVersion: 0,
  taskProgress: {
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
  },
};

export const useAgentStore = create<AgentStore>((set) => ({
  ...initialState,

  setPhase: (phase) =>
    set((state) => ({
      currentPhase: phase,
    })),

  incrementIteration: () =>
    set((state) => ({
      iteration: state.iteration + 1,
      worldVersion: state.worldVersion + 1,
    })),

  updateConvergenceRate: (rate) =>
    set((state) => ({
      convergenceRate: Math.min(100, Math.max(0, rate)),
    })),

  updateTaskProgress: (progress) =>
    set((state) => ({
      taskProgress: {
        ...state.taskProgress,
        ...progress,
      },
    })),

  reset: () => set(initialState),
}));
