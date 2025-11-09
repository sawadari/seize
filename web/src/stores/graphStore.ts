import { create } from 'zustand';
import { GraphNode, GraphEdge, NodeType } from '../types';

interface GraphStore {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;

  addNode: (node: GraphNode) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, data: Partial<GraphNode['data']>) => void;

  addEdge: (edge: GraphEdge) => void;
  removeEdge: (edgeId: string) => void;

  selectNode: (nodeId: string | null) => void;

  clear: () => void;

  // ヘルパー関数
  getNodesByType: (type: NodeType) => GraphNode[];
  getConnectedNodes: (nodeId: string) => GraphNode[];
}

export const useGraphStore = create<GraphStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    })),

  updateNode: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    })),

  addEdge: (edge) =>
    set((state) => ({
      edges: [...state.edges, edge],
    })),

  removeEdge: (edgeId) =>
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== edgeId),
    })),

  selectNode: (nodeId) =>
    set(() => ({
      selectedNodeId: nodeId,
    })),

  clear: () =>
    set(() => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,
    })),

  // ヘルパー関数
  getNodesByType: (type) => {
    return get().nodes.filter((node) => node.type === type);
  },

  getConnectedNodes: (nodeId) => {
    const edges = get().edges;
    const nodes = get().nodes;

    const connectedNodeIds = new Set<string>();

    edges.forEach((edge) => {
      if (edge.source === nodeId) {
        connectedNodeIds.add(edge.target);
      }
      if (edge.target === nodeId) {
        connectedNodeIds.add(edge.source);
      }
    });

    return nodes.filter((node) => connectedNodeIds.has(node.id));
  },
}));
