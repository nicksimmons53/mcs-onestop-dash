import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

const initialState = {
    info: null,
    permissions: null,
};

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setUser(state, action) {
            state.info = _.omit(action.payload, ["permissions", "requiredApplications"]);
            state.permissions = action.payload.permissions;
        },
    }
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;