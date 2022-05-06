import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICreateBoard, ICreateRoom, IDefaultRoomAndBoard } from "../interfaces/IRoomAndBoard";
import { RootState } from "./store";

const initialState: IDefaultRoomAndBoard = {
  roomAndBoard: {
    name: "name",
    maxPlayers: -1,
    isPrivate: false,
    password: "password",
    timeLimit: -1,
    members: [],
    array: [],
    admin: "",
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
    updateRoomGame: (state, action: PayloadAction<IDefaultRoomAndBoard>) => {
      return action.payload;
    },
    updateCreateBoard: (state, action: PayloadAction<ICreateBoard>) => {
      return {
        roomAndBoard: {
          name: state.roomAndBoard.name,
          maxPlayers: state.roomAndBoard.maxPlayers,
          isPrivate: state.roomAndBoard.isPrivate,
          password: state.roomAndBoard.password,
          timeLimit: state.roomAndBoard.timeLimit,
          members: state.roomAndBoard.members,
          array: action.payload.array,
          admin: state.roomAndBoard.admin,
          settings: action.payload.settings,
        }
      }
    },
    updateCreateRoom: (state, action: PayloadAction<ICreateRoom>) => {
      return {
        roomAndBoard: {
          name: action.payload.name,
          maxPlayers: action.payload.maxPlayers,
          isPrivate: action.payload.isPrivate,
          password: action.payload.password,
          timeLimit: action.payload.timeLimit,
          members: state.roomAndBoard.members,
          array: state.roomAndBoard.array,
          admin: action.payload.admin,
          settings: state.roomAndBoard.settings,
        }
      }
    },
    setInitialRoomBoard: () => {
      return initialState;
    },
    updateAsAdmin: (state, action: PayloadAction<IDefaultRoomAndBoard>) => {
      return {
        roomAndBoard: {
          name: state.roomAndBoard.name,
          maxPlayers: state.roomAndBoard.maxPlayers,
          isPrivate: state.roomAndBoard.isPrivate,
          password: state.roomAndBoard.password,
          timeLimit: state.roomAndBoard.timeLimit,
          members: action.payload.roomAndBoard.members,
          array: state.roomAndBoard.array,
          admin: state.roomAndBoard.admin,
          settings: state.roomAndBoard.settings,
        }
      }
    },
  },
});

export const { updateRoomGame, setInitialRoomBoard, updateAsAdmin, updateCreateRoom, updateCreateBoard } = RoomBoardSlice.actions;

export const selectRooms = (state: RootState) => state.RoomGame;

export default RoomBoardSlice.reducer;
