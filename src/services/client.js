import {emptySplitApi} from "./emptySplitApi";

const clientApi = emptySplitApi.injectEndpoints({
  endpoints: (build) => ({
    getClients: build.query({
      query: () => `/clients/onboard`,
    }),
    getOnboardClients: build.query({
      query: () => `/clients/sage`,
    }),
    getClientById: build.query({
      query: ({id}) => `/clients/${id}/profile-data`,
      providesTags: ["Status"],
    }),
    getClientDetails: build.query({
      query: ({id}) => `/details?clientId=${id}`,
    }),
    getClientProgramInfo: build.query({
      query: ({id}) => `/programs/${id}`,
    }),
    getClientBillingParts: build.query({
      query: ({id}) => `/pricing/${id}`,
    }),
    getFiles: build.query({
      query: ({folderId}) => `/sharepoint/folder?id=${folderId}`,
      providesTags: ["Files"],
    }),
    updateUserApproval: build.mutation({
      query: ({id, body}) => ({
        url: `/clients/status/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Status"],
    }),
    createApproval: build.mutation({
      query: ({body}) => ({
        url: `/clients/approval`,
        method: "POST",
        body: body,
      })
    }),
    createInternalFolder: build.mutation({
      query: ({body}) => ({
        url: `/sharepoint/folder/internal`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["BasicInfo"],
    }),
    createFolder: build.mutation({
      query: ({parentId, folder}) => ({
        url: `/sharepoint/folder?parentId=${parentId}&folder=${folder}`,
        method: "POST",
      }),
      invalidatesTags: ["Files"],
    }),
    createFile: build.mutation({
      query: ({parentId, body}) => ({
        url: `/sharepoint/file?parentId=${parentId}`,
        body: body,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }),
      invalidatesTags: ["Files"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetClientsQuery,
  useGetOnboardClientsQuery,
  useGetClientByIdQuery,
  useGetClientDetailsQuery,
  useGetClientProgramInfoQuery,
  useGetClientBillingPartsQuery,
  useGetFilesQuery,
  useUpdateUserApprovalMutation,
  useCreateApprovalMutation,
  useCreateInternalFolderMutation,
  useCreateFolderMutation,
  useCreateFileMutation,
} = clientApi;
