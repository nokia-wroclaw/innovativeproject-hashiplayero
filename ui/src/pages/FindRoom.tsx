import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Room from "../components/Room";
import { IRoom } from "../interfaces/IRoom";

import { Button, InputBase, Grid } from "@mui/material";
import {GridOn, Groups, ScreenSearchDesktop, Search} from '@mui/icons-material';

const FindRoom = () => {
  const { rooms } = useSelector((state: RootState) => state.RoomsList);

  return (
    <>
      <div className="rooms">

        <Grid container className="header filter">
            <Grid item xs={12} sm={6} md={3} className="header-element element">
                <ScreenSearchDesktop />
                <InputBase
                  id="room-name"
                  placeholder="Room name"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3} className="header-element element">
                <GridOn />
                <InputBase
                  id="board-size" 
                  placeholder="Board size"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3} className="header-element element">
                <Groups />
                <InputBase
                  id="room-people-number"
                  placeholder="Numbers of players" 
                />
            </Grid>
            <Grid item xs className="header-element but">
              <Button
                color="secondary"
                endIcon={<Search fontSize="large"/>}
              >
                Search
              </Button>
            </Grid>
        </Grid>

        {rooms != null && rooms.length > 0 
          ? (rooms.map((room: IRoom, index: number) => (
              <Room room={room} key={room.name}/>
            ))
          ) : (
            <div>No Rooms</div>
        )}
      </div>
    </>
  );
};

export default FindRoom;
