import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../config';
import { RootState } from '../store';

// Create your service using a base URL and expected endpoints
export const availabilityApi = createApi({
  reducerPath: 'availabilityApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/availability`,
    prepareHeaders: async (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const state = getState() as RootState;
      const token = state?.user?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        // headers.set('Authentication', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: builder => ({
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
    getCurrentAvailabilitySettings: builder.mutation({
      query: () => ({
        url: '/current/settings',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useCreateAvailabilityMutation,
  useGetAvailabilityMutation,
  useGetConsultantAvailabilityMutation,
  useUpdateAvailabilityMutation,
  useDeleteAvailabilityMutation,
  useGetCurrentAvailabilitySettingsMutation,
} = availabilityApi; 
