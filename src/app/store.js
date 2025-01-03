import {configureStore} from "@reduxjs/toolkit";
import {emptySplitApi} from "../services/emptySplitApi";
import {setupListeners} from "@reduxjs/toolkit/query";
import userReducer from "../reducers/userReducer";
import navReducer from "../reducers/navReducer";

export const store = configureStore({
  reducer: {
    nav: navReducer,
    user: userReducer,
    [emptySplitApi.reducerPath]: emptySplitApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(emptySplitApi.middleware),
});

setupListeners(store.dispatch);
