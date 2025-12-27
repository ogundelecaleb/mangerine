import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

const API_BASE_URL = 'https://api.mangerine.com'; // Replace with actual API URL

export const appointmentApi = createApi({
  reducerPath: 'appointmentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/appointment`,
    prepareHeaders: async (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserAppointments: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          userId: string;
          status?: string;
          page?: string | number;
          limit?: string | number;
        };
      }) => ({
        url: '/user',
        method: 'GET',
        params,
      }),
    }),
    getMyAppointments: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          page?: string | number;
          status?: string;
          limit?: string | number;
        };
      }) => ({
        url: '/my-appointments',
        method: 'GET',
        params,
      }),
    }),
    getAppointmentConversations: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          page?: string | number;
          take?: string | number;
          order?: 'ASC' | 'DESC';
        };
      }) => ({
        url: '/get/conversations',
        method: 'GET',
        params,
      }),
    }),
    bookAppointment: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          consultantId: string;
          userId: string;
          availabilityId: string;
          message: string;
          videoOption: boolean;
          timeslots: string[];
        };
      }) => ({
        url: '/book',
        method: 'POST',
        body,
      }),
    }),
    cancelAppointment: builder.mutation({
      query: ({
        appointmentId,
        userId,
      }: {
        appointmentId: string;
        userId: string;
      }) => ({
        url: `/${appointmentId}/cancel/${userId}`,
        method: 'POST',
      }),
    }),
    rescheduleAppointment: builder.mutation({
      query: ({
        appointmentId,
        userId,
        body,
      }: {
        appointmentId: string;
        userId: string;
        body: any;
      }) => ({
        url: `/${appointmentId}/reschedule/${userId}`,
        method: 'POST',
        body,
      }),
    }),
    createAppointmentConversation: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          appointmentId: string;
          participantId: string;
        };
      }) => ({
        url: '/create/conversation',
        method: 'POST',
        params,
      }),
    }),
  }),
});

export const {
  useBookAppointmentMutation,
  useCancelAppointmentMutation,
  useCreateAppointmentConversationMutation,
  useGetAppointmentConversationsMutation,
  useGetMyAppointmentsMutation,
  useGetUserAppointmentsMutation,
  useRescheduleAppointmentMutation,
} = appointmentApi;