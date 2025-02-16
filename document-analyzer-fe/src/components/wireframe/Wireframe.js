import React, { useEffect, useRef } from "react";
import rough from "roughjs";

const WireframeRenderer = ({ wireframeData }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!wireframeData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rc = rough.canvas(canvas);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let yOffset = 10; // Starting y position

    wireframeData.screens.forEach((screen) => {
      // Screen Header
      rc.rectangle(5, yOffset, 90, 20, { roughness: 1.2 });
      ctx.fillText(screen.name, 10, yOffset + 15);
      yOffset += 30;

      screen.components.forEach((component) => {
        if (yOffset + 30 > canvas.height) return; // Prevent overflow

        if (component.type === "Button") {
          rc.rectangle(10, yOffset, 80, 15, { roughness: 1.2 });
          ctx.fillText(component.label, 15, yOffset + 10);
          yOffset += 25;
        } else if (component.type === "TextField") {
          rc.rectangle(10, yOffset, 80, 12, { roughness: 1.2 });
          ctx.fillText(component.label, 15, yOffset + 9);
          yOffset += 22;
        } else if (component.type === "Label") {
          ctx.fillText(component.text, 10, yOffset + 10);
          yOffset += 18;
        }
      });

      yOffset += 10; // Space between screens
    });
  }, [wireframeData]);

  return <canvas ref={canvasRef} width={150} height={350}></canvas>;
};

export default WireframeRenderer;
