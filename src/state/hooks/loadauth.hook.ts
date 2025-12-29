import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from './user.hook';
import { useGetUserInfoQuery } from '../services/users.service';
import { setCredentials, logout } from '../reducers/authSlice';
import { ErrorData } from '../../utils/types';

export const useLoadAuth = () => {
  const { token, user } = useAuth();
  const dispatch = useDispatch();
  
  // Use the query to get user info, but skip if no user ID
  const { data, error, isLoading, refetch } = useGetUserInfoQuery(
    { id: user?.id || '' },
    { skip: !user?.id }
  );

  const loadAuth = useCallback(async () => {
    try {
      if (!token || !user?.id) {
        return;
      }
      
      // Refetch the user data
      const result = await refetch();
      
      if (result.error) {
        const err = result.error as any;
        if (
          err?.data?.message?.toLowerCase()?.includes('login') ||
          err?.data?.message?.toLowerCase()?.includes('unauthorized') ||
          err?.status === 401
        ) {
          dispatch(logout());
          return;
        }
      }
      
      if (result.data) {
        dispatch(
          setCredentials({
            user: result.data,
            token: token,
          }),
        );
      }
    } catch (error) {
      console.log('loadAuth error:', JSON.stringify(error));
    }
  }, [refetch, dispatch, token, user]);

  const loadUserConsultancy = useCallback(async () => {
    // Placeholder implementation
  }, []);

  return useMemo(
    () => ({
      loadAuth,
      profileLoading: isLoading,
      loadInterests: () => {},
      interestsLoading: false,
      loadUserTypes: () => {},
      userTypesLoading: false,
      loadUserSkills: () => {},
      skillsLoading: false,
      loadUserEducation: () => {},
      educationLoading: false,
      loadUserExperience: () => {},
      experienceLoading: false,
      loadUserLanguages: () => {},
      languagesLoading: false,
      loadUserFollowers: () => {},
      followersLoading: false,
      loadUserFollows: () => {},
      followsLoading: false,
      loadUserConsultancy,
      consultancyLoading: false,
      loadPricing: () => {},
      pricingLoading: false,
    }),
    [
      loadAuth,
      isLoading,
      loadUserConsultancy,
    ],
  );
};
