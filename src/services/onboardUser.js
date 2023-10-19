import { emptySplitApi } from "./emptySplitApi";

const onboardUserApi = emptySplitApi.injectEndpoints({
  endpoints: (build) => ({
    getOnboardUsers: build.query({
      query: () => `/users`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOnboardUsersQuery,
} = onboardUserApi;