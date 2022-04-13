import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Text, Circle, Group, Line } from "react-konva";

interface Point{
  x: number;
  y: number;
}

const getCrossSection = (board: number[], width: number, loc: number) => {
  const rowStart = Math.floor(loc / width) * width;

  const output = [];

  for(let i = loc + 1; i < rowStart + width; i++) {
      if(board[i] === 0) {
        continue;
      } else if (board[i] > 0) {
        output.push(i);
        break;
      }
  }

  for(let i = loc - 1; i >= rowStart; i--) {
    if(board[i] === 0) {
      continue;
    } else if (board[i] > 0) {
      output.push(i);
      break;
    }
  }

  for(let i = loc + width; i < board.length; i += width) {
    if(board[i] === 0) {
      continue;
    } else if (board[i] > 0) {
      output.push(i);
      break;
    }
  }

  for(let i = loc - width; i > 0; i -= width) {
    if(board[i] === 0) {
      continue;
    } else if (board[i] > 0) {
      output.push(i);
      break;
    }
  }

  return output;
};

const Game = () => {
  const [gameData, setGameData] = useState({
    difficulty: 2,
    boardSize: 5,
    timeLimit: 10,
    seed: "",
    board: [

      [2, 1, 1, 0, 1],
      [0, 3, 0, 1, 0],
      [2, 0, 1, 0, 0],
      [2, 0, 1, 0, 1],
      [2, 0, 1, 0, 1],
    ],
    boardResult: [],
  });

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
  }, [width, height]);

  const INITIAL_STATE = generateShapes();
  const [shapes, setShapes] = useState(INITIAL_STATE);

  function generateShapes() {
    arr = gameData.board.reduce((acc, curr) => acc.concat(curr), []);
    const nodes = arr.map((value, index) => {
      return {
        id: index,
        value: value,
        radius: width / gameData.boardSize / 4,
        x:
          ((index % gameData.boardSize) * width) / gameData.boardSize +
          width / gameData.boardSize / 2,
        y:
          (Math.floor(index / gameData.boardSize) * height) /
            gameData.boardSize +
          width / gameData.boardSize / 2,
        fontSize: width / gameData.boardSize / 10,
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
              hoveredNode >= 0 ? 
                getCrossSection(arr, gameData.boardSize, hoveredNode).map(
                  (node) =>     
                  <Line
                    points={[shapes[hoveredNode].x, shapes[hoveredNode].y, shapes[node].x, shapes[node].y ]}
                    stroke= 'yellow'
                    strokeWidth={20}
                  />
                )
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
                    onMouseLeave={() => {setHoveredNode(-1);}}
                  />
                  <Text text={shape.value.toString()} 
                    x={shape.x} 
                    y={shape.y} 
                    fontSize={shape.fontSize}
                    offsetX={shape.fontSize/4}
                    offsetY={shape.fontSize/3}
                    zIndex={1}
                    onMouseEnter={() => {
                      setHoveredNode(index);
                    }}
                    onMouseLeave={() => {setHoveredNode(-1);}}
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
