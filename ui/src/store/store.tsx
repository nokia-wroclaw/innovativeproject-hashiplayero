import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./gameSlice";
import userReducer from "./userSlice";
import RoomsListReducer from "./RoomsListSlice";
import RoomGameReducer from "./RoomGameSlice";
import WebSocketReducer from "./WebSocketSlice";
import StateMachineReducer from "./StateMachineSlice";

export const store = configureStore({
  reducer: {
    singleGame: gameReducer,
    defaultUser: userReducer,
    RoomsList: RoomsListReducer,
    RoomGame: RoomGameReducer,
    webSocket: WebSocketReducer,
    StateMachine: StateMachineReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
