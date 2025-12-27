import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { API_BASE_URL } from '../config';

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/posts`,
    prepareHeaders: async (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    paginatedPosts: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          page?: number;
          limit?: number;
        };
      }) => ({
        url: '/paginated',
        method: 'GET',
        params,
      }),
    }),
    likePost: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          postId: string;
          userId: string;
        };
      }) => ({
        url: '/like',
        method: 'POST',
        body,
      }),
    }),
    sharePost: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/${id}/share`,
        method: 'POST',
      }),
    }),
    createPost: builder.mutation({
      query: ({ body }: { body: FormData }) => ({
        url: '',
        method: 'POST',
        body,
      }),
    }),
    editPost: builder.mutation({
      query: ({ body, id }: { body: FormData; id: string }) => ({
        url: '/' + id,
        method: 'PATCH',
        body,
      }),
    }),
    getPost: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: '/' + id,
        method: 'GET',
      }),
    }),
    getComments: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          postId: string;
          page: number;
          order: 'ASC' | 'DESC';
          take: number;
        };
      }) => ({
        url: '/get/comments',
        method: 'GET',
        params,
      }),
    }),
    postComment: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          postId: string;
          userId: string;
          comment: string;
        };
      }) => ({
        url: '/comment',
        method: 'POST',
        body,
      }),
    }),
    viewPost: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/${id}/increment-views`,
        method: 'GET',
      }),
    }),
    deletePost: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: '/' + id,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  usePaginatedPostsMutation,
  useLikePostMutation,
  useSharePostMutation,
  useDeletePostMutation,
  useCreatePostMutation,
  useEditPostMutation,
  useGetPostMutation,
  useGetCommentsMutation,
  usePostCommentMutation,
  useViewPostMutation,
} = postsApi;