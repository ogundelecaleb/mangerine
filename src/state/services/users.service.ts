import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getUrl } from '../../utils/helpers';
import { RootState } from '../store';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/users`,
    prepareHeaders: async (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Profile'],
  endpoints: (builder) => ({
    getInfo: builder.query<any, void>({
      query: () => '/get/info',
      providesTags: ['Profile'],
    }),
    getUserInfo: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: '/get/info',
        params: { id },
      }),
      providesTags: ['User'],
    }),
    updateProfilePic: builder.mutation<any, FormData>({
      query: (body) => ({
        url: '/update/profile/pics',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    updateProfileBanner: builder.mutation<any, FormData>({
      query: (body) => ({
        url: '/update/profile/banner',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    updateProfileVideo: builder.mutation<any, FormData>({
      query: (body) => ({
        url: '/update/profile/video',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    updateProfileInfo: builder.mutation<any, {
      fullName: string;
      occupation: string;
      location: string;
      dateOfBirth: string;
      bio: string;
    }>({
      query: (body) => ({
        url: '/update/profile/info',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    updateProfileContact: builder.mutation<any, {
      mobileNumber: string;
      websiteAddress: string;
    }>({
      query: (body) => ({
        url: '/update/contact/info',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    deleteSkill: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/delete/skill/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),
    addLanguage: builder.mutation<any, {
      language: string;
      proficiency: string;
    }>({
      query: (body) => ({
        url: '/add/language',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    deleteLanguage: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/delete/language/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),
    followUser: builder.mutation<any, {
      currentUser: string;
      targetUser: string;
    }>({
      query: ({ currentUser, targetUser }) => ({
        url: `${currentUser}/follow/${targetUser}`,
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Profile'],
    }),
    unfollowUser: builder.mutation<any, {
      currentUser: string;
      targetUser: string;
    }>({
      query: ({ currentUser, targetUser }) => ({
        url: `${currentUser}/unfollow/${targetUser}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Profile'],
    }),
    getFollowers: builder.query<any, {
      id: string;
      page: number;
      limit: number;
    }>({
      query: ({ id, page, limit }) => ({
        url: `/${id}/followers`,
        params: { page, limit },
      }),
    }),
    getFollowing: builder.query<any, {
      id: string;
      page: number;
      limit: number;
    }>({
      query: ({ id, page, limit }) => ({
        url: `/${id}/following`,
        params: { page, limit },
      }),
    }),
    addConsultancy: builder.mutation<any, FormData>({
      query: (body) => ({
        url: '/add/consultancy',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    getConsultancy: builder.query<any, void>({
      query: () => '/get/consultancy',
      providesTags: ['Profile'],
    }),
    deleteConsultancy: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/delete/consultancy/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),
    becomeConsultant: builder.mutation<any, void>({
      query: () => ({
        url: '/become/consultant',
        method: 'PATCH',
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetInfoQuery,
  useGetUserInfoQuery,
  useUpdateProfilePicMutation,
  useUpdateProfileBannerMutation,
  useUpdateProfileVideoMutation,
  useUpdateProfileInfoMutation,
  useUpdateProfileContactMutation,
  useAddSkillMutation,
  useDeleteSkillMutation,
  useAddLanguageMutation,
  useDeleteLanguageMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetFollowersQuery,
  useGetFollowingQuery,
  useAddConsultancyMutation,
  useGetConsultancyQuery,
  useDeleteConsultancyMutation,
  useBecomeConsultantMutation,
} = usersApi;