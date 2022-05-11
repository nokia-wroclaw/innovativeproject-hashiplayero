import { createSlice } from "@reduxjs/toolkit";
import IStateMachine from "../interfaces/IStateMachine";
import { RootState } from "./store";

const initialState: IStateMachine = {
  inRoom: false,
  isAdmin: false,
};

export const StateMachineSlice = createSlice({
  name: "StateMachine",
  initialState,
  reducers: {
    enterRoom: (state) => {
      return {
        inRoom: true,
        isAdmin: state.isAdmin,
      };
    },
    exitRoom: (state) => {
      return {
        inRoom: false,
        isAdmin: state.isAdmin,
      };
    },
    enterAdmin: (state) => {
      return {
        inRoom: state.inRoom,
        isAdmin: true,
      };
    },
    exitAdmin: (state) => {
      return {
        inRoom: state.inRoom,
        isAdmin: false,
      };
    },
  },
});

export const { enterRoom, exitRoom, enterAdmin, exitAdmin } = StateMachineSlice.actions;

export const selectRooms = (state: RootState) => state.RoomGame;

export default StateMachineSlice.reducer;
