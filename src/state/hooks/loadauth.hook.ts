import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { ErrorData } from '@/utils/types';
import {
  signUserOut,
  updateCredentials,
  setUserTypes,
  setInterests,
  setSkills,
  setEducation,
  setExperience,
  setLanguages,
  setFollowers,
  setFollowersCount,
  setFollows,
  setFollowsCount,
  setServices,
  setPricingData,
} from '../reducers/user.reducer';
import {
  useGetUserTypesQuery,
  useGetInterestsQuery,
} from '../services/auth.service';
import { useAuth } from './user.hook';
import {
  useGetConsultancyMutation,
  useGetFollowersMutation,
  useGetFollowingMutation,
  useGetLanguagesMutation,
  useGetSkillsMutation,
  useGetUserInfoMutation,
} from '../services/users.service';
import { showMessage } from 'react-native-flash-message';
import { useGetConsultantPricingMutation } from '../services/consultants.service';
import { useGetEducationsMutation } from '../services/education.service copy';
import { useGetExperiencesMutation } from '../services/experience.service';

export const useLoadAuth = () => {
  const authResult = useAuth();
  const { token, user } = authResult || { token: undefined, user: null };
  
  const dispatch = useDispatch();
  const [authenticate, { isLoading }] = useGetUserInfoMutation();
  const interestsQuery = useGetInterestsQuery();
  const typesQuery = useGetUserTypesQuery();
  const [getSkills, { isLoading: skillsLoading }] = useGetSkillsMutation();
  const [getEducation, { isLoading: educationLoading }] =
    useGetEducationsMutation();
  const [getExperience, { isLoading: experienceLoading }] =
    useGetExperiencesMutation();
  const [getLangages, { isLoading: languagesLoading }] =
    useGetLanguagesMutation();
  const [getFollowers, { isLoading: followersLoading }] =
    useGetFollowersMutation();
  const [getFollows, { isLoading: followsLoading }] = useGetFollowingMutation();
  const [getConsultancy, { isLoading: consultancyLoading }] =
    useGetConsultancyMutation();
  const [getPricing, { isLoading: pricingLoading }] =
    useGetConsultantPricingMutation();

  const runAuth = useCallback(async () => {
    try {
      if (!token) {
        return;
      }
      const response = await authenticate({
        id: user?.id!,
      });
      // console.log('auth-response', JSON.stringify(response));
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
        updateCredentials({
          user: (response as { data: any }).data,
        }),
      );
    } catch (error) {
      console.log('errorauth', JSON.stringify(error));
    }
  }, [authenticate, dispatch, token, user]);

  const loadInterests = useCallback(async () => {
    try {
      if (interestsQuery.data) {
        dispatch(
          setInterests({
            value: interestsQuery.data?.data,
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [interestsQuery.data, dispatch]);

  const loadUserTypes = useCallback(async () => {
    try {
      if (typesQuery.data) {
        dispatch(
          setUserTypes({
            value: typesQuery.data?.data,
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [typesQuery.data, dispatch]);

  const loadUserSkills = useCallback(async () => {
    try {
      const response = await getSkills({});
      // console.log('fetchTypes response:', JSON.stringify(response));
      if (response?.error) {
        const err = response as ErrorData;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
      dispatch(
        setSkills({
          value: (response as any)?.data?.data,
        }),
      );
    } catch (error) {
      console.log(error);
      const err = error as ErrorData;
      showMessage({
        message:
          err?.error?.data?.message ||
          err?.error?.data?.error ||
          'Something went wrong',
        type: 'danger',
      });
    }
  }, [getSkills, dispatch]);

  const loadUserEducation = useCallback(async () => {
    try {
      const response = await getEducation({});
      // console.log('fetchTypes response:', JSON.stringify(response));
      if (response?.error) {
        const err = response as ErrorData;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
      dispatch(
        setEducation({
          value: (response as any)?.data?.data,
        }),
      );
    } catch (error) {
      console.log(error);
      const err = error as ErrorData;
      showMessage({
        message:
          err?.error?.data?.message ||
          err?.error?.data?.error ||
          'Something went wrong',
        type: 'danger',
      });
    }
  }, [getEducation, dispatch]);

  const loadUserExperience = useCallback(async () => {
    try {
      const response = await getExperience({});
      // console.log('fetchTypes response:', JSON.stringify(response));
      if (response?.error) {
        const err = response as ErrorData;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
      dispatch(
        setExperience({
          value: (response as any)?.data?.data,
        }),
      );
    } catch (error) {
      console.log(error);
      const err = error as ErrorData;
      showMessage({
        message:
          err?.error?.data?.message ||
          err?.error?.data?.error ||
          'Something went wrong',
        type: 'danger',
      });
    }
  }, [getExperience, dispatch]);

  const loadUserLanguages = useCallback(async () => {
    try {
      const response = await getLangages({});
      // console.log('fetchTypes response:', JSON.stringify(response));
      if (response?.error) {
        const err = response as ErrorData;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
      dispatch(
        setLanguages({
          value: (response as any)?.data?.data,
        }),
      );
    } catch (error) {
      console.log(error);
      const err = error as ErrorData;
      showMessage({
        message:
          err?.error?.data?.message ||
          err?.error?.data?.error ||
          'Something went wrong',
        type: 'danger',
      });
    }
  }, [getLangages, dispatch]);

  const loadUserFollowers = useCallback(async () => {
    try {
      const response = await getFollowers({
        id: user?.id!,
        params: {
          limit: 10000,
          page: 1,
        },
      });
      // console.log('followers response', JSON.stringify(response));
      if (response?.error) {
        const err = response as ErrorData;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
      dispatch(
        setFollowers({
          value: (response as any)?.data?.data || [],
        }),
      );
      dispatch(
        setFollowersCount({
          value: (response as any)?.data?.total || 0,
        }),
      );
      // setUpdatedUser((response as any)?.data?.data?.consultant);
    } catch (error) {
      console.log('get followers error', JSON.stringify(error));
    }
  }, [getFollowers, user, dispatch]);

  const loadUserFollows = useCallback(async () => {
    try {
      const response = await getFollows({
        id: user?.id!,
        params: {
          limit: 10000,
          page: 1,
        },
      });
      // console.log('follows response', JSON.stringify(response));
      if (response?.error) {
        const err = response as ErrorData;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
      dispatch(
        setFollows({
          value: (response as any)?.data?.data || [],
        }),
      );
      dispatch(
        setFollowsCount({
          value: (response as any)?.data?.total || 0,
        }),
      );
    } catch (error) {
      console.log('get follows error', JSON.stringify(error));
    }
  }, [getFollows, user, dispatch]);

  const loadUserConsultancy = useCallback(async () => {
    try {
      const response = await getConsultancy({});
      // console.log('consultancy response', JSON.stringify(response));
      if (response?.error) {
        const err = response as ErrorData;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
      dispatch(
        setServices({
          value: (response as any)?.data?.data || [],
        }),
      );
    } catch (error) {
      console.log('get follows error', JSON.stringify(error));
    }
  }, [getConsultancy, dispatch]);

  const loadPricing = useCallback(async () => {
    try {
      const response = await getPricing({
        id: user?.id!,
      });
      // console.log('loadPricing response:', JSON.stringify(response));
      if (response?.error) {
        const err = response as ErrorData;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
      dispatch(
        setPricingData({
          value: (response as any)?.data?.data?.consultant?.pricing,
        }),
      );
    } catch (error) {
      console.log('postPricing error:', error);
    }
  }, [getPricing, dispatch, user]);

  return {
    loadAuth: runAuth,
    profileLoading: isLoading,
    loadInterests,
    interestsLoading: interestsQuery.isLoading,
    loadUserTypes,
    userTypesLoading: typesQuery.isLoading,
    loadUserSkills,
    skillsLoading,
    loadUserEducation,
    educationLoading,
    loadUserExperience,
    experienceLoading,
    loadUserLanguages,
    languagesLoading,
    loadUserFollowers,
    followersLoading,
    loadUserFollows,
    followsLoading,
    loadUserConsultancy,
    consultancyLoading,
    loadPricing,
    pricingLoading,
  };
};