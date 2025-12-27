import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../config';

export interface Appointment {
  id: string;
  userId: string;
  consultantId: string;
  availabilityId: string;
  message?: string;
  timeslots: Array<{
    id: string;
    startTime: string;
    endTime: string;
    duration: number;
  }>;
  videoOption: boolean;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  consultant: {
    id: string;
    fullName: string;
    title?: string;
    profilePics?: string;
  };
  availability: {
    date: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const appointmentApi = createApi({
  reducerPath: 'appointmentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/appointments`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Appointment'],
  endpoints: (builder) => ({
    bookAppointment: builder.mutation<
      { data: Appointment },
      {
        body: {
          availabilityId: string;
          consultantId: string;
          message?: string;
          timeslots: string[];
          userId: string;
          videoOption: boolean;
        };
      }
    >({
      query: ({ body }) => ({
        url: '/book',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Appointment'],
    }),

    rescheduleAppointment: builder.mutation<
      { data: Appointment },
      {
        body: {
          availabilityId: string;
          consultantId: string;
          message?: string;
          timeslots: string[];
          userId: string;
          videoOption: boolean;
        };
        appointmentId: string;
        userId: string;
      }
    >({
      query: ({ body, appointmentId, userId }) => ({
        url: `/reschedule/${appointmentId}`,
        method: 'PUT',
        body: { ...body, userId },
      }),
      invalidatesTags: ['Appointment'],
    }),

    cancelAppointment: builder.mutation<
      { data: { message: string } },
      { appointmentId: string; userId: string }
    >({
      query: ({ appointmentId, userId }) => ({
        url: `/cancel/${appointmentId}`,
        method: 'DELETE',
        body: { userId },
      }),
      invalidatesTags: ['Appointment'],
    }),

    getMyAppointments: builder.mutation<
      { data: Appointment[] },
      {}
    >({
      query: () => ({
        url: '/my-appointments',
        method: 'GET',
      }),
      invalidatesTags: ['Appointment'],
    }),
  }),
});

export const {
  useBookAppointmentMutation,
  useRescheduleAppointmentMutation,
  useCancelAppointmentMutation,
  useGetMyAppointmentsMutation,
} = appointmentApi;