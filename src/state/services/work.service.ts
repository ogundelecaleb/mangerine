import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getUrl } from '../../utils/helpers';

export const workApi = createApi({
  reducerPath: 'workApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/works`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Work'],
  endpoints: (builder) => ({
    getWorks: builder.mutation<any, string>({
      query: (userId) => ({
        url: `/${userId}`,
        method: 'GET',
      }),
      invalidatesTags: ['Work'],
    }),
    addWork: builder.mutation<any, any>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Work'],
    }),
    updateWork: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Work'],
    }),
    deleteWork: builder.mutation<any, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Work'],
    }),
  }),
});

export const {
  useGetWorksMutation,
  useAddWorkMutation,
  useUpdateWorkMutation,
  useDeleteWorkMutation,
} = workApi;