import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import RoomData from "../components/RoomData";
import PlayerList from "../components/PlayerList";
import { Button } from "@mui/material";
import { setInitialRoomBoard } from "../store/RoomGameSlice";
import { useAppDispatch } from "../store/hooks";

const WaitingRoom = () => {
  const navigate = useNavigate();
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
  const { user } = useSelector((state: RootState) => state.defaultUser);
  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);
  let isAdmin = user.uuid === roomAndBoard.admin;
  const dispatch = useAppDispatch();

  const handleStartGame = () => {
    if (webSocket !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "startGame",
          userUuid: user.uuid,
          data: {
            roomName: roomAndBoard.name,
          },
        })
      );
    }
  };

  const handleExitRoom = () => {
    if (webSocket !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "changeRoom",
          userUuid: user.uuid,
          data: {
            roomName: "lobby",
          },
        })
      );
      dispatch(setInitialRoomBoard());
      console.log("WebSocket-> Change Room");
    }
  };

  const handleDeleteRoom = () => {
    if (webSocket !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "deleteRoom",
          userUuid: user.uuid,
          data: {
            roomName: roomAndBoard.name,
          },
        })
      );
    }
  };

  return (
    <>
      <h1>Waiting Room</h1>
      <RoomData room={roomAndBoard} isAdmin={isAdmin} key="roomData" />
      <PlayerList players={roomAndBoard.members} />
      <Button
        className="m-2"
        onClick={() => {
          handleStartGame();
        }}
        color="secondary"
      >
        Start Game
      </Button>
      <Button
        className="m-2"
        onClick={() => {
          handleExitRoom();
        }}
        color="secondary"
      >
        Exit Room
      </Button>
      <Button
        className="m-2"
        onClick={() => {
          handleDeleteRoom();
        }}
        color="secondary"
      >
        Delete Room
      </Button>
    </>
  );
};

export default WaitingRoom;
