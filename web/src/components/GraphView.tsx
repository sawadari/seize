import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
  NodeTypes,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useGraphStore } from '../stores/graphStore';
import { NodeType } from '../types';

// カスタムノードコンポーネント
const WorldNode = ({ data }: { data: any }) => (
  <div className="px-6 py-4 shadow-lg rounded-lg bg-world text-white border-2 border-world/20 animate-fade-in">
    <div className="text-xs font-bold mb-1">🌍 World</div>
    <div className="text-lg font-semibold">{data.label}</div>
    {data.description && (
      <div className="text-xs mt-2 opacity-80">{data.description}</div>
    )}
  </div>
);

const IntentNode = ({ data }: { data: any }) => (
  <div className="px-6 py-4 shadow-lg rounded-lg bg-intent text-white border-2 border-intent/20 animate-fade-in">
    <div className="text-xs font-bold mb-1">🎯 Intent (ℐ)</div>
    <div className="text-lg font-semibold">{data.label}</div>
    {data.description && (
      <div className="text-xs mt-2 opacity-80">{data.description}</div>
    )}
  </div>
);

const CommandNode = ({ data }: { data: any }) => (
  <div className="px-6 py-4 shadow-lg rounded-lg bg-command text-white border-2 border-command/20 animate-fade-in">
    <div className="text-xs font-bold mb-1">📋 Command (𝒞)</div>
    <div className="text-lg font-semibold">{data.label}</div>
    {data.description && (
      <div className="text-xs mt-2 opacity-80">{data.description}</div>
    )}
  </div>
);

const TransformNode = ({ data }: { data: any }) => (
  <div className="px-6 py-4 shadow-lg rounded-lg bg-transform text-white border-2 border-transform/20 animate-fade-in animate-blink">
    <div className="text-xs font-bold mb-1">⚡ Transform (Θ)</div>
    <div className="text-lg font-semibold">{data.label}</div>
    {data.description && (
      <div className="text-xs mt-2 opacity-80">{data.description}</div>
    )}
  </div>
);

const GoalNode = ({ data }: { data: any }) => (
  <div className="px-6 py-4 shadow-lg rounded-lg bg-goal text-gray-900 border-2 border-goal/20 animate-fade-in">
    <div className="text-xs font-bold mb-1">🎪 Goal</div>
    <div className="text-lg font-semibold">{data.label}</div>
    {data.description && (
      <div className="text-xs mt-2 opacity-80">{data.description}</div>
    )}
  </div>
);

const TaskNode = ({ data }: { data: any }) => (
  <div className="px-4 py-3 shadow-md rounded-md bg-gray-100 text-gray-800 border-2 border-gray-300">
    <div className="text-xs font-bold mb-1">✓ Task</div>
    <div className="text-sm font-medium">{data.label}</div>
    {data.metadata?.status && (
      <div className="text-xs mt-1">
        <span
          className={`inline-block px-2 py-0.5 rounded ${
            data.metadata.status === 'completed'
              ? 'bg-green-200 text-green-800'
              : data.metadata.status === 'in_progress'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          {data.metadata.status}
        </span>
      </div>
    )}
  </div>
);

const nodeTypes: NodeTypes = {
  world: WorldNode,
  intent: IntentNode,
  command: CommandNode,
  transform: TransformNode,
  goal: GoalNode,
  task: TaskNode,
};

export const GraphView: React.FC = () => {
  const { nodes: storeNodes, edges: storeEdges, selectNode, selectedNodeId } = useGraphStore();

  // React Flow用のノード・エッジに変換
  const [nodes, setNodes, onNodesChange] = useNodesState(
    storeNodes.map((node) => ({
      id: node.id,
      type: node.type,
      data: node.data,
      position: node.position,
      selected: node.id === selectedNodeId,
    }))
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState(
    storeEdges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: edge.animated ?? false,
      style: edge.style,
    }))
  );

  // ストアの変更をReact Flowに反映
  React.useEffect(() => {
    setNodes(
      storeNodes.map((node) => ({
        id: node.id,
        type: node.type,
        data: node.data,
        position: node.position,
        selected: node.id === selectedNodeId,
      }))
    );
  }, [storeNodes, selectedNodeId, setNodes]);

  React.useEffect(() => {
    setEdges(
      storeEdges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        animated: edge.animated ?? false,
        style: edge.style,
      }))
    );
  }, [storeEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div className="h-full w-full bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        className="bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'world':
                return '#3B82F6';
              case 'intent':
                return '#10B981';
              case 'command':
                return '#8B5CF6';
              case 'transform':
                return '#F59E0B';
              case 'goal':
                return '#FBBF24';
              case 'task':
                return '#9CA3AF';
              default:
                return '#000';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
};
