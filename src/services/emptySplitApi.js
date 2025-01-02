import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const emptySplitApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.ONBOARD_API_URL,
    mode: "cors",
  }),
  endpoints: () => ({}),
  tagTypes: ["Status", "Files"]
});
