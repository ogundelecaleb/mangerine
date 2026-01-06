import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getUrl } from '../../utils/helpers';
import { RootState } from '../store';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/chat`,
    prepareHeaders: async (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state?.user?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    getHistory: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          conversationId: string;
          limit: string | number;
          page: string | number;
        };
      }) => ({
        url: '/history',
        method: 'GET',
        params,
      }),
    }),
    getToken: builder.mutation({
      query: () => ({
        url: '/token',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetHistoryMutation, useGetTokenMutation } = chatApi;
