import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Text, Circle, Group, Line } from "react-konva";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface Bridge {
  nodeFrom : number;
  nodeTo : number;
  value : number;
}

const getCrossSection = (board: number[], width: number, loc: number) => {
  const rowStart = Math.floor(loc / width) * width;

  const output: number[] = [];

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
  const { board, boardSize, boardResult } = useSelector(
    (state: RootState) => state.singleGame
  );

  const [lines, setLines] = useState([{
  }] as Bridge[]);

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


  function generateShapes() {
    arr = board.reduce((acc: number[], curr: number) => acc.concat(curr), []);
    const nodes = arr.map((value, index) => {
      return {
        id: index,
        value: value,
        radius: width / boardSize / 4,
        x: ((index % boardSize) * width) / boardSize + width / boardSize / 2,
        y:
          (Math.floor(index / boardSize) * height) /
            boardSize +
          width / boardSize / 2,
        fontSize: width / boardSize / 10,
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
      getCrossSection(arr, boardSize, indexToRemember).map(
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
                getCrossSection(arr, boardSize, hoveredNode).map(
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
            lines.map((line: Bridge, index: number)=>{
              if (line.value === 1){
                return(
                  <Line
                  key={index}
                  points={[shapes[line.nodeFrom].x, shapes[line.nodeFrom].y, shapes[line.nodeTo].x, shapes[line.nodeTo].y ]}
                  stroke= 'black'
                  strokeWidth={5}
                />  
                )
              }
              else if (line.value === 2){
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
                  <Text
                    text={shape.value.toString()}
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
