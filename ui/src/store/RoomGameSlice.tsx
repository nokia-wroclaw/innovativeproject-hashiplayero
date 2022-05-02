import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DefaultRoomAndBoard } from "../components/RoomAndBoard";
import { RootState } from "./store";

const initialState: DefaultRoomAndBoard = {
  roomAndBoard: {
    name: "name",
    maxPlayers: -1,
    isPrivate: false,
    password: "password",
    timeLimit: -1,
    members: [],
    array: [],
    isAdmin: -1,
    settings: {
      difficulty: -1,
      size: -1,
    },
  },
};

export const RoomBoardSlice = createSlice({
  name: "RoomGame",
  initialState,
  reducers: {
    updateRoomGame: (state, action: PayloadAction<DefaultRoomAndBoard>) => {
      return action.payload;
    },
    setInitialRoomBoard: () => {
      return initialState;
    },
    updateAsAdmin: (state, action: PayloadAction<DefaultRoomAndBoard>) => {
      return {
        roomAndBoard: {
          name: state.roomAndBoard.name,
          maxPlayers: state.roomAndBoard.maxPlayers,
          isPrivate: state.roomAndBoard.isPrivate,
          password: state.roomAndBoard.password,
          timeLimit: state.roomAndBoard.timeLimit,
          members: action.payload.roomAndBoard.members,
          array: state.roomAndBoard.array,
          isAdmin: state.roomAndBoard.isAdmin,
          settings: state.roomAndBoard.settings,
        }
      }
    },
  },
});

export const { updateRoomGame, setInitialRoomBoard, updateAsAdmin } = RoomBoardSlice.actions;

export const selectRooms = (state: RootState) => state.RoomGame;

export default RoomBoardSlice.reducer;
