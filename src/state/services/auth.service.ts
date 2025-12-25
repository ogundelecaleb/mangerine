import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getUrl } from '../../utils/helpers';
import { RootState } from '../store';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/auth`,
    prepareHeaders: async (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    preLogin: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: '/pre/login',
        method: 'POST',
        body,
      }),
    }),
    preSignup: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: '/pre/signup',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<any, { username: string; password: string }>({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),
    googleLogin: builder.mutation<any, { access_token: string }>({
      query: (body) => ({
        url: '/google',
        method: 'POST',
        body,
      }),
    }),
    createAccount: builder.mutation<any, {
      email: string;
      fullName: string;
      businessName: string;
      location: string;
      interests: string[];
      userType: string[];
      password: string;
    }>({
      query: (body) => ({
        url: '/create/account',
        method: 'POST',
        body,
      }),
    }),
    sendEmailOTP: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: '/send/email/otp',
        method: 'POST',
        body,
      }),
    }),
    verifyEmailOTP: builder.mutation<any, { otpCode: string; email: string }>({
      query: (body) => ({
        url: '/verify/email/otp',
        method: 'POST',
        body,
      }),
    }),
    forgotPassword: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: '/forgot/password',
        method: 'POST',
        body,
      }),
    }),
    changePassword: builder.mutation<any, { email: string; password: string }>({
      query: (body) => ({
        url: '/change/password',
        method: 'POST',
        body,
      }),
    }),
    getUserTypes: builder.query<any, void>({
      query: () => '/get/user/types',
    }),
    getInterests: builder.query<any, void>({
      query: () => '/get/user/interests',
    }),
  }),
});

export const {
  usePreLoginMutation,
  usePreSignupMutation,
  useLoginMutation,
  useGoogleLoginMutation,
  useCreateAccountMutation,
  useSendEmailOTPMutation,
  useVerifyEmailOTPMutation,
  useForgotPasswordMutation,
  useChangePasswordMutation,
  useGetUserTypesQuery,
  useGetInterestsQuery,
} = authApi;