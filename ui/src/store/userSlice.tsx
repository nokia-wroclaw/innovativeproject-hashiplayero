import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const userSlice = createSlice({
  name: "defaultUser",
  initialState: {
    uuid: 0,
    name: "defaultUser",
  },
  reducers: {
    createUser: (state) => {
      if(state.uuid === 0){
        state.uuid = Math.floor(Math.random() * 1000000);
        state.name = "User" + Math.random().toString(36).substring(2, 7);
      }
    },
  },
});

export const { createUser } = userSlice.actions;

export const selectDefaultUser = (state: RootState) => state.defaultUser;

export default userSlice.reducer;
