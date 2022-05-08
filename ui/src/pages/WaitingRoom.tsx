import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import RoomData from "../components/RoomData";
import PlayerList from "../components/PlayerList";
import { Button } from "@mui/material";

const WaitingRoom = () => {
    const navigate = useNavigate();
    const { webSocket } = useSelector((state: RootState) => state.webSocket);
    const { user } = useSelector((state: RootState) => state.defaultUser);
    const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);
    let isAdmin = user.uuid !== roomAndBoard.admin;

    const handleStartGame = () => {
        console.log("TUTAJ PATRZ");
        console.log(roomAndBoard.members);
    }

    const handleEditRoom = () => {

    }

    const handleExitRoom = () => {

    }

    return(
        <>
            <h1>Waiting Room</h1>
            <RoomData room={roomAndBoard} isAdmin={isAdmin} key="roomData"/>
            <PlayerList players={roomAndBoard.members} />
            <Button onClick={() => {
                    handleStartGame();
                }}
                color="secondary">
                Start Game
            </Button>
        </>
    )
}

export default WaitingRoom;