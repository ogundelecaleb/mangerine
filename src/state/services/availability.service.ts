import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../config';

export interface Timeslot {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  isBooked: boolean;
}

export interface Availability {
  id: string;
  date: string;
  timeslots: Timeslot[];
}

export const availabilityApi = createApi({
  reducerPath: 'availabilityApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/availability`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Availability'],
  endpoints: (builder) => ({
    getConsultantAvailability: builder.mutation<
      { data: Availability[] },
      { params: { userId: string; startDate: string; endDate: string } }
    >({
      query: ({ params }) => ({
        url: '/consultant',
        method: 'GET',
        params,
      }),
      invalidatesTags: ['Availability'],
    }),
    
    updateAvailability: builder.mutation<
      { data: Availability },
      { body: { date: string; timeslots: Omit<Timeslot, 'id'>[] } }
    >({
      query: ({ body }) => ({
        url: '/update',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Availability'],
    }),
  }),
});

export const {
  useGetConsultantAvailabilityMutation,
  useUpdateAvailabilityMutation,
} = availabilityApi;