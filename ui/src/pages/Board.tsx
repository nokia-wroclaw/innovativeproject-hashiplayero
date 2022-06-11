import { useState, useEffect, useRef } from "react";
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
import ParseBridgesModel from "../services/ParseBridgesModel";

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

  for (let i = loc - width; i >= 0; i -= width) {
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

const Board = ({
  gameEnded,
  disableHints,
  disableColors,
}: {
  gameEnded: boolean;
  disableHints: boolean;
  disableColors: boolean;
}) => {
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
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
  const [numberOfNodes, setNumberOfNodes] = useState<number>(-1);

  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [isCrossed, setIsCrossed] = useState<boolean[]>(
    Array(board.length).fill(false)
  );

  const [width, setWidth] = useState<number>(-1);
  const stageCanvasRef = useRef(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
      setWidth(event[0].contentBoxSize[0].inlineSize);
      setShapes(generateShapes(event[0].contentBoxSize[0].inlineSize));
      countNodes();
    });

    if (stageCanvasRef.current) {
      resizeObserver.observe(stageCanvasRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [stageCanvasRef]);

  const [shapes, setShapes] = useState(generateShapes(width));

  const countNodes = () => {
    let counter = 0;
    roomAndBoard.array.forEach((value: any) => {
      if (value > 0) {
        counter++;
      }
    });
    setNumberOfNodes(counter);
  };

  const updateShapes = () => {
    const newShapes = cloneDeep(shapes);
    newShapes.forEach((shape: any, index: number) => {
      shape.x =
        ((index % roomAndBoard.settings.size) * width) /
          roomAndBoard.settings.size +
        width / roomAndBoard.settings.size / 2;
      shape.y =
        (Math.floor(index / roomAndBoard.settings.size) * width) /
          roomAndBoard.settings.size +
        width / roomAndBoard.settings.size / 2;
      shape.fontSize = width / roomAndBoard.settings.size / 3;
      shape.radius = width / roomAndBoard.settings.size / 2 - 2;
    });
    setShapes(newShapes);
  };

  useEffect(() => {
    updateShapes();
    let counter: number = 0;
    shapes.map((shape: any) => {
      if (shape.color === "green") {
        counter++;
      }
    });
    if (counter >= numberOfNodes - 2 || counter >= numberOfNodes - 3) {
      handleCheckBoard();
    }
  }, [lastNode, width, isChanged, disableColors]);

  const handleCheckBoard = () => {
    if (webSocket !== undefined && webSocket?.readyState !== 0) {
      webSocket?.send(
        JSON.stringify({
          action: "checkBoard",
          data: {
            moves: ParseBridgesModel(roomAndBoard.bridges),
          },
        })
      );
    }
  };

  function generateShapes(parentWidht: number) {
    if (parentWidht === -1) {
      return [];
    }
    const nodes = roomAndBoard.array.map((value: any, index: number) => {
      return {
        id: index,
        value: value,
        radius: parentWidht / roomAndBoard.settings.size / 2 - 2,
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
        isCrossed: isCrossed[index],
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
      const newIsCrossed = cloneDeep(isCrossed);
      newIsCrossed[index] = !newIsCrossed[index];
      shapes[index].isCrossed = newIsCrossed[index];
      setIsCrossed(newIsCrossed);
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
            updateLine(line, indexToRemember, node);
          } else {
            let [smaller, bigger] = [indexToRemember, node];
            if (bigger < smaller) {
              [smaller, bigger] = [bigger, smaller];
            }
            const isVertical =
              smaller % roomAndBoard.settings.size ===
              bigger % roomAndBoard.settings.size;
            if (!isVertical) {
              const tempBridges = [...board];
              for (let i = smaller + 1; i < bigger; i++) {
                if (tempBridges[i] === -1) {
                  return;
                }
                tempBridges[i] = -1;
              }
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
      shapes[lastNode].isSelected = false;
      shapes[index].isSelected = false;
      setLastNode(-1);
      return;
    }
  }

  const clickOutside = (e: any) => {
    const emptySpace = e.target === e.target.getStage();
    if (!emptySpace) {
      return;
    }
    if (!gameEnded) {
      shapes.map((shape: any) => {
        if (shape.id === lastNode) {
          shape.isSelected = false;
          const connections = roomAndBoard.bridges
            .filter(
              (line) => line.nodeFrom === shape.id || line.nodeTo === shape.id
            )
            .reduce((acc, curr) => acc + curr.value, 0);
          if (shape.isSelected) {
            shape.color = "blue";
          } else if (connections > shape.value) {
            shape.color = "red";
          } else if (connections === shape.value) {
            shape.color = "green";
          } else {
            shape.color = "white";
          }
        }
      });
      setLastNode(-1);
    }
  };

  const updateLine = (line: Bridge, indexToRemember: number, node: number) => {
    if (gameEnded) {
      return;
    }
    let newLine = cloneDeep(line);
    newLine.value += 1;
    if (newLine.value >= 3) {
      let [smaller, bigger] = [indexToRemember, node];
      if (bigger < smaller) {
        [smaller, bigger] = [bigger, smaller];
      }
      const isVertical =
        smaller % roomAndBoard.settings.size ===
        bigger % roomAndBoard.settings.size;
      if (!isVertical) {
        const tempBridges = [...board];
        for (let i = smaller + 1; i < bigger; i++) {
          tempBridges[i] = 0;
        }
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
        setBoard(tempBridges);
      }
      dispatch(deleteBridge(newLine));
    } else {
      dispatch(increaseValueOnBridge(newLine));
    }
    setIsChanged(!isChanged);
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          margin: "auto",
          maxWidth: "800px",
          borderRadius: "10px",
          backgroundColor: "white",
          padding: "12px",
          boxShadow: "1px 2px 10px 0px rgba(0,0,0,0.75)",
        }}
        ref={stageCanvasRef}
      >
        <Stage
          width={width}
          height={width}
          captureTouchEventsEnabled={true}
          onClick={(e) => {
            clickOutside(e);
          }}
          onTap={(e) => {
            clickOutside(e);
          }}
          key={`stage_${Math.random().toString}`}
        >
          <Layer>
            {hoveredNode >= 0 && disableHints && !gameEnded
              ? getPossibleNodes(
                  board,
                  roomAndBoard.settings.size,
                  hoveredNode
                ).map((node, index) => (
                  <Line
                    key={`${index.toString()}${Math.random().toString}`}
                    points={
                      shapes?.length !== undefined
                        ? [
                            shapes[hoveredNode]?.x,
                            shapes[hoveredNode]?.y,
                            shapes[node]?.x,
                            shapes[node]?.y,
                          ]
                        : []
                    }
                    stroke="yellow"
                    strokeWidth={20}
                  />
                ))
              : null}
            {roomAndBoard.bridges.map((line: Bridge, index: number) => {
              if (line.value === 1) {
                return (
                  <>
                    <Line
                      key={`${index.toString()}_first_one_line_${
                        Math.random().toString
                      }`}
                      points={
                        shapes !== undefined
                          ? [
                              shapes[line.nodeFrom]?.x,
                              shapes[line.nodeFrom]?.y,
                              shapes[line.nodeTo]?.x,
                              shapes[line.nodeTo]?.y,
                            ]
                          : []
                      }
                      stroke="black"
                      strokeWidth={3}
                    />
                    <Line
                      key={`${index.toString()}_second_one_line${
                        Math.random().toString
                      }`}
                      points={
                        shapes !== undefined
                          ? [
                              shapes[line.nodeFrom]?.x,
                              shapes[line.nodeFrom]?.y,
                              shapes[line.nodeTo]?.x,
                              shapes[line.nodeTo]?.y,
                            ]
                          : []
                      }
                      stroke="rgba(255, 255, 255, 0.0)"
                      strokeWidth={shapes[0]?.radius * 1.25}
                      onClick={(e) => {
                        updateLine(line, line.nodeFrom, line.nodeTo);
                      }}
                      onTap={(e) => {
                        updateLine(line, line.nodeFrom, line.nodeTo);
                      }}
                    />
                  </>
                );
              } else if (line.value === 2) {
                return (
                  <>
                    <Line
                      key={`${index.toString()}_first_two_line${
                        Math.random().toString
                      }`}
                      points={
                        shapes !== undefined
                          ? [
                              shapes[line.nodeFrom]?.x -
                                shapes[line.nodeFrom]?.radius / 4,
                              shapes[line.nodeFrom]?.y -
                                shapes[line.nodeFrom]?.radius / 4,
                              shapes[line.nodeTo]?.x -
                                shapes[line.nodeFrom]?.radius / 4,
                              shapes[line.nodeTo]?.y -
                                shapes[line.nodeFrom]?.radius / 4,
                            ]
                          : []
                      }
                      stroke="black"
                      strokeWidth={3}
                    />
                    <Line
                      key={`${index.toString()}_second_two_line${
                        Math.random().toString
                      }`}
                      points={
                        shapes !== undefined
                          ? [
                              shapes[line.nodeFrom]?.x +
                                shapes[line.nodeFrom]?.radius / 4,
                              shapes[line.nodeFrom]?.y +
                                shapes[line.nodeFrom]?.radius / 4,
                              shapes[line.nodeTo]?.x +
                                shapes[line.nodeFrom]?.radius / 4,
                              shapes[line.nodeTo]?.y +
                                shapes[line.nodeFrom]?.radius / 4,
                            ]
                          : []
                      }
                      stroke="black"
                      strokeWidth={3}
                    />
                    <Line
                      key={`${index.toString()}_third_two_line${
                        Math.random().toString
                      }`}
                      points={
                        shapes !== undefined
                          ? [
                              shapes[line.nodeFrom]?.x,
                              shapes[line.nodeFrom]?.y,
                              shapes[line.nodeTo]?.x,
                              shapes[line.nodeTo]?.y,
                            ]
                          : []
                      }
                      stroke="rgba(255, 255, 255, 0.0)"
                      strokeWidth={shapes[0]?.radius * 1.25}
                      onClick={(e) => {
                        updateLine(line, line.nodeFrom, line.nodeTo);
                      }}
                      onTap={(e) => {
                        updateLine(line, line.nodeFrom, line.nodeTo);
                      }}
                    />
                  </>
                );
              } else {
                return;
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
                      const connections = roomAndBoard.bridges
                        .filter(
                          (line) =>
                            line.nodeFrom === shape.id ||
                            line.nodeTo === shape.id
                        )
                        .reduce((acc, curr) => acc + curr.value, 0);
                      if (shape.isSelected) {
                        shape.color = "blue";
                        return "#5452E4";
                      } else if (connections > shape.value) {
                        shape.color = "red";
                        if (!disableColors) {
                          return "white";
                        }
                        return "#dd2c00";
                      } else if (connections === shape.value) {
                        shape.color = "green";
                        if (!disableColors) {
                          return "white";
                        }
                        return "#76ff03";
                      } else {
                        shape.color = "white";
                        return "white";
                      }
                    })()}
                    onMouseDown={(e) => {
                      if (!gameEnded) {
                        setLastNode(index);
                        shape.isSelected = true;
                      }
                    }}
                    onMouseUp={(e) => {
                      if (!gameEnded) {
                        drawLine(index);
                      }
                    }}
                    onTouchStart={() => {
                      if (!gameEnded) {
                        setLastNode(index);
                        shape.isSelected = true;
                      }
                    }}
                    onTouchEnd={() => {
                      if (!gameEnded) {
                        drawLine(index);
                      }
                    }}
                    onMouseLeave={() => {
                      if (!gameEnded) {
                        setHoveredNode(-1);
                      }
                    }}
                    onMouseOver={() => {
                      if (!gameEnded) {
                        setHoveredNode(index);
                      }
                    }}
                  />
                  <Text
                    text={shape.value.toString()}
                    x={shape.x}
                    y={shape.y}
                    fontSize={shape.fontSize}
                    offsetX={shape.fontSize / 4}
                    offsetY={shape.fontSize / 3}
                    onMouseDown={(e) => {
                      if (!gameEnded) {
                        setLastNode(index);
                        shape.isSelected = true;
                      }
                    }}
                    onMouseUp={(e) => {
                      if (!gameEnded) {
                        drawLine(index);
                      }
                    }}
                    onTouchStart={() => {
                      if (!gameEnded) {
                        setLastNode(index);
                        shape.isSelected = true;
                      }
                    }}
                    onTouchEnd={() => {
                      if (!gameEnded) {
                        drawLine(index);
                      }
                    }}
                    onMouseLeave={() => {
                      if (!gameEnded) {
                        setHoveredNode(-1);
                      }
                    }}
                    onMouseOver={() => {
                      if (!gameEnded) {
                        setHoveredNode(index);
                      }
                    }}
                  />
                </Group>
              ) : null
            )}

            {isCrossed.map((isCross: boolean, index: number) => {
              if (isCross) {
                return (
                  <Line
                    points={
                      shapes !== undefined
                        ? [
                            shapes[index]?.x - shapes[index]?.radius * 0.8,
                            shapes[index]?.y - shapes[index]?.radius * 0.8,
                            shapes[index]?.x + shapes[index]?.radius * 0.8,
                            shapes[index]?.y + shapes[index]?.radius * 0.8,
                          ]
                        : []
                    }
                    stroke="black"
                    strokeWidth={3}
                  />
                );
              }
            })}
          </Layer>
        </Stage>
      </div>
    </>
  );
};

export default Board;
