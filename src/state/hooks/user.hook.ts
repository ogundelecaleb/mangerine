import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const user = useSelector((state: RootState) => state.user);
  
  return {
    user: auth.user, // User data is in auth slice
    token: auth.token,
    isAuthenticated: !!auth.token,
    authTrigger: user.authTrigger, // authTrigger is in user slice
    authBlocked: user.authBlocked,
    skills: user.skills || [],
    education: user.education || [],
    experience: user.experience || [],
    languages: user.languages || [],
    followers: user.followers || [],
    follows: user.follows || [],
    followerCount: user.followerCount || 0,
    followsCount: user.followsCount || 0,
    services: user.services || [],
    pricingData: user.pricingData,
    works: [],
  };
};