import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Rooms } from "../components/Room";
import { RootState } from "./store";

const initialState: Rooms = {
  rooms: [
    {
      name: "name",
      numPlayers: -1,
      maxPlayers: -1,
      isPrivate: false,
      boardSize: -1,
      difficulty: -1,
    },
  ],
};

export const RoomsListSlice = createSlice({
  name: "RoomsList",
  initialState,
  reducers: {
    updateRooms: (state, action: PayloadAction<Rooms>) => {
      return action.payload;
    },
    setInitialRoomsList: () => {
      return initialState;
    },
  },
});

export const { updateRooms, setInitialRoomsList } = RoomsListSlice.actions;

export const selectRooms = (state: RootState) => state.RoomsList;

export default RoomsListSlice.reducer;