import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDefaultUser } from "../interfaces/IUser";
import { RootState } from "./store";

const initialState: IDefaultUser = {
  user: {
    uuid: "defaultUuid",
    name: "defaultName",
  },
};

export const userSlice = createSlice({
  name: "defaultUser",
  initialState,
  reducers: {
    createUser: (state, action: PayloadAction<IDefaultUser>) => {
      return action.payload;
    },
    updateUserName: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        user: {
          ...state.user,
          name: action.payload,
        },
      };
    },
  },
});

export const { createUser, updateUserName } = userSlice.actions;

export const selectDefaultUser = (state: RootState) => state.defaultUser;

export default userSlice.reducer;
