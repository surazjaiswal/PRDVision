import React from 'react';

const Flowchart = ({ flowchartData }) => {
  if (!flowchartData) return <p>Loading flowchart data...</p>;

  return (
    <div>
      <h3>Flowchart</h3>
      <h4>Nodes</h4>
      <ul>
        {flowchartData.nodes.map((node) => (
          <li key={node.id}>{node.label} ({node.type})</li>
        ))}
      </ul>
      <h4>Edges</h4>
      <ul>
        {flowchartData.edges.map((edge, index) => (
          <li key={index}>
            From {edge.from} to {edge.to}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Flowchart;
