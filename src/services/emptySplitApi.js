import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const emptySplitApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://onboard.mcsurfacesinc.com/admin"
  }),
  endpoints: () => ({}),
  tagTypes: ["Status"]
});
