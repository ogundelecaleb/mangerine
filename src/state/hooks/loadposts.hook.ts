import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { ErrorData } from '../../utils/ParamList';
import { signUserOut } from '../reducers/user.reducer';
import { useAuth } from './user.hook';
import {
  usePaginatedPostsMutation,
} from '../services/posts.service';
import {
  setAllPosts,
  setUserPosts,
  setUserWorks,
} from '../reducers/posts.reducer';
import { useGetWorksMutation } from '../services/work.service';

export const useLoadPosts = () => {
  const { token, user } = useAuth();
  const dispatch = useDispatch();
  const [getPosts, { isLoading: allpostsLoading }] = usePaginatedPostsMutation();
  const [getUserPosts, { isLoading: userpostsLoading }] =
    usePaginatedPostsMutation();
  const [getUserWorks, { isLoading: userWorksLoading }] = useGetWorksMutation();

  const loadUserPosts = useCallback(async () => {
    try {
      if (!token || !user) {
        return;
      }
      const response = await getUserPosts({
        params: { page: 1, limit: 10 }
      });
      if ((response as any)?.error) {
        const err = response as any as ErrorData;
        if (
          err?.error?.data?.message?.toLowerCase()?.includes('login') ||
          err?.error?.data?.message?.toLowerCase()?.includes('unauthorized') ||
          err?.error?.status === 401
        ) {
          dispatch(signUserOut());
          return;
        }
      }
      dispatch(
        setUserPosts({
          posts: (response as any)?.data?.data,
        }),
      );
    } catch (error) {
      console.log('posts error', JSON.stringify(error));
    }
  }, [dispatch, getUserPosts, token, user]);

  const loadUserWorks = useCallback(async () => {
    try {
      if (!token || !user) {
        return;
      }
      const response = await getUserWorks(user?.id);
      if ((response as any)?.error) {
        const err = response as any as ErrorData;
        if (
          err?.error?.data?.message?.toLowerCase()?.includes('login') ||
          err?.error?.data?.message?.toLowerCase()?.includes('unauthorized') ||
          err?.error?.status === 401
        ) {
          dispatch(signUserOut());
          return;
        }
      }
      dispatch(
        setUserWorks({
          works: (response as any)?.data?.data,
        }),
      );
    } catch (error) {
      console.log('posts error', JSON.stringify(error));
    }
  }, [dispatch, getUserWorks, token, user]);

  const fetchAllPosts = useCallback(async () => {
    try {
      if (!token) {
        return;
      }
      const response = await getPosts({
        params: { page: 1, limit: 10 }
      });
      if ((response as any)?.error) {
        const err = response as any as ErrorData;
        if (
          err?.error?.data?.message?.toLowerCase()?.includes('login') ||
          err?.error?.data?.message?.toLowerCase()?.includes('unauthorized') ||
          err?.error?.status === 401
        ) {
          dispatch(signUserOut());
          return;
        }
      }
      dispatch(
        setAllPosts({
          posts: (response as any)?.data?.data,
        }),
      );
    } catch (error) {
      console.log('posts error', JSON.stringify(error));
    }
  }, [dispatch, getPosts, token]);

  return useMemo(
    () => ({
      loadPosts: fetchAllPosts,
      allpostsLoading,
      loadUserPosts,
      userpostsLoading,
      loadUserWorks,
      userWorksLoading,
    }),
    [
      fetchAllPosts,
      allpostsLoading,
      loadUserPosts,
      userpostsLoading,
      loadUserWorks,
      userWorksLoading,
    ],
  );
};
