import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Text, Circle, Group, Line } from "react-konva";

interface Line{
  nodeFrom : number;
  nodeTo : number;
  value : number;
}

const getPossibleNodes = (board: number[], width: number, loc: number) => {
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
    boardSize: 6,
    timeLimit: 10,
    seed: "",
    board: [
      [8, 1, 1, 0, 1,2],
      [2, 0, 0, 1, 0,1],
      [2, 0, 1, 0, 1,1],
      [2, 0, 1, 0, 1,1],
      [2, 0, 1, 0, 1,1],
      [2, 0, 1, 0, 1,1],
    ],
    boardResult: [],
  });

  const [lines, setLines] = useState([{
    nodeFrom: 1,
    nodeTo: 2,
    value: 1,
  }, {
    nodeFrom: 16,
    nodeTo: 4,
    value: 1,
  }] as Line[]);

  let arr: number[] = [];

  const [hoveredNode, setHoveredNode] = useState(-1);

  const [lastNode, setLastNode] = useState(-1);

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
        isSelected: false,
        color: 'white',
      };
    });

    return nodes;
  }

  function drawLine (index: number) {
    let indexToRemember = lastNode;
    if (lastNode === -1) {
      setLastNode(index);
      shapes[index].color='red';
      return;
    }
    else if (lastNode === index) {
      shapes[index].color='white';
      setLastNode(-1);
      return;
    } else {
      shapes[lastNode].color='white';
      setLastNode(index);
      shapes[index].color='red';
      getPossibleNodes(arr, gameData.boardSize, indexToRemember).map(
        (node) => {
          if (node === index) {
            console.log(node);
            const line = lines.find((line) => line.nodeFrom === indexToRemember && line.nodeTo === node || line.nodeFrom === node && line.nodeTo === indexToRemember);
            if (line) {
              line.value = line.value + 1;
              if (line.value >= 3){
                line.value = 0;
              }
            } else {
              let smaller = indexToRemember;
              let bigger = node;
              if (bigger < smaller) {
                [smaller, bigger] = [bigger, smaller];
              }
              // const rowStart = Math.floor(smaller / width) * width;
              // const rowEnd = rowStart + width;
              const isHorizontal = Math.floor(smaller / width) === Math.floor(bigger / width);
              if (isHorizontal){
                for (let i = smaller + 1; i < bigger - 1; i++) {
                  arr[i] = -1;
                }
              } else {
                for (let i = smaller + width; i < bigger - width; i += width) {
                  arr[i] = -1;
                }
              }
              console.log(arr)
              setLines([...lines, {
                nodeFrom: indexToRemember,
                nodeTo: node,
                value: 1,
              }]);
          };
        }});
      return;
    }

  }

  return (
    <>
      <div
        style={{ width: "100%", border: "1px solid grey" }}
        ref={stageCanvasRef}
      >
        <Stage 
          width={width} 
          height={width}
        >
          <Layer>
          {
              hoveredNode >= 0 ? 
                getPossibleNodes(arr, gameData.boardSize, hoveredNode).map(
                  (node) => 
                    <Line
                    key={node}
                    points={[shapes[hoveredNode].x, shapes[hoveredNode].y, shapes[node].x, shapes[node].y ]}
                    stroke= 'yellow'
                    strokeWidth={20}
                  />              
                )
               : null
          }
          {
            lines.map((line,index)=>{
              if (line.value == 1){
                return(
                  <Line
                  key={index}
                  points={[shapes[line.nodeFrom].x, shapes[line.nodeFrom].y, shapes[line.nodeTo].x, shapes[line.nodeTo].y ]}
                  stroke= 'black'
                  strokeWidth={5}
                />  
                )
              }
              else if (line.value == 2){
                return(
                  <Line
                  key={index}
                  points={[shapes[line.nodeFrom].x, shapes[line.nodeFrom].y, shapes[line.nodeTo].x, shapes[line.nodeTo].y ]}
                  stroke= 'blue'
                  strokeWidth={10}
                />  
                )
              }
             
            })
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
                    fill={shape.color}
                    
                    onMouseOver={() => {
                      setHoveredNode(index);
                    }}
                    onMouseLeave={() => {setHoveredNode(-1);}}
                    onMouseDown={()=>drawLine(index)}
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
