import {createSlice} from "@reduxjs/toolkit";
import _ from "lodash";

const initialState = {
  path: "/"
};

const navSlice = createSlice({
  name: "nav",
  initialState: initialState,
  reducers: {
    setNav(state, action) {
      state.path = action.payload;
    },
  }
});

export const {setNav} = navSlice.actions;

export default navSlice.reducer;