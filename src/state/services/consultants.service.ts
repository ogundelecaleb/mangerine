import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://dev.mangerine.com';

export const consultantsApi = createApi({
  reducerPath: 'consultantsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/consultants`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getConsultants: builder.mutation({
      query: () => ({
        url: '',
        method: 'GET',
      }),
    }),
    getConsultant: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/${id}`,
        method: 'GET',
      }),
    }),
    favouriteConsultant: builder.mutation({
      query: ({ body }: { body: { userId: string; consultantId: string } }) => ({
        url: '/favorite',
        method: 'POST',
        body,
      }),
    }),
    unfavouriteConsultant: builder.mutation({
      query: ({ body }: { body: { userId: string; consultantId: string } }) => ({
        url: '/unfavorite',
        method: 'POST',
        body,
      }),
    }),
    getConsultantPricing: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/${id}/pricing`,
        method: 'GET',
      }),
    }),
    bookConsultation: builder.mutation({
      query: ({ body }: { body: any }) => ({
        url: '/book',
        method: 'POST',
        body,
      }),
    }),
    getMyConsultations: builder.mutation({
      query: () => ({
        url: '/my-consultations',
        method: 'GET',
      }),
    }),
    rescheduleConsultation: builder.mutation({
      query: ({ id, body }: { id: string; body: any }) => ({
        url: `/consultations/${id}/reschedule`,
        method: 'PATCH',
        body,
      }),
    }),
    cancelConsultation: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/consultations/${id}/cancel`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetConsultantsMutation,
  useGetConsultantMutation,
  useFavouriteConsultantMutation,
  useUnfavouriteConsultantMutation,
  useGetConsultantPricingMutation,
  useBookConsultationMutation,
  useGetMyConsultationsMutation,
  useRescheduleConsultationMutation,
  useCancelConsultationMutation,
} = consultantsApi;