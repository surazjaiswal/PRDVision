import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlowProvider,
  getBezierPath,
} from "reactflow";
import dagre from "dagre"; // Import Dagre for automatic layout
import "reactflow/dist/style.css";
import "./ReactFlowRenderer.css";
import UIComponent from "./UIComponent";


// Define Node
const ScreenNode = ({ data }) => {
  return (
    <div className="screen-container">
      <div className="screen draggable">
        <h3 className="screen-title">{data.label}</h3>
        {data.components.map((comp, index) => (
          <UIComponent key={index} data={comp} />
        ))}
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
};

// Define Edge
const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY }) => {
  // Ensure smooth vertical Bezier path (fixes the wavy issue)
  const edgePath = `M${sourceX},${sourceY} C${sourceX},${
    (sourceY + targetY) / 2
  } ${targetX},${(sourceY + targetY) / 2} ${targetX},${targetY}`;

  return (
    <g>
      <path
        id={id}
        className="custom-edge"
        d={edgePath}
        stroke="black"
        strokeWidth="2"
        fill="none"
        strokeDasharray="5,5"
      />
      {/* <circle cx={targetX} cy={targetY} r={4} fill="red" /> */}
    </g>
  );
};

const nodeTypes = { screen: ScreenNode };
const edgeTypes = { custom: CustomEdge };

// Use Dagre to arrange nodes in a hierarchical tree structure
const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 250;
  const nodeHeight = 400;
  dagreGraph.setGraph({
    rankdir: "TB", // Top to Bottom tree layout
    nodesep: 100, // Horizontal spacing
    ranksep: 200, // Vertical spacing
  });

  // Add nodes to Dagre
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // Apply updated positions to nodes
  nodes.forEach((node) => {
    const { x, y } = dagreGraph.node(node.id);
    node.position = { x, y };
  });

  return { nodes, edges };
};

const FlowComponent = ({ wireframeData }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (wireframeData) {
      console.log(wireframeData);

      // Convert wireframe data into nodes and edges
      let nodesData = wireframeData.screens.screens.map((screen, index) => ({
        id: index.toString(),
        type: "screen",
        position: { x: 0, y: 0 }, // Position will be set by Dagre
        data: screen,
      }));

      let edgesData = wireframeData.screens.edges.map((edge) => ({
        id: `e${edge.from}-${edge.to}`,
        source: edge.from.toString(),
        target: edge.to.toString(),
        type: "custom",
      }));

      // Apply Dagre layout
      const layoutedElements = getLayoutedElements(nodesData, edgesData);
      setNodes(layoutedElements.nodes);
      setEdges(layoutedElements.edges);
    }
  }, [wireframeData]);

  return (
    <div className="flow-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

const MobileUIRenderer = ({ wireframeData }) => {
  return (
    <ReactFlowProvider>
      <FlowComponent wireframeData={wireframeData} />
    </ReactFlowProvider>
  );
};

export default MobileUIRenderer;
