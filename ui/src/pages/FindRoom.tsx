import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Room from "../components/Room";
import { IRoom } from "../interfaces/IRoom";

import { Button, TextField } from "@mui/material";



const FindRoom = () => {
  const { rooms } = useSelector((state: RootState) => state.RoomsList);

  return (
    <>
      <div>
        <div>
          <TextField>

          </TextField>
        </div>
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
