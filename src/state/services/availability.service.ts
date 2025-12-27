import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

const API_BASE_URL = 'https://api.mangerine.com'; // Replace with actual API URL

export const availabilityApi = createApi({
  reducerPath: 'availabilityApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/availability`,
    prepareHeaders: async (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getConsultantAvailability: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          userId: string;
          startDate: string;
          endDate: string;
        };
      }) => ({
        url: '',
        method: 'GET',
        params,
      }),
    }),
    getAvailability: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/${id}`,
        method: 'GET',
      }),
    }),
    createAvailability: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          timezone: string;
          availability_settings: string[];
          availabilities: string[];
          consultantId: string;
        };
      }) => ({
        url: '/create',
        method: 'POST',
        body,
      }),
    }),
    updateAvailability: builder.mutation({
      query: ({
        body,
        id,
      }: {
        body: {
          timezone: string;
          availability_settings: string[];
          availabilities: string[];
          consultantId: string;
        };
        id: string;
      }) => ({
        url: '/' + id,
        method: 'PATCH',
        body,
      }),
    }),
    deleteAvailability: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useCreateAvailabilityMutation,
  useDeleteAvailabilityMutation,
  useGetAvailabilityMutation,
  useGetConsultantAvailabilityMutation,
  useUpdateAvailabilityMutation,
} = availabilityApi;