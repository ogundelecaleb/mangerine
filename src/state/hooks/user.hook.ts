import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthValues } from '../reducers/user.reducer';


export const useAuth = () => {
  const authValues = useSelector(selectAuthValues);
  
  // If authValues is undefined, return default state
  if (!authValues) {
    return {
      token: undefined,
      authTrigger: false,
      authBlocked: false,
      user: null,
      interests: [],
      userTypes: [],
      skills: [],
      education: [],
      experience: [],
      languages: [],
      followers: [],
      services: [],
      follows: [],
      followerCount: 0,
      followsCount: 0,
      pricingData: {
        flatPrice: '0',
        dayBookPercentage: 0,
        midDayBookPercentage: 0,
        twoHoursDiscount: 0,
        threeHoursDiscount: 0,
        fourHoursDiscount: 0,
        otherHoursDiscount: 0,
      },
    };
  }
  
  return {
    token: authValues.token ?? undefined,
    authTrigger: authValues.authTrigger ?? false,
    authBlocked: authValues.authBlocked ?? false,
    user: authValues.user ?? null,
    interests: authValues.interests ?? [],
    userTypes: authValues.userTypes ?? [],
    skills: authValues.skills ?? [],
    education: authValues.education ?? [],
    experience: authValues.experience ?? [],
    languages: authValues.languages ?? [],
    followers: authValues.followers ?? [],
    services: authValues.services ?? [],
    follows: authValues.follows ?? [],
    followerCount: authValues.followerCount ?? 0,
    followsCount: authValues.followsCount ?? 0,
    pricingData: authValues.pricingData ?? {
      flatPrice: '0',
      dayBookPercentage: 0,
      midDayBookPercentage: 0,
      twoHoursDiscount: 0,
      threeHoursDiscount: 0,
      fourHoursDiscount: 0,
      otherHoursDiscount: 0,
    },
  };
};
