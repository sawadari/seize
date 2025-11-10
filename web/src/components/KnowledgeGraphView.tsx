import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { KnowledgeNode as KGNode, KnowledgeEdge as KGEdge } from '../types/knowledgeGraph';

interface KnowledgeGraphViewProps {
  nodes: KGNode[];
  edges: KGEdge[];
  layout: { nodes: Array<{ id: string; position: { x: number; y: number } }> };
  onNodeClick?: (nodeId: string) => void;
}

// カスタムノードコンポーネント
const KnowledgeNodeComponent = ({ data }: { data: any }) => {
  const getNodeStyle = () => {
    const baseStyle = 'px-6 py-4 rounded-lg border-2 transition-all duration-200';

    switch (data.type) {
      case 'requirement':
        return `${baseStyle} bg-gray-200 border-gray-300 hover:shadow-md`;
      case 'feature':
        return `${baseStyle} bg-gray-300 border-gray-400 hover:shadow-md`;
      case 'test':
        return `${baseStyle} bg-gray-400 border-gray-500 text-white hover:shadow-md`;
      default:
        return `${baseStyle} bg-white border-gray-300`;
    }
  };

  const getStatusColor = () => {
    switch (data.metadata?.status) {
      case 'completed':
        return 'text-green-600';
      case 'in_progress':
        return 'text-blue-600';
      case 'pending':
        return 'text-gray-500';
      default:
        return '';
    }
  };

  return (
    <div className={getNodeStyle()}>
      <div className="text-xs font-bold text-gray-600 mb-1">{data.label}</div>
      <div className="text-sm font-medium text-gray-900">{data.description}</div>
      {data.metadata?.priority && (
        <div className="text-xs mt-2 text-gray-600">
          優先度: <span className="font-semibold">{data.metadata.priority}</span>
        </div>
      )}
      {data.metadata?.status && (
        <div className={`text-xs mt-1 ${getStatusColor()}`}>
          {data.metadata.status === 'completed' && '✓ 完了'}
          {data.metadata.status === 'in_progress' && '● 進行中'}
          {data.metadata.status === 'pending' && '○ 保留'}
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  requirement: KnowledgeNodeComponent,
  feature: KnowledgeNodeComponent,
  test: KnowledgeNodeComponent,
};

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  nodes: kgNodes,
  edges: kgEdges,
  layout,
  onNodeClick,
}) => {
  // React Flow用のノード・エッジに変換
  const initialNodes: Node[] = kgNodes.map((node) => {
    const layoutNode = layout.nodes.find((n) => n.id === node.id);
    return {
      id: node.id,
      type: node.type,
      data: node,
      position: layoutNode?.position || { x: 0, y: 0 },
    };
  });

  const initialEdges: Edge[] = kgEdges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    type: 'smoothstep',
    animated: false,
    style: {
      stroke: '#9CA3AF',
      strokeWidth: 2,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#9CA3AF',
    },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
      if (onNodeClick) {
        onNodeClick(node.id);
      }

      // 選択状態を更新
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          style: {
            ...n.style,
            border: n.id === node.id ? '2px solid #3B82F6' : undefined,
          },
        }))
      );
    },
    [onNodeClick, setNodes]
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        style: {
          ...n.style,
          border: undefined,
        },
      }))
    );
  }, [setNodes]);

  return (
    <div className="h-full w-full bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background color="#E5E7EB" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if (node.id === selectedNodeId) return '#3B82F6';
            switch (node.type) {
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
      </ReactFlow>
    </div>
  );
};
