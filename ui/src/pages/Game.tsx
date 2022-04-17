import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Text, Circle, Group, Line } from "react-konva";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface Point {
  x: number;
  y: number;
}

const getCrossSection = (board: number[], width: number, loc: number) => {
  const rowStart = Math.floor(loc / width) * width;

  const output = [];

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

  let arr: number[] = [];

  const [hoveredNode, setHoveredNode] = useState(-1);

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
  
  useEffect(() => {
    setShapes(INITIAL_STATE);
  }, [width, height, boardSize, board]);

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

  const INITIAL_STATE = generateShapes();
  const [shapes, setShapes] = useState(INITIAL_STATE);

  function generateShapes() {
    arr = board.reduce((acc: number[], curr: number) => acc.concat(curr), []);
    const nodes = arr.map((value, index) => {
      return {
        id: index,
        value: value,
        radius: width / boardSize / 4,
        x: ((index % boardSize) * width) / boardSize + width / boardSize / 2,
        y:
          (Math.floor(index / boardSize) * height) / boardSize +
          width / boardSize / 2,
        fontSize: width / boardSize / 10,
        isSelected: true,
        isMovable: true,
        isHover: false,
        isConnected: false,
        offset: 10,
      };
    });

    return nodes;
  }

  return (
    <>
      <div
        style={{ width: "100%", border: "1px solid grey" }}
        ref={stageCanvasRef}
      >
        <Stage width={width} height={width}>
          <Layer>
            {
              // line = {from: {x: 0, y: 0}, to: {x: 0, y: 0}}
              // połączenie wartość: -1
              hoveredNode >= 0
                ? getCrossSection(arr, boardSize, hoveredNode).map((node) => (
                    <Line
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
                : null
            }
            {shapes.map((shape, index) =>
              shape.value !== 0 ? (
                <Group key={shape.id}>
                  <Circle
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    radius={shape.radius}
                    stroke="black"
                    fill="white"
                    onMouseOver={() => {
                      setHoveredNode(index);
                    }}
                    onMouseLeave={() => {
                      setHoveredNode(-1);
                    }}
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
