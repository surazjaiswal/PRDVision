import React, { useEffect, useRef } from "react";
import { Stage, Layer, Rect, Text, Circle, Line, Group } from "react-konva";

const UIComponentRenderer = ({ wireframeData }) => {
  const stageRef = useRef(null);

  const SCREEN_WIDTH = 300;
  const SCREEN_HEIGHT = 600;
  const PADDING = 20;
  const ELEMENT_SPACING = 15;
  const ELEMENT_HEIGHT = 40;

  let yOffset = PADDING;

  return (
    <Stage width={SCREEN_WIDTH} height={SCREEN_HEIGHT} ref={stageRef}>
      <Layer>
        {wireframeData?.screens?.map((screen, screenIndex) => {
          let elements = [];
          let xOffset = PADDING;
          yOffset += ELEMENT_SPACING;

          // Render screen title
          elements.push(
            <Text
              key={`screen-title-${screenIndex}`}
              text={screen.name}
              fontSize={16}
              fontStyle="bold"
              fill="black"
              x={xOffset}
              y={yOffset}
            />
          );

          yOffset += ELEMENT_HEIGHT;

          screen.components.forEach((component, index) => {
            let element;
            switch (component.type) {
              case "Button":
                element = (
                  <Group key={`button-${index}`}>
                    <Rect
                      x={xOffset}
                      y={yOffset}
                      width={200}
                      height={ELEMENT_HEIGHT}
                      fill="#ADD8E6"
                      cornerRadius={8}
                    />
                    <Text
                      text={component.label}
                      fontSize={14}
                      fill="black"
                      x={xOffset + 60}
                      y={yOffset + 12}
                    />
                  </Group>
                );
                break;

              case "TextField":
                element = (
                  <Group key={`textfield-${index}`}>
                    <Rect
                      x={xOffset}
                      y={yOffset}
                      width={200}
                      height={ELEMENT_HEIGHT - 5}
                      fill="#D3D3D3"
                      cornerRadius={5}
                    />
                    <Text
                      text={component.label}
                      fontSize={14}
                      fill="black"
                      x={xOffset + 10}
                      y={yOffset + 10}
                    />
                  </Group>
                );
                break;

              case "Switch":
                element = (
                  <Group key={`switch-${index}`}>
                    <Text
                      text={component.label}
                      fontSize={14}
                      fill="black"
                      x={xOffset}
                      y={yOffset + 10}
                    />
                    <Rect
                      x={xOffset + 160}
                      y={yOffset}
                      width={50}
                      height={20}
                      stroke="black"
                      cornerRadius={10}
                    />
                  </Group>
                );
                break;

              case "Slider":
                element = (
                  <Group key={`slider-${index}`}>
                    <Text
                      text={component.label}
                      fontSize={14}
                      fill="black"
                      x={xOffset}
                      y={yOffset}
                    />
                    <Line
                      points={[xOffset, yOffset + 25, xOffset + 200, yOffset + 25]}
                      stroke="black"
                      strokeWidth={2}
                    />
                  </Group>
                );
                break;

              case "Dropdown":
                element = (
                  <Group key={`dropdown-${index}`}>
                    <Rect
                      x={xOffset}
                      y={yOffset}
                      width={200}
                      height={ELEMENT_HEIGHT}
                      fill="#D3D3D3"
                      cornerRadius={5}
                    />
                    <Text
                      text={component.label}
                      fontSize={14}
                      fill="black"
                      x={xOffset + 10}
                      y={yOffset + 10}
                    />
                  </Group>
                );
                break;

              case "ChatBubble":
                element = (
                  <Group key={`chatbubble-${index}`}>
                    <Rect
                      x={xOffset}
                      y={yOffset}
                      width={220}
                      height={ELEMENT_HEIGHT + 5}
                      fill="#F5F5DC"
                      cornerRadius={10}
                    />
                    <Text
                      text={`${component.sender}: ${component.message}`}
                      fontSize={14}
                      fill="black"
                      x={xOffset + 10}
                      y={yOffset + 10}
                    />
                  </Group>
                );
                break;

              case "Avatar":
                element = (
                  <Group key={`avatar-${index}`}>
                    <Circle x={xOffset + 20} y={yOffset + 20} radius={20} fill="#87CEEB" />
                    <Text text="Avatar" fontSize={12} fill="black" x={xOffset} y={yOffset + 45} />
                  </Group>
                );
                break;

              case "Calendar":
                element = (
                  <Group key={`calendar-${index}`}>
                    <Rect
                      x={xOffset}
                      y={yOffset}
                      width={200}
                      height={ELEMENT_HEIGHT * 2}
                      fill="#F0E68C"
                      cornerRadius={5}
                    />
                    <Text text="Calendar" fontSize={14} fill="black" x={xOffset + 10} y={yOffset + 20} />
                  </Group>
                );
                yOffset += ELEMENT_HEIGHT;
                break;

              case "Tabs":
                component.items.forEach((item, tabIndex) => {
                  elements.push(
                    <Group key={`tab-${index}-${tabIndex}`}>
                      <Rect
                        x={xOffset + tabIndex * 70}
                        y={yOffset}
                        width={60}
                        height={ELEMENT_HEIGHT - 10}
                        fill="#D3D3D3"
                        cornerRadius={5}
                      />
                      <Text
                        text={item}
                        fontSize={12}
                        fill="black"
                        x={xOffset + tabIndex * 70 + 10}
                        y={yOffset + 10}
                      />
                    </Group>
                  );
                });
                yOffset += ELEMENT_HEIGHT - 10;
                break;

              case "ProgressBar":
                element = (
                  <Group key={`progress-${index}`}>
                    <Rect
                      x={xOffset}
                      y={yOffset}
                      width={200}
                      height={15}
                      stroke="black"
                      cornerRadius={5}
                    />
                    <Rect
                      x={xOffset}
                      y={yOffset}
                      width={(component.value / 100) * 200}
                      height={15}
                      fill="blue"
                      cornerRadius={5}
                    />
                    <Text
                      text={`${component.label}: ${component.value}%`}
                      fontSize={12}
                      fill="black"
                      x={xOffset}
                      y={yOffset - 15}
                    />
                  </Group>
                );
                break;

              default:
                element = (
                  <Text
                    key={`unknown-${index}`}
                    text={`Unknown: ${component.type}`}
                    fontSize={14}
                    fill="red"
                    x={xOffset}
                    y={yOffset}
                  />
                );
                break;
            }

            elements.push(element);
            yOffset += ELEMENT_HEIGHT + ELEMENT_SPACING;
          });

          yOffset += ELEMENT_SPACING * 2; // Space between screens
          return elements;
        })}
      </Layer>
    </Stage>
  );
};

export default UIComponentRenderer;

