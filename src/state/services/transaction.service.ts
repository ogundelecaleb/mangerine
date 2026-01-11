import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../config';
import { RootState } from '../store';

export const transactionApi = createApi({
  reducerPath: 'TransactionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/transaction`,
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
    getTransactions: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          page?: number;
          limit?: number;
        };
      }) => ({
        url: '',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const { useGetTransactionsMutation } = transactionApi;
