import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Text, Circle, Group, Line } from "react-konva";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Button } from "@mui/material";
import { useAppDispatch } from "../store/hooks";
import {
  changeAdmin,
  changeBoardCorrect,
  changeSingleGame,
} from "../store/StateMachineSlice";
import { useNavigate } from "react-router-dom";

interface Bridge {
  nodeFrom: number;
  nodeTo: number;
  value: number;
}

const getPossibleNodes = (board: number[], width: number, loc: number) => {
  const rowStart = Math.floor(loc / width) * width;

  const output: number[] = [];

  for (let i = loc + 1; i < rowStart + width; i++) {
    if (board[i] === 0) {
      continue;
    } else if (board[i] > 0) {
      output.push(i);
      break;
    }
  }

  for (let i = loc - 1; i >= rowStart; i--) {
    if (board[i] === 0) {
      continue;
    } else if (board[i] > 0) {
      output.push(i);
      break;
    }
  }

  for (let i = loc + width; i < board.length; i += width) {
    if (board[i] === 0) {
      continue;
    } else if (board[i] > 0) {
      output.push(i);
      break;
    }
  }

  for (let i = loc - width; i > 0; i -= width) {
    if (board[i] === 0) {
      continue;
    } else if (board[i] > 0) {
      output.push(i);
      break;
    }
  }

  return output;
};

const Game = () => {
  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
  const { user } = useSelector((state: RootState) => state.defaultUser);
  const { isBoardCorrect, inSingleGame, inWaitingRoom, isAdmin } = useSelector(
    (state: RootState) => state.StateMachine
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [lines, setLines] = useState([{}] as Bridge[]);

  let arr: number[] = [];

  const [hoveredNode, setHoveredNode] = useState<number>(-1);

  const [lastNode, setLastNode] = useState<number>(-1);

  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const stageCanvasRef = useRef(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
      setWidth(event[0].contentBoxSize[0].inlineSize);
      setHeight(event[0].contentBoxSize[0].inlineSize);
    });

    if (stageCanvasRef.current) {
      resizeObserver.observe(stageCanvasRef.current);
    }
  }, [stageCanvasRef]);

  const INITIAL_STATE = generateShapes();
  const [shapes, setShapes] = useState(INITIAL_STATE);

  useEffect(() => {
    setShapes(INITIAL_STATE);
    // setShapes(()=>[...shapes, ...generateShapes()]);
  }, [
    width,
    height,
    roomAndBoard.settings.size,
    roomAndBoard.array,
    INITIAL_STATE,
  ]);

  useEffect(() => {
    setShapes(shapes);
  }, [lastNode, shapes]);

  function generateShapes() {
    arr = roomAndBoard.array.reduce(
      (acc: number[], curr: number) => acc.concat(curr),
      []
    );
    const nodes = roomAndBoard.array.map((value: any, index: number) => {
      return {
        id: index,
        value: value,
        radius: width / roomAndBoard.settings.size / 2,
        x:
          ((index % roomAndBoard.settings.size) * width) /
            roomAndBoard.settings.size +
          width / roomAndBoard.settings.size / 2,
        y:
          (Math.floor(index / roomAndBoard.settings.size) * height) /
            roomAndBoard.settings.size +
          width / roomAndBoard.settings.size / 2,
        fontSize: width / roomAndBoard.settings.size / 3,
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
      getPossibleNodes(arr, roomAndBoard.settings.size, indexToRemember).map(
        (node) => {
          if (node === index) {
            const line = lines.find(
              (line) =>
                (line.nodeFrom === indexToRemember && line.nodeTo === node) ||
                (line.nodeFrom === node && line.nodeTo === indexToRemember)
            );
            if (line) {
              line.value = line.value + 1;
              if (line.value >= 3) {
                line.value = 0;
              }
            } else {
              let [smaller, bigger] = [indexToRemember, node];
              if (bigger < smaller) {
                [smaller, bigger] = [bigger, smaller];
              }
              const isHorizontal =
                Math.floor(smaller / width) === Math.floor(bigger / width);
              if (isHorizontal) {
                for (let i = smaller + 1; i < bigger - 1; i++) {
                  arr[i] = -1;
                }
              } else {
                for (let i = smaller + width; i < bigger - width; i += width) {
                  arr[i] = -1;
                }
              }
              setLines([
                ...lines,
                {
                  nodeFrom: indexToRemember,
                  nodeTo: node,
                  value: 1,
                },
              ]);
            }
          }
        }
      );
      setLastNode(index);
      return;
    }
  }

  const handleExitGame = () => {
    if (`webSocket` !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "changeRoom",
          userUuid: user.uuid,
          data: {
            roomName: "lobby",
            password: "",
          },
        })
      );
      dispatch(changeSingleGame(false));
      dispatch(changeBoardCorrect(false));
      dispatch(changeAdmin(false));
    }
  };

  const handleFinishGame = () => {
    if (`webSocket` !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "finishGame",
          userUuid: user.uuid,
          data: {
            name: roomAndBoard.name,
          },
        })
      );
      handleExitGame();
    }
  };

  const handleCheckBoard = () => {
    if (`webSocket` !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "checkBoard",
          userUuid: user.uuid,
          data: {
            moves: [],
          },
        })
      );
    }
  };

  useEffect(() => {
    //TODO:
    if (inSingleGame && !inWaitingRoom && !isAdmin) {
      navigate("/singleplay");
    }
    if (!inSingleGame && !inWaitingRoom && !isAdmin) {
      navigate("/");
    }
  }, [
    roomAndBoard,
    navigate,
    isBoardCorrect,
    inSingleGame,
    inWaitingRoom,
    isAdmin,
  ]);

  return (
    <>
      <div
        style={{
          width: "75%",
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
                  arr,
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
            {lines.map((line: Bridge, index: number) => {
              if (line.value === 1) {
                return (
                  <Line
                    key={index}
                    points={[
                      shapes[line.nodeFrom].x,
                      shapes[line.nodeFrom].y,
                      shapes[line.nodeTo].x,
                      shapes[line.nodeTo].y,
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
                      const connections = lines
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
      <div>
        <Button
          disabled={!isBoardCorrect}
          onClick={() => {
            handleFinishGame();
          }}
        >
          Finish Game
        </Button>
        <Button
          onClick={() => {
            handleExitGame();
          }}
        >
          Exit Game
        </Button>
        <Button
          onClick={() => {
            handleCheckBoard();
          }}
        >
          Check Board
        </Button>
      </div>
    </>
  );
};

export default Game;
