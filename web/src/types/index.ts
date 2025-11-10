// 統一エージェント方程式の型定義

export type NodeType = 'world' | 'intent' | 'command' | 'transform' | 'goal' | 'task';

// 統一エージェント方程式のフェーズ（物理学的基盤）
export type FormulaPhase = 'ℐ' | '𝒞' | 'Θ' | 'idle';

// 人間中心の協働フェーズ（可視化される層）
export type HumanCenteredPhase = 'questioning' | 'exploring' | 'deciding' | 'learning' | 'idle';

// 互換性のため
export type Phase = FormulaPhase | HumanCenteredPhase;

export interface WorldState {
  version: number;
  timestamp: Date;
  metadata: Record<string, unknown>;
}

export interface Goal {
  description: string;
  essentialQuestion: string;
  priority: 'Must' | 'Should' | 'Could' | 'Wont';
}

export interface Task {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  dependencies: string[];
}

export interface AgentState {
  currentPhase: Phase;
  iteration: number;
  maxIterations: number;
  convergenceRate: number;
  worldVersion: number;
  taskProgress: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
  };
}

export interface Message {
  id: string;
  role: 'human' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    phase?: Phase;
    worldVersion?: number;
    nodeIds?: string[];
  };
}

export interface GraphNode {
  id: string;
  type: NodeType;
  data: {
    label: string;
    description?: string;
    metadata?: Record<string, unknown>;
  };
  position: { x: number; y: number };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  style?: Record<string, unknown>;
}
