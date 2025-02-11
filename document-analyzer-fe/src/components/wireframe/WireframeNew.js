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

    let yOffset = 20; // Starting position
    const padding = 15;
    const elementWidth = canvas.width - padding * 2;

    wireframeData.screens.forEach((screen) => {
      // Screen Title
      rc.rectangle(padding, yOffset, elementWidth, 40, {
        roughness: 1.2,
        fill: "#f0f0f0",
        fillStyle: "solid",
      });
      ctx.font = "bold 16px Arial";
      ctx.fillStyle = "#000";
      ctx.fillText(screen.name, padding + 10, yOffset + 25);
      yOffset += 50;

      screen.components.forEach((component) => {
        if (yOffset + 50 > canvas.height) return; // Prevent overflow

        ctx.font = "14px Arial";
        ctx.fillStyle = "#333"; // Reset color

        switch (component.type) {
          case "Button":
            rc.rectangle(padding, yOffset, elementWidth, 40, {
              roughness: 1.1,
              fill: "#ADD8E6",
              fillStyle: "solid",
            });
            ctx.fillText(component.label, padding + elementWidth / 3, yOffset + 25);
            yOffset += 50;
            break;

          case "TextField":
            rc.rectangle(padding, yOffset, elementWidth, 35, {
              roughness: 1.1,
              fill: "#FFF",
              fillStyle: "solid",
            });
            ctx.fillText(component.label, padding + 10, yOffset + 23);
            yOffset += 45;
            break;

          case "Switch":
            ctx.fillText(component.label, padding, yOffset + 20);
            rc.rectangle(padding + elementWidth - 50, yOffset, 50, 25, { roughness: 1.1, fill: "#CCC" });
            yOffset += 40;
            break;

          case "Slider":
            ctx.fillText(component.label, padding, yOffset + 15);
            rc.line(padding + 10, yOffset + 25, padding + elementWidth - 10, yOffset + 25, { roughness: 1 });
            yOffset += 40;
            break;

          case "Dropdown":
            rc.rectangle(padding, yOffset, elementWidth, 40, {
              roughness: 1.1,
              fill: "#D3D3D3",
              fillStyle: "solid",
            });
            ctx.fillText(component.label, padding + 10, yOffset + 25);
            yOffset += 50;
            break;

          case "ChatBubble":
            rc.rectangle(padding, yOffset, elementWidth, 50, {
              roughness: 1.1,
              fill: "#F5F5DC",
              fillStyle: "solid",
            });
            ctx.fillText(component.sender + ": " + component.message, padding + 10, yOffset + 30);
            yOffset += 60;
            break;

          case "Avatar":
            rc.circle(padding + 20, yOffset + 20, 40, { roughness: 1.1, fill: "#87CEEB" });
            ctx.fillText("Avatar", padding + 70, yOffset + 30);
            yOffset += 60;
            break;

          case "Calendar":
            rc.rectangle(padding, yOffset, elementWidth, 70, {
              roughness: 1.1,
              fill: "#F0E68C",
              fillStyle: "solid",
            });
            ctx.fillText("Calendar", padding + 10, yOffset + 35);
            yOffset += 80;
            break;

          case "Tabs":
            component.items.forEach((item, index) => {
              rc.rectangle(padding + index * (elementWidth / component.items.length), yOffset, elementWidth / component.items.length, 30, {
                roughness: 1.1,
                fill: "#D3D3D3",
                fillStyle: "solid",
              });
              ctx.fillText(item, padding + index * (elementWidth / component.items.length) + 10, yOffset + 20);
            });
            yOffset += 40;
            break;

          case "ProgressBar":
            ctx.fillText(component.label, padding, yOffset + 15);
            rc.rectangle(padding, yOffset + 20, elementWidth, 20, { roughness: 1.1, fill: "#CCC" });
            rc.rectangle(padding, yOffset + 20, (component.value / 100) * elementWidth, 20, {
              roughness: 1.1,
              fill: "blue",
              fillStyle: "solid",
            });
            yOffset += 50;
            break;

          default:
            ctx.fillText(`Unknown: ${component.type}`, padding, yOffset + 20);
            yOffset += 40;
            break;
        }
      });

      yOffset += 30; // Space between screens
    });
  }, [wireframeData]);

  return <canvas ref={canvasRef} width={250} height={700} style={{ border: "1px solid #ccc" }}></canvas>;
};

export default WireframeRenderer;




// import React, { useEffect, useRef } from "react";
// import rough from "roughjs";

// const WireframeRenderer = ({ wireframeData }) => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (!wireframeData || !canvasRef.current) return;

//     const canvas = canvasRef.current;
//     const rc = rough.canvas(canvas);
//     const ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     let yOffset = 10; // Starting position

//     wireframeData.screens.forEach((screen) => {
//       // Screen Title
//       rc.rectangle(5, yOffset, 140, 30, { roughness: 1 });
//       ctx.font = "bold 14px Arial";
//       ctx.fillStyle = "#000";
//       ctx.fillText(screen.name, 15, yOffset + 20);
//       yOffset += 40;

//       screen.components.forEach((component) => {
//         if (yOffset + 40 > canvas.height) return; // Prevent overflow

//         ctx.font = "12px Arial"; 
//         ctx.fillStyle = "#000"; // Reset color

//         switch (component.type) {
//           case "Button":
//             rc.rectangle(10, yOffset, 120, 30, { roughness: 1, fill: "#ADD8E6" });
//             ctx.fillText(component.label, 40, yOffset + 20);
//             yOffset += 40;
//             break;

//           case "TextField":
//             rc.rectangle(10, yOffset, 120, 25, { roughness: 1, fill: "#D3D3D3" });
//             ctx.fillText(component.label, 15, yOffset + 18);
//             yOffset += 35;
//             break;

//           case "Switch":
//             ctx.fillText(component.label, 15, yOffset + 18);
//             rc.rectangle(110, yOffset, 40, 15, { roughness: 1 });
//             yOffset += 35;
//             break;

//           case "Slider":
//             ctx.fillText(component.label, 15, yOffset + 15);
//             rc.line(20, yOffset + 25, 130, yOffset + 25, { roughness: 1 });
//             yOffset += 40;
//             break;

//           case "Dropdown":
//             rc.rectangle(10, yOffset, 120, 30, { roughness: 1, fill: "#D3D3D3" });
//             ctx.fillText(component.label, 15, yOffset + 20);
//             yOffset += 40;
//             break;

//           case "ChatBubble":
//             rc.rectangle(10, yOffset, 130, 35, { roughness: 1, fill: "#F5F5DC" });
//             ctx.fillText(component.sender + ": " + component.message, 15, yOffset + 20);
//             yOffset += 45;
//             break;

//           case "Avatar":
//             rc.circle(35, yOffset + 20, 40, { roughness: 1, fill: "#87CEEB" });
//             ctx.fillText("Avatar", 15, yOffset + 50);
//             yOffset += 60;
//             break;

//           case "Calendar":
//             rc.rectangle(10, yOffset, 120, 60, { roughness: 1, fill: "#F0E68C" });
//             ctx.fillText("Calendar", 15, yOffset + 30);
//             yOffset += 70;
//             break;

//           case "Tabs":
//             component.items.forEach((item, index) => {
//               rc.rectangle(10 + index * 60, yOffset, 55, 25, { roughness: 1, fill: "#D3D3D3" });
//               ctx.fillText(item, 20 + index * 60, yOffset + 18);
//             });
//             yOffset += 35;
//             break;

//           case "ProgressBar":
//             ctx.fillText(component.label, 15, yOffset + 15);
//             rc.rectangle(10, yOffset + 20, 120, 15, { roughness: 1 });
//             rc.rectangle(10, yOffset + 20, (component.value / 100) * 120, 15, { roughness: 1, fill: "blue" });
//             yOffset += 40;
//             break;

//           default:
//             ctx.fillText(`Unknown: ${component.type}`, 15, yOffset + 18);
//             yOffset += 30;
//             break;
//         }
//       });

//       yOffset += 20; // Space between screens
//     });
//   }, [wireframeData]);

//   return <canvas ref={canvasRef} width={180} height={600}></canvas>;
// };

// export default WireframeRenderer;



// import React, { useEffect, useRef, useState } from "react";
// import rough from "roughjs";

// const WireframeRenderer = ({ wireframeData }) => {
//   const canvasRef = useRef(null);
//   const [canvasSize, setCanvasSize] = useState({ width: 200, height: 400 });

//   useEffect(() => {
//     if (!wireframeData || !wireframeData.screens || !canvasRef.current) return;

//     const canvas = canvasRef.current;
//     const rc = rough.canvas(canvas);
//     const ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     let yOffset = 10; // Starting position
//     let maxWidth = 200; // Minimum width

//     wireframeData.screens.forEach((screen) => {
//       if (!screen.components || screen.components.length === 0) return;

//       // Screen Title
//       rc.rectangle(5, yOffset, 140, 30, { roughness: 1.2, fill: "#b3e5fc" });
//       ctx.font = "bold 14px Arial";
//       ctx.fillStyle = "#000";
//       ctx.fillText(screen.name, 10, yOffset + 20);
//       yOffset += 50;

//       screen.components.forEach((component) => {
//         if (yOffset + 40 > canvas.height) return; // Prevent overflow
//         ctx.font = "12px Arial";
//         ctx.fillStyle = "#000";

//         switch (component.type) {
//           case "Button":
//             rc.rectangle(10, yOffset, 120, 30, { roughness: 1, fill: "#ADD8E6" });
//             ctx.fillText(component.label, 40, yOffset + 20);
//             yOffset += 40;
//             break;

//           case "TextField":
//             rc.rectangle(10, yOffset, 120, 25, { roughness: 1, fill: "#D3D3D3" });
//             ctx.fillText(component.label, 15, yOffset + 18);
//             yOffset += 35;
//             break;

//           case "Switch":
//             ctx.fillText(component.label, 15, yOffset + 18);
//             rc.rectangle(110, yOffset, 40, 15, { roughness: 1 });
//             yOffset += 35;
//             break;

//           case "Slider":
//             ctx.fillText(component.label, 15, yOffset + 15);
//             rc.line(20, yOffset + 25, 130, yOffset + 25, { roughness: 1 });
//             yOffset += 40;
//             break;

//           case "Dropdown":
//             rc.rectangle(10, yOffset, 120, 30, { roughness: 1, fill: "#D3D3D3" });
//             ctx.fillText(component.label, 15, yOffset + 20);
//             yOffset += 40;
//             break;

//           case "ChatBubble":
//             rc.rectangle(10, yOffset, 130, 35, { roughness: 1, fill: "#F5F5DC" });
//             ctx.fillText(component.sender + ": " + component.message, 15, yOffset + 20);
//             yOffset += 45;
//             break;

//           case "Avatar":
//             rc.circle(35, yOffset + 20, 40, { roughness: 1, fill: "#87CEEB" });
//             ctx.fillText("Avatar", 15, yOffset + 50);
//             yOffset += 60;
//             break;

//           case "Calendar":
//             rc.rectangle(10, yOffset, 120, 60, { roughness: 1, fill: "#F0E68C" });
//             ctx.fillText("Calendar", 15, yOffset + 30);
//             yOffset += 70;
//             break;

//           case "Tabs":
//             component.items.forEach((item, index) => {
//               rc.rectangle(10 + index * 60, yOffset, 55, 25, { roughness: 1, fill: "#D3D3D3" });
//               ctx.fillText(item, 20 + index * 60, yOffset + 18);
//             });
//             yOffset += 35;
//             break;

//           case "ProgressBar":
//             ctx.fillText(component.label, 15, yOffset + 15);
//             rc.rectangle(10, yOffset + 20, 120, 15, { roughness: 1 });
//             rc.rectangle(10, yOffset + 20, (component.value / 100) * 120, 15, { roughness: 1, fill: "blue" });
//             yOffset += 40;
//             break;

//           default:
//             ctx.fillText(`Unknown: ${component.type}`, 15, yOffset + 18);
//             yOffset += 30;
//             break;
//         }
//       });

//       yOffset += 20; // Space between screens
//     });

//     // Adjust canvas size dynamically
//     setCanvasSize({ width: maxWidth, height: Math.min(yOffset + 20, 600) });

//   }, [wireframeData]);

//   useEffect(() => {
//     if (!canvasRef.current) return;
//     const canvas = canvasRef.current;
//     canvas.width = canvasSize.width;
//     canvas.height = canvasSize.height;
//   }, [canvasSize]);

//   return (
//     <canvas
//       ref={canvasRef}
//       width={canvasSize.width}
//       height={canvasSize.height}
//       style={{ border: "1px solid #ccc", borderRadius: "8px", background: "#fafafa" }}
//     />
//   );
// };

// export default WireframeRenderer;
