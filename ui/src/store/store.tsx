import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./gameSlice";
import userReducer from "./userSlice";
import RoomsListReducer from "./RoomsListSlice";
import RoomGameReducer from "./RoomGameSlice";

export const store = configureStore({
  reducer: {
    singleGame: gameReducer,
    defaultUser: userReducer,
    RoomsList: RoomsListReducer,
    RoomGame: RoomGameReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
