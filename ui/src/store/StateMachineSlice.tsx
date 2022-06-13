import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IStateMachine from "../interfaces/IStateMachine";
import { RootState } from "./store";

const initialState: IStateMachine = {
  inWaitingRoom: false,
  isAdmin: false,
  inMultiGame: false,
  inSingleGame: false,
  isBoardCorrect: false,
};

export const StateMachineSlice = createSlice({
  name: "StateMachine",
  initialState,
  reducers: {
    setInitialState: () => {
      return initialState;
    },
    changeWaitingRoom: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        inWaitingRoom: action.payload,
      };
    },
    changeAdmin: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isAdmin: action.payload,
      };
    },
    changeMultiGame: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        inMultiGame: action.payload,
      };
    },
    changeSingleGame: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        inSingleGame: action.payload,
      };
    },
    changeBoardCorrect: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isBoardCorrect: action.payload,
      };
    },
  },
});

export const {
  changeWaitingRoom,
  changeAdmin,
  changeMultiGame,
  changeSingleGame,
  changeBoardCorrect,
  setInitialState,
} = StateMachineSlice.actions;

export const selectRooms = (state: RootState) => state.RoomGame;

export default StateMachineSlice.reducer;
