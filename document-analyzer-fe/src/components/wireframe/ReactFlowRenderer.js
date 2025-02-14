import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import "./ReactFlowRenderer.css";

const UIComponent = ({ data }) => {
  switch (data.type) {
    case "TextField":
      return <input className="textfield" placeholder={data.label} />;
    case "Button":
      return <div className="button">{data.label}</div>;
    case "Switch":
      return (
        <div className="switch">
          <span>{data.label}</span>
          <input type="checkbox" />
        </div>
      );
    case "Dropdown":
      return (
        <select className="dropdown">
          {data.options.map((option, index) => (
            <option key={index}>{option}</option>
          ))}
        </select>
      );
    case "ImageView":
      return <div className="image-placeholder">Image</div>;
    case "VideoView":
      return <div className="image-placeholder">Video</div>;
    case "Avatar":
      return <img src={data.src || "https://via.placeholder.com/50"} alt="Avatar" className="avatar" />;
    case "Progress":
      return (
        <div className="progress-bar">
          <div style={{ width: `${data.progress}%` }} className="progress-fill"></div>
        </div>
      );
    case "Slider":
      return <input type="range" min="0" max="100" defaultValue={data.value} className="slider" />;
    case "Tabs":
      return (
        <div className="tabs">
          {data.tabs.map((tab, index) => (
            <div key={index} className="tab">{tab}</div>
          ))}
        </div>
      );
    default:
      return <div>{data.label}</div>;
  }
};

const ScreenNode = ({ data }) => {
  return (
    <div className="screen-container">
      <div className="screen draggable">
        <div className="notch"></div>
        <h3 className="screen-title">{data.label}</h3>
        {data.components.map((comp, index) => (
          <UIComponent key={index} data={comp} />
        ))}
        <div className="bottom-nav">
          <span>🏠 Home</span>
          <span>🔍 Search</span>
          <span>👤 Profile</span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
};

const nodeTypes = { screen: ScreenNode };

const FlowComponent = ({ wireframeData }) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (wireframeData) {
      console.log(wireframeData)
      // Map screens to nodes
      const nodesData = wireframeData.screens.screens.map((screen, index) => ({
        id: index.toString(),
        type: "screen",
        position: { x: index * 300, y: 0 },
        data: screen,
      }));

      // Map edges
      const edgesData = wireframeData.screens.edges.map((edge, index) => ({
        id: `e${edge.from}-${edge.to}`,
        source: edge.from.toString(),
        target: edge.to.toString(),
      }));

      setNodes(nodesData);
      setEdges(edgesData);
    }
  }, [wireframeData]);

  useEffect(() => {
    fitView({ padding: 0.2 });
  }, [nodes, edges]);

  return (
    <div className="flow-container">
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
        {/* <MiniMap /> */}
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