import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

const MermaidRenderer = ({ chartDefinition }) => {
  const mermaidRef = useRef(null);

  useEffect(() => {
    if (chartDefinition) {
      mermaid.initialize({ startOnLoad: true });
      mermaid.contentLoaded();
    }
  }, [chartDefinition]);

  return (
    <div>
      <h3>Generated Flowchart (Mermaid.js)</h3>
      <pre ref={mermaidRef} className="mermaid">
        {chartDefinition}
      </pre>
    </div>
  );
};

export default MermaidRenderer;
