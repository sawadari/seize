import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  Panel,
  Handle,
  Position,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { KnowledgeNode, KnowledgeEdge } from '../types/knowledgeGraph';
import { GuardrailEvaluation } from '../types/guardrail';
import { guardrailEngine } from '../utils/GuardrailEngine';

interface EditableKnowledgeGraphProps {
  initialNodes: KnowledgeNode[];
  initialEdges: KnowledgeEdge[];
  layout: { nodes: Array<{ id: string; position: { x: number; y: number } }> };
  purposeSet: boolean;  // 目的が設定されているか
  isPowerMode: boolean; // パワーユーザーモード
  onEdgeChange?: (edges: KnowledgeEdge[]) => void;
  onNodeChange?: (nodes: KnowledgeNode[]) => void;
  onEvaluationChange?: (evaluation: GuardrailEvaluation | null) => void;
}

// シンプルなカスタムノード
const CustomNode = ({ data }: any) => {
  const getNodeStyle = () => {
    switch (data.type) {
      case 'requirement':
        return 'bg-gray-200 border-gray-400';
      case 'feature':
        return 'bg-gray-300 border-gray-500';
      case 'test':
        return 'bg-gray-400 border-gray-600 text-white';
      default:
        return 'bg-white border-gray-300';
    }
  };

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 shadow-sm min-w-[150px] ${getNodeStyle()} relative`}
    >
      {/* 入力ハンドル（左側） */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-gray-500 border-2 border-white"
      />

      <div className="text-xs font-bold mb-1">{data.label}</div>
      <div className="text-sm">{data.description}</div>
      {data.metadata?.priority && (
        <div className="text-xs mt-1 opacity-75">
          {data.metadata.priority}
        </div>
      )}

      {/* 出力ハンドル（右側） */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-gray-500 border-2 border-white"
      />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export const EditableKnowledgeGraph: React.FC<EditableKnowledgeGraphProps> = ({
  initialNodes,
  initialEdges,
  layout,
  purposeSet,
  isPowerMode,
  onEdgeChange,
  onNodeChange,
  onEvaluationChange,
}) => {
  // React Flow用のノードに変換
  const rfNodes: Node[] = initialNodes.map((node) => {
    const layoutNode = layout.nodes.find((n) => n.id === node.id);
    return {
      id: node.id,
      type: 'custom',
      data: node,
      position: layoutNode?.position || { x: Math.random() * 500, y: Math.random() * 500 },
    };
  });

  // React Flow用のエッジに変換
  const rfEdges: Edge[] = initialEdges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    type: 'smoothstep',
    style: {
      stroke: '#9CA3AF',
      strokeWidth: 2,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#9CA3AF',
    },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges);
  const [suggestion, setSuggestion] = useState<{
    message: string;
    edgeId: string;
  } | null>(null);

  // エッジ接続時
  const onConnect = useCallback(
    (connection: Connection) => {
      // 目的未設定チェック
      if (!purposeSet) {
        alert('⚠️ 目的を設定してください。目的がない変更は承認できません。');
        return;
      }

      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (!sourceNode || !targetNode) return;

      // ガードレール評価
      const evaluation = guardrailEngine.evaluate(
        sourceNode.data.type,
        targetNode.data.type,
        sourceNode.data.label,
        targetNode.data.label
      );

      // 禁止接続チェック（安全モードのみ）
      if (evaluation.verdict === 'forbidden' && !isPowerMode) {
        alert(
          `🚫 禁止接続: ${evaluation.message}\n\nパワーユーザーモードに切り替えるか、承認者2名の承認が必要です。`
        );
        return;
      }

      // エッジ作成（ガードレール評価に基づく色）
      const newEdge = {
        ...connection,
        id: `edge-${Date.now()}`,
        type: 'smoothstep',
        style: {
          stroke: evaluation.edgeColor,
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: evaluation.edgeColor,
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));

      // サジェスチョン表示
      setSuggestion({
        message: evaluation.message,
        edgeId: newEdge.id!,
      });

      // 評価結果を親に通知（WhyBox用）
      if (onEvaluationChange) {
        onEvaluationChange(evaluation);
      }

      // コールバック
      if (onEdgeChange) {
        const kgEdges: KnowledgeEdge[] = [...edges, newEdge].map((e) => ({
          id: e.id!,
          source: e.source,
          target: e.target,
          label: e.label as string,
          type: 'implements', // デフォルト
        }));
        onEdgeChange(kgEdges);
      }
    },
    [edges, nodes, purposeSet, isPowerMode, onEdgeChange, onEvaluationChange, setEdges]
  );

  // サジェスチョン承認
  const handleAcceptSuggestion = () => {
    setSuggestion(null);
    // エッジの色を確定（青 → グレー）
    setEdges((eds) =>
      eds.map((e) =>
        e.id === suggestion?.edgeId
          ? {
              ...e,
              style: { stroke: '#9CA3AF', strokeWidth: 2 },
              markerEnd: { type: MarkerType.ArrowClosed, color: '#9CA3AF' },
            }
          : e
      )
    );
  };

  // サジェスチョン拒否
  const handleRejectSuggestion = () => {
    // エッジを削除
    if (suggestion) {
      setEdges((eds) => eds.filter((e) => e.id !== suggestion.edgeId));
    }
    setSuggestion(null);
  };

  // ノード削除
  const handleDeleteNode = useCallback(() => {
    const selectedNodes = nodes.filter((n) => n.selected);
    if (selectedNodes.length > 0) {
      const nodeIds = selectedNodes.map((n) => n.id);
      setNodes((nds) => nds.filter((n) => !nodeIds.includes(n.id)));
      setEdges((eds) =>
        eds.filter((e) => !nodeIds.includes(e.source) && !nodeIds.includes(e.target))
      );
    }
  }, [nodes, setEdges, setNodes]);

  // エッジ削除
  const handleDeleteEdge = useCallback(() => {
    const selectedEdges = edges.filter((e) => e.selected);
    if (selectedEdges.length > 0) {
      const edgeIds = selectedEdges.map((e) => e.id);
      setEdges((eds) => eds.filter((e) => !edgeIds.includes(e.id)));
    }
  }, [edges, setEdges]);

  // 新しいノード追加
  const handleAddNode = (type: 'requirement' | 'feature' | 'test') => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'custom',
      data: {
        id: `node-${Date.now()}`,
        type,
        label: `新しい${type === 'requirement' ? '要求' : type === 'feature' ? '機能' : 'テスト'}`,
        description: '説明を入力',
        metadata: {},
      },
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="h-full w-full bg-gray-50 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        minZoom={0.3}
        maxZoom={1.5}
      >
        <Background color="#E5E7EB" gap={20} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.data?.type) {
              case 'requirement':
                return '#E5E7EB';
              case 'feature':
                return '#D1D5DB';
              case 'test':
                return '#9CA3AF';
              default:
                return '#F3F4F6';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.05)"
        />

        {/* ツールバー */}
        <Panel position="top-left" className="bg-white rounded-lg shadow-lg p-3 space-y-2">
          <div className="text-xs font-bold text-gray-700 mb-2">ノード追加</div>
          <button
            onClick={() => handleAddNode('requirement')}
            className="block w-full px-3 py-2 text-xs bg-gray-200 hover:bg-gray-300 rounded text-left"
          >
            + 要求
          </button>
          <button
            onClick={() => handleAddNode('feature')}
            className="block w-full px-3 py-2 text-xs bg-gray-300 hover:bg-gray-400 rounded text-left"
          >
            + 機能
          </button>
          <button
            onClick={() => handleAddNode('test')}
            className="block w-full px-3 py-2 text-xs bg-gray-400 hover:bg-gray-500 text-white rounded text-left"
          >
            + テスト
          </button>
          <div className="border-t pt-2 mt-2">
            <button
              onClick={handleDeleteNode}
              className="block w-full px-3 py-2 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded text-left"
            >
              ノード削除
            </button>
            <button
              onClick={handleDeleteEdge}
              className="block w-full px-3 py-2 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded text-left mt-1"
            >
              エッジ削除
            </button>
          </div>
        </Panel>

        {/* AIサジェスチョン */}
        {suggestion && (
          <Panel position="bottom-center" className="bg-white rounded-lg shadow-xl p-4 max-w-md">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🤖</span>
              <div className="flex-1">
                <div className="text-xs font-bold text-gray-700 mb-1">AI サジェスチョン</div>
                <p className="text-sm text-gray-800 mb-3">{suggestion.message}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleAcceptSuggestion}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    ✓ Yes
                  </button>
                  <button
                    onClick={handleRejectSuggestion}
                    className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                  >
                    ✗ No
                  </button>
                </div>
              </div>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};
