import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialGameData from "../components/initialGameData";

export const gameSlice = createSlice({
  name: "singleGame",
  initialState: {
    difficulty: 0,
    boardSize: 0,
    timeLimit: 0,
    seed: "seedData",
    board: [],
    boardResult: [],
  },
  reducers: {
    addFormData: (state, action: PayloadAction<initialGameData>) => {
      state.difficulty = action.payload.difficulty;
      state.boardSize = action.payload.boardSize;
      state.timeLimit = action.payload.timeLimit;
      state.seed = action.payload.seed;
      state.board = action.payload.board;
      state.boardResult = [];
    },
    addBoard: (state, action: PayloadAction<[]>) => {
      state.board = action.payload;
    },
    addBoardResult: (state, action) => {
      state.boardResult = action.payload;
    },
  },
});

export const { addFormData, addBoard, addBoardResult } = gameSlice.actions;

export default gameSlice.reducer;
