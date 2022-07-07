import { configureStore } from "@reduxjs/toolkit";
import {emptySplitApi} from "../services/emptySplitApi";
import {setupListeners} from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    [emptySplitApi.reducerPath]: emptySplitApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(emptySplitApi.middleware),
});

setupListeners(store.dispatch);
