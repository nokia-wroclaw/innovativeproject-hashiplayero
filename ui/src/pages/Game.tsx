import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Text, Circle, Group } from "react-konva";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Game = () => {
  const { board, boardSize, boardResult } = useSelector(
    (state: RootState) => state.singleGame
  );

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
    const arr = board.reduce((acc, curr) => acc.concat(curr), []);
    const nodes = arr.map((value: number, index) => {
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
            {shapes.map((shape) =>
              shape.value !== 0 ? (
                <Group key={shape.id}>
                  <Circle
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    radius={shape.radius}
                    stroke="black"
                    fill="white"
                  />
                  <Text
                    text={shape.value.toString()}
                    x={shape.x}
                    y={shape.y}
                    fontSize={shape.fontSize}
                    offsetX={shape.fontSize / 4}
                    offsetY={shape.fontSize / 3}
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
