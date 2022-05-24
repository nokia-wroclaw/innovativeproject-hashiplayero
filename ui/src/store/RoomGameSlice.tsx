import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ICreateBoard,
  ICreateRoom,
  IDefaultRoomAndBoard,
  IGameData,
} from "../interfaces/IRoomAndBoard";
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
    gameOn: false,
    settings: {
      difficulty: -1,
      size: -1,
    },
    gameData: [],
  },
};

export const RoomBoardSlice = createSlice({
  name: "RoomGame",
  initialState,
  reducers: {
    updateRoomGame: (state, action: PayloadAction<IDefaultRoomAndBoard>) => {
      return action.payload;
    },
    setInitialRoomBoard: () => {
      return initialState;
    },
    updateCreateBoard: (state, action: PayloadAction<ICreateBoard>) => {
      return {
        ...state,
        roomAndBoard: {
          ...state.roomAndBoard,
          array: action.payload.array,
          settings: action.payload.settings,
        },
      };
    },
    updateCreateRoom: (state, action: PayloadAction<ICreateRoom>) => {
      return {
        ...state,
        roomAndBoard: {
          ...state.roomAndBoard,
          name: action.payload.name,
          maxPlayers: action.payload.maxPlayers,
          isPrivate: action.payload.isPrivate,
          password: action.payload.password,
          timeLimit: action.payload.timeLimit,
          admin: action.payload.admin,
        },
      };
    },
    updateAsAdmin: (state, action: PayloadAction<IDefaultRoomAndBoard>) => {
      return {
        ...state,
        roomAndBoard: {
          ...state.roomAndBoard,
          maxPlayers: action.payload.roomAndBoard.maxPlayers,
          members: action.payload.roomAndBoard.members,
          isPrivate: action.payload.roomAndBoard.isPrivate,
          gameOn: action.payload.roomAndBoard.gameOn,
          settings: {
            difficulty: action.payload.roomAndBoard.settings.difficulty,
            size: action.payload.roomAndBoard.settings.size,
          },
        },
      };
    },
    updateAsPlayer: (state, action: PayloadAction<IDefaultRoomAndBoard>) => {
      return {
        ...state,
        roomAndBoard: {
          ...state.roomAndBoard,
          maxPlayers: action.payload.roomAndBoard.maxPlayers,
          members: action.payload.roomAndBoard.members,
          isPrivate: action.payload.roomAndBoard.isPrivate,
          settings: {
            difficulty: action.payload.roomAndBoard.settings.difficulty,
            size: action.payload.roomAndBoard.settings.size,
          },
          admin: action.payload.roomAndBoard.admin,
          gameOn: action.payload.roomAndBoard.gameOn,
          name: action.payload.roomAndBoard.name,
          timeLimit: action.payload.roomAndBoard.timeLimit,
        },
      };
    },
    updateGameData: (state, action: PayloadAction<IGameData[]>) => {
      return {
        ...state,
        roomAndBoard: {
          ...state.roomAndBoard,
          gameData: action.payload,
        },
      };
    },
    editRoom: (state, action: PayloadAction<IDefaultRoomAndBoard>) => {
      return {
        ...state,
        roomAndBoard: {
          ...state.roomAndBoard,
          name: action.payload.roomAndBoard.name,
          maxPlayers: action.payload.roomAndBoard.maxPlayers,
          isPrivate: action.payload.roomAndBoard.isPrivate,
          password: action.payload.roomAndBoard.password,
          timeLimit: action.payload.roomAndBoard.timeLimit,
          admin: action.payload.roomAndBoard.admin,
        },
      };
    },
  },
});

export const {
  updateRoomGame,
  setInitialRoomBoard,
  updateAsAdmin,
  updateCreateRoom,
  updateCreateBoard,
  updateGameData,
  updateAsPlayer,
  editRoom,
} = RoomBoardSlice.actions;

export const selectRooms = (state: RootState) => state.RoomGame;

export default RoomBoardSlice.reducer;
