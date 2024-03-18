import { HierarchyNode, tree } from "d3-hierarchy";
import { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Position,
  Node as RFNode,
  useReactFlow,
} from "reactflow";
import { useShallow } from "zustand/react/shallow";
import useAnimatedNodes from "../../hooks/use-animated-nodes";
import { Node } from "../shared/types/common";
import { useUIStore } from "../stores/useUI";

const proOptions = { account: "paid-pro", hideAttribution: true };

type ProProps = {
  animationDuration?: number;
  data: Node[];
  h: HierarchyNode<unknown>;
};
const layout = tree().nodeSize([70, 200]);
// const layout = tree().nodeSize([200, 70]);

function getElements(h: HierarchyNode<unknown>) {
  const root = layout(h);

  const nodes = root.descendants().map((d: any, i) => ({
    id: d.id,
    data: { label: d.data.name, depth: d.depth },
    // position: { x: d.x, y: d.y },
    position: { x: d.y, y: d.x },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    // sourcePosition: Position.Bottom,
    // targetPosition: Position.Top,
    type: i === 0 ? "input" : d._children ? "default" : "output",
  }));

  const edges = root.links().map((d, i) => ({
    id: `${i}`,
    source: d.source.id || "",
    target: d.target.id || "",
  }));

  return { nodes, edges };
}

function ReactFlowPro({ animationDuration = 200, data, h }: ProProps) {
  const initialElements = getElements(h);
  const [nodes, setNodes] = useAnimatedNodes(initialElements.nodes, {
    duration: animationDuration,
  });
  const [edges, setEdges] = useState(initialElements.edges);
  const { fitView } = useReactFlow();
  const { toggleDrawer, setDrawerDetails } = useUIStore(
    useShallow((state) => ({
      setDrawerDetails: state.setDrawerDetails,
      toggleDrawer: state.toggleDrawer,
    }))
  );
  const handleNodeClick = (_: any, node: RFNode) => {
    const currentNode: any = h.find((_node) => {
      return node.id === _node.id;
    });
    const root: any = h.data;

    if (!currentNode) return;
    if (!currentNode._children) {
    }

    const isExpanded = !!currentNode.children;
    currentNode.children = isExpanded ? null : currentNode._children;
    if (!currentNode._children) {
      toggleDrawer();
      setDrawerDetails({
        query: root.name,
        parent: currentNode.parent.data.name,
        child: currentNode.data.name,
      });
    }
    const nextElements = getElements(h);
    setNodes(nextElements.nodes);
    setEdges(nextElements.edges);
  };

  useEffect(() => {
    fitView({ duration: animationDuration });
  }, [nodes, fitView, animationDuration]);

  return (
    <ReactFlow
      minZoom={-Infinity}
      fitView
      nodes={nodes}
      edges={edges}
      onNodeClick={handleNodeClick}
      elementsSelectable={false}
      snapToGrid
      proOptions={proOptions}
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}

export default ReactFlowPro;
