import { emptySplitApi } from "./emptySplitApi";

const clientApi = emptySplitApi.injectEndpoints({
  endpoints: (build) => ({
    getClients: build.query({
      query: () => `/clients`,
    }),
    getClientById: build.query({
      query: ({ id }) => `/clients/${id}/profile-data`,
      providesTags: ["Status"],
    }),
    getClientDetails: build.query({
      query: ({ id }) => `/details?clientId=${id}`,
    }),
    getClientProgramInfo: build.query({
      query: ({ id }) => `/programs/${id}`,
    }),
    getClientBillingParts: build.query({
      query: ({ id }) => `/pricing/${id}`,
    }),
    updateUserApproval: build.mutation({
      query: ({ id, body }) => ({
        url: `/clients/status/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Status"],
    })
  }),
  overrideExisting: false,
});

export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useGetClientDetailsQuery,
  useGetClientProgramInfoQuery,
  useGetClientBillingPartsQuery,
  useUpdateUserApprovalMutation,
} = clientApi;
