import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import {
  Bridge,
  ICreateBoard,
  ICreateRoom,
  IDefaultRoomAndBoard,
  IGameData,
} from "../interfaces/IRoomAndBoard";
import { RootState } from "./store";

const initialState: IDefaultRoomAndBoard = {
  roomAndBoard: {
    name: "name",
    boardID: -1,
    maxPlayers: -1,
    isPrivate: false,
    password: "",
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
    bridges: [],
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
          boardID: action.payload.boardID,
          array: action.payload.array,
          settings: action.payload.settings,
          bridges: [],
          gameData: [],
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
          bridges: [],
          gameData: [],
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
          gameData: [],
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
          gameData: [],
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
    updateMove: (state, action: PayloadAction<Bridge[]>) => {
      return {
        ...state,
        roomAndBoard: {
          ...state.roomAndBoard,
          bridges: action.payload,
        },
      };
    },
    increaseValueOnBridge: (state, action: PayloadAction<Bridge>) => {
      let newBridges: Bridge[] = state.roomAndBoard.bridges.map(
        (item: Bridge) => {
          const oldValue = item.value;
          if (
            (item.nodeFrom === action.payload.nodeFrom &&
              item.nodeTo === action.payload.nodeTo) ||
            (item.nodeTo === action.payload.nodeTo &&
              item.nodeFrom === action.payload.nodeFrom)
          ) {
            return { ...item, value: oldValue + 1 };
          }
          return item;
        }
      );
      return {
        ...state,
        roomAndBoard: {
          ...state.roomAndBoard,
          bridges: newBridges,
        },
      };
    },
    deleteBridge: (state, action: PayloadAction<Bridge>) => {
      const bridgeIndexToDelete = state.roomAndBoard.bridges.findIndex(
        (item) => {
          return (
            (item.nodeFrom === action.payload.nodeFrom &&
              item.nodeTo === action.payload.nodeTo) ||
            (item.nodeTo === action.payload.nodeFrom &&
              item.nodeFrom === action.payload.nodeTo)
          );
        }
      );
      let newValueBridges = cloneDeep(state.roomAndBoard.bridges);
      if (bridgeIndexToDelete > -1) {
        newValueBridges.splice(bridgeIndexToDelete, 1);
      }
      return {
        ...state,
        roomAndBoard: {
          ...state.roomAndBoard,
          bridges: newValueBridges,
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
  updateMove,
  deleteBridge,
  increaseValueOnBridge,
} = RoomBoardSlice.actions;

export const selectRooms = (state: RootState) => state.RoomGame;

export default RoomBoardSlice.reducer;
