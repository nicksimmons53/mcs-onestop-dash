import {combineReducers} from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import navReducer from "./navReducer";

export const rootReducer = combineReducers({
  user: userReducer,
  nav: navReducer
});