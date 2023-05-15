import { createSlice } from "@reduxjs/toolkit";

export const UserDataSlice = createSlice({
  name: "UserData",
  initialState: {
    UserData: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.UserData = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setUserData } = UserDataSlice.actions;

export default UserDataSlice.reducer;

