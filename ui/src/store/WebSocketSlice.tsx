import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IWebSocket from "../interfaces/IWebSocket";
import { RootState } from "./store";

const initialState: IWebSocket = {
  webSocket: new WebSocket("ws://localhost:8080/ws/"),
  // webSocket: new WebSocket("wss://hashiplayero-nokia.koyeb.app/ws/"),
};

export const WebSocketSlice = createSlice({
  name: "webSocket",
  initialState,
  reducers: {
    setWebSocket: (state, action: PayloadAction<IWebSocket>) => {
      return action.payload;
    },
  },
});

export const { setWebSocket } = WebSocketSlice.actions;

export const selectDefaultUser = (state: RootState) => state.defaultUser;

export default WebSocketSlice.reducer;
