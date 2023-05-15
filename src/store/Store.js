import { configureStore } from "@reduxjs/toolkit";
import UserData from "./UserData";

export default configureStore({
  reducer: {
    UserData: UserData,
  }
});
