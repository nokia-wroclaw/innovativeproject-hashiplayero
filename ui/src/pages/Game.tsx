import { color } from "@mui/system";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Text, Circle, Group, Line } from "react-konva";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

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
  const { board, boardSize, boardResult } = useSelector(
    (state: RootState) => state.singleGame
  );

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
  }, [width, height, boardSize, board]);

  useEffect(() => {
    setShapes(shapes);
  }, [lastNode]);

  const handleCheckResult = () => {
    axios
      .post("http://localhost:3001/api/gameresult", {
        board: board,
        boardResult: boardResult,
      })
      .then((res) => {
        if (res.request.status === 200) {
          if (res.data.result) {
            console.log("WIN");
          } else {
            console.log("INCORRECT");
          }
        }
      })
      .catch((err) => console.log(err));
  };

  function generateShapes() {
    arr = board.reduce((acc: number[], curr: number) => acc.concat(curr), []);
    const nodes = board.map((value, index) => {
      return {
        id: index,
        value: value,
        radius: width / boardSize / 2,
        x: ((index % boardSize) * width) / boardSize + width / boardSize / 2,
        y:
          (Math.floor(index / boardSize) * height) / boardSize +
          width / boardSize / 2,
        fontSize: width / boardSize / 4,
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
      getPossibleNodes(arr, boardSize, indexToRemember).map((node) => {
        if (node === index) {
          console.log(node);
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
      });
      setLastNode(index);
      return;
    }
  }

  return (
    <>
      <div
        style={{ width: "50%", border: "1px solid grey", margin: "auto" }}
        ref={stageCanvasRef}
      >
        <Stage width={width} height={width}>
          <Layer>
          {
              hoveredNode >= 0 ? 
                getPossibleNodes(arr, gameData.boardSize, hoveredNode).map(
                  (node) => 
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
                        shapes[line.nodeFrom].x - shapes[line.nodeFrom].radius/4,
                        shapes[line.nodeFrom].y - shapes[line.nodeFrom].radius/4,
                        shapes[line.nodeTo].x - shapes[line.nodeFrom].radius/4,
                        shapes[line.nodeTo].y - shapes[line.nodeFrom].radius/4,
                      ]}
                      stroke="black"
                      strokeWidth={3}
                    />
                    <Line
                      // key={index}
                      points={[
                        shapes[line.nodeFrom].x + shapes[line.nodeFrom].radius/4,
                        shapes[line.nodeFrom].y + shapes[line.nodeFrom].radius/4,
                        shapes[line.nodeTo].x + shapes[line.nodeFrom].radius/4,
                        shapes[line.nodeTo].y + shapes[line.nodeFrom].radius/4,
                      ]}
                      stroke="black"
                      strokeWidth={3}
                    />
                  </>                    
                );
              }
            })}

            {shapes.map((shape, index) =>
              shape.value !== 0 ? (
                <Group key={shape.id}>
                  <Circle
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    radius={shape.radius}
                    stroke="black"
                    fill={(()=>{
                      // add different colors based on amount of bridges 
                      const connections = lines.filter((line)=>
                        line.nodeFrom === shape.id || line.nodeTo === shape.id
                      ).reduce((acc, curr)=> acc + curr.value, 0);
                      if (shape.isSelected){
                        return "yellow";
                      }
                      else if (connections > shape.value) {
                        return "red";
                      }
                      else if (connections === shape.value){
                        return "green";
                      }
                      else return "white";
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
                    zIndex={1}
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

export default Game;
