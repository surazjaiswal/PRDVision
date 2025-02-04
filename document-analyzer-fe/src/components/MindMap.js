import React from 'react';

const MindMap = ({ mindMapData }) => {
  if (!mindMapData) return <p>Loading mind map data...</p>;

  return (
    <div>
      <h3>Mind Map</h3>
      <ul>
        {mindMapData.nodes.map((node) => (
          <li key={node.id}>
            {node.label}
            {node.children && (
              <ul>
                {node.children.map((child) => (
                  <li key={child.id}>{child.label}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MindMap;
