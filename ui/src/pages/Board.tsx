import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Text, Circle, Group, Line } from "react-konva";
import { useSelector } from "react-redux";
import { Bridge } from "../interfaces/IRoomAndBoard";
import { useAppDispatch } from "../store/hooks";
import { RootState } from "../store/store";
import {
  updateMove,
  deleteBridge,
  increaseValueOnBridge,
} from "./../store/RoomGameSlice";
import cloneDeep from "lodash/cloneDeep";

const getPossibleNodes = (
  board: number[],
  width: number,
  loc: number,
  checkBridge: boolean = false
) => {
  const rowStart = Math.floor(loc / width) * width;

  const output: number[] = [];

  for (let i = loc + 1; i < rowStart + width; i++) {
    if (board[i] === 0) {
      continue;
    } else if (board[i] > 0) {
      output.push(i);
      break;
    } else if (board[i] === -1 && !checkBridge) {
      break;
    }
  }

  for (let i = loc - 1; i >= rowStart; i--) {
    if (board[i] === 0) {
      continue;
    } else if (board[i] > 0) {
      output.push(i);
      break;
    } else if (board[i] === -1 && !checkBridge) {
      break;
    }
  }

  for (let i = loc + width; i < board.length; i += width) {
    if (board[i] === 0) {
      continue;
    } else if (board[i] > 0) {
      output.push(i);
      break;
    } else if (board[i] === -1 && !checkBridge) {
      break;
    }
  }

  for (let i = loc - width; i > 0; i -= width) {
    if (board[i] === 0) {
      continue;
    } else if (board[i] > 0) {
      output.push(i);
      break;
    } else if (board[i] === -1 && !checkBridge) {
      break;
    }
  }

  return output;
};

const Board = () => {
  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);
  const dispatch = useAppDispatch();

  const [board, setBoard] = useState(
    roomAndBoard.array.reduce(
      (acc: number[], curr: number) => acc.concat(curr),
      []
    )
  );

  const [hoveredNode, setHoveredNode] = useState<number>(-1);

  const [lastNode, setLastNode] = useState<number>(-1);

  const [width, setWidth] = useState<number>(-1);
  const stageCanvasRef = useRef(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
      setWidth(event[0].contentBoxSize[0].inlineSize);
      setShapes(generateShapes(event[0].contentBoxSize[0].inlineSize));
    });

    if (stageCanvasRef.current) {
      resizeObserver.observe(stageCanvasRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [stageCanvasRef]);

  const [shapes, setShapes] = useState(generateShapes(width));

  useEffect(() => {
    setShapes(shapes);
    console.log("zmiana wielkosci, albo klick");
  }, [lastNode, width]);

  function generateShapes(parentWidht: number) {
    if (parentWidht === -1) {
      return [];
    }
    const nodes = roomAndBoard.array.map((value: any, index: number) => {
      return {
        id: index,
        value: value,
        radius: parentWidht / roomAndBoard.settings.size / 2,
        x:
          ((index % roomAndBoard.settings.size) * parentWidht) /
          roomAndBoard.settings.size +
          parentWidht / roomAndBoard.settings.size / 2,
        y:
          (Math.floor(index / roomAndBoard.settings.size) * parentWidht) /
          roomAndBoard.settings.size +
          parentWidht / roomAndBoard.settings.size / 2,
        fontSize: parentWidht / roomAndBoard.settings.size / 3,
        isSelected: false,
        color: "white",
      };
    });
    return nodes;
  }

  function drawLine(index: number) {
    let indexToRemember = lastNode;
    if (lastNode === -1) {
      shapes[index].isSelected = true;
      setLastNode(index);
      return;
    } else if (lastNode === index) {
      shapes[index].isSelected = false;
      setLastNode(-1);
      return;
    } else {
      shapes[lastNode].isSelected = false;
      shapes[index].isSelected = true;
      getPossibleNodes(
        board,
        roomAndBoard.settings.size,
        indexToRemember,
        true
      ).map((node) => {
        if (node === index) {
          let line: Bridge | undefined = cloneDeep(
            roomAndBoard.bridges.find(
              (line) =>
                (line.nodeFrom === indexToRemember && line.nodeTo === node) ||
                (line.nodeFrom === node && line.nodeTo === indexToRemember)
            )
          );
          if (line) {
            line.value += 1;
            if (line.value >= 3) {
              let [smaller, bigger] = [indexToRemember, node];
              if (bigger < smaller) {
                [smaller, bigger] = [bigger, smaller];
              }
              const isVertical =
                smaller % roomAndBoard.settings.size ===
                bigger % roomAndBoard.settings.size;
              console.log(isVertical);
              if (!isVertical) {
                const tempBridges = [...board];
                for (let i = smaller + 1; i < bigger; i++) {
                  tempBridges[i] = 0;
                }
                console.log("horyzontalnie - naprawa");
                console.log(tempBridges);
                setBoard(tempBridges);
              } else {
                const tempBridges = [...board];
                for (
                  let i = smaller + roomAndBoard.settings.size;
                  i < bigger - roomAndBoard.settings.size + 1;
                  i += roomAndBoard.settings.size
                ) {
                  tempBridges[i] = 0;
                }
                console.log("werykalnie - naprawa");
                console.log(tempBridges);
                setBoard(tempBridges);
              }
              dispatch(deleteBridge(line));
            } else {
              dispatch(increaseValueOnBridge(line));
            }
          } else {
            let [smaller, bigger] = [indexToRemember, node];
            if (bigger < smaller) {
              [smaller, bigger] = [bigger, smaller];
            }
            const isVertical =
              smaller % roomAndBoard.settings.size ===
              bigger % roomAndBoard.settings.size;
            console.log(isVertical);
            if (!isVertical) {
              const tempBridges = [...board];
              for (let i = smaller + 1; i < bigger; i++) {
                if (tempBridges[i] === -1) {
                  return;
                }
                tempBridges[i] = -1;
              }
              console.log("horyzontalnie");
              console.log(tempBridges);
              setBoard(tempBridges);
            } else {
              const tempBridges = [...board];
              for (
                let i = smaller + roomAndBoard.settings.size;
                i < bigger - roomAndBoard.settings.size + 1;
                i += roomAndBoard.settings.size
              ) {
                if (tempBridges[i] === -1) {
                  return;
                }
                tempBridges[i] = -1;
              }
              console.log("werykalnie");
              console.log(tempBridges);
              setBoard(tempBridges);
            }
            dispatch(
              updateMove([
                ...roomAndBoard.bridges,
                {
                  nodeFrom: indexToRemember,
                  nodeTo: node,
                  value: 1,
                },
              ])
            );
          }
        }
      });
      setLastNode(index);
      return;
    }
  }

  return (
    <>
      <div
        style={{
          width: "100%",
          border: "1px solid grey",
          margin: "auto",
          maxWidth: "800px",
        }}
        ref={stageCanvasRef}
      >
        <Stage width={width + 10} height={width + 10}>
          <Layer>
            {hoveredNode >= 0
              ? getPossibleNodes(
                board,
                roomAndBoard.settings.size,
                hoveredNode
              ).map((node) => (
                <Line
                  key={node}
                  points={[
                    shapes[hoveredNode].x,
                    shapes[hoveredNode].y,
                    shapes[node].x,
                    shapes[node].y,
                  ]}
                  stroke="yellow"
                  strokeWidth={20}
                />
              ))
              : null}
            {roomAndBoard.bridges.map((line: Bridge, index: number) => {
              if (line.value === 1) {
                return (
                  <Line
                    key={index}
                    points={[
                      shapes[line.nodeFrom]?.x,
                      shapes[line.nodeFrom]?.y,
                      shapes[line.nodeTo]?.x,
                      shapes[line.nodeTo]?.y,
                    ]}
                    stroke="black"
                    strokeWidth={3}
                  />
                );
              } else if (line.value === 2) {
                return (
                  <>
                    <Line
                      // key={index}
                      points={[
                        shapes[line.nodeFrom].x -
                        shapes[line.nodeFrom].radius / 4,
                        shapes[line.nodeFrom].y -
                        shapes[line.nodeFrom].radius / 4,
                        shapes[line.nodeTo].x -
                        shapes[line.nodeFrom].radius / 4,
                        shapes[line.nodeTo].y -
                        shapes[line.nodeFrom].radius / 4,
                      ]}
                      stroke="black"
                      strokeWidth={3}
                    />
                    <Line
                      // key={index}
                      points={[
                        shapes[line.nodeFrom].x +
                        shapes[line.nodeFrom].radius / 4,
                        shapes[line.nodeFrom].y +
                        shapes[line.nodeFrom].radius / 4,
                        shapes[line.nodeTo].x +
                        shapes[line.nodeFrom].radius / 4,
                        shapes[line.nodeTo].y +
                        shapes[line.nodeFrom].radius / 4,
                      ]}
                      stroke="black"
                      strokeWidth={3}
                    />
                  </>
                );
              }
            })}

            {shapes.map((shape: any, index: number) =>
              shape.value !== 0 ? (
                <Group key={shape.id}>
                  <Circle
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    radius={shape.radius}
                    stroke="black"
                    fill={(() => {
                      // add different colors based on amount of bridges
                      const connections = roomAndBoard.bridges
                        .filter(
                          (line) =>
                            line.nodeFrom === shape.id ||
                            line.nodeTo === shape.id
                        )
                        .reduce((acc, curr) => acc + curr.value, 0);
                      if (shape.isSelected) {
                        shape.color = "blue";
                        return "blue";
                      } else if (connections > shape.value) {
                        return "red";
                      } else if (connections === shape.value) {
                        return "green";
                      } else return "white";
                    })()}
                    onMouseOver={() => {
                      setHoveredNode(index);
                    }}
                    onMouseLeave={() => {
                      setHoveredNode(-1);
                    }}
                    onMouseUp={() => drawLine(index)}
                  />
                  <Text
                    text={shape.value.toString()}
                    x={shape.x}
                    y={shape.y}
                    fontSize={shape.fontSize}
                    offsetX={shape.fontSize / 4}
                    offsetY={shape.fontSize / 3}
                    onMouseEnter={() => {
                      setHoveredNode(index);
                    }}
                    onMouseLeave={() => {
                      setHoveredNode(-1);
                    }}
                    onMouseUp={() => drawLine(index)}
                  />
                </Group>
              ) : null
            )}
          </Layer>
        </Stage>
      </div>
    </>
  );
};

export default Board;