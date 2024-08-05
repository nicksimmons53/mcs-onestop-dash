import { emptySplitApi } from "./emptySplitApi";

const onboardUserApi = emptySplitApi.injectEndpoints({
  endpoints: (build) => ({
    getOnboardUsers: build.query({
      query: () => `/users`,
    }),
    getOnboardUserById:  build.query(({
      query: ({ sub }) => ({
        url: `/users?sub=${sub}`,
      })
    }))
  }),
  overrideExisting: false,
});

export const {
  useGetOnboardUsersQuery,
  useGetOnboardUserByIdQuery,
} = onboardUserApi;