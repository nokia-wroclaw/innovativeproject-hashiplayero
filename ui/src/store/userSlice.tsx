import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DefaultUser } from "../components/User";
import { RootState } from "./store";

const initialState: DefaultUser = {
  user: {
    uuid: -1,
    name: "defaultName",
  },
};

export const userSlice = createSlice({
  name: "defaultUser",
  initialState,
  reducers: {
    createUser: (state, action: PayloadAction<DefaultUser>) => {
      return action.payload;
    },
  },
});

export const { createUser } = userSlice.actions;

export const selectDefaultUser = (state: RootState) => state.defaultUser;

export default userSlice.reducer;