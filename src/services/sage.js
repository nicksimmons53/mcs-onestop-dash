import {emptySplitApi} from "./emptySplitApi";

const sageApi = emptySplitApi.injectEndpoints({
  endpoints: (build) => ({
    getSageClients: build.query({
      query: () => ({
        url: `/sage/clients?company=MCS - TESTING`,
      })
    }),
    getSageClient: build.query(({
      query: ({id}) => ({
        url: `/sage/clients/${id}?company=MCS - TESTING`,
      })
    }))
  }),
  overrideExisting: false,
});

export const {
  useGetSageClientsQuery,
  useGetSageClientQuery,
} = sageApi;
