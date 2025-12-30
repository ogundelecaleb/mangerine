import React, { useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { MainStack } from '../utils/ParamList';
import BottomTabNavigator from './BottomTabNavigator';
import { useAuth } from '../state/hooks/user.hook';
import { useLoadAuth } from '../state/hooks/loadauth.hook';
import { setAuthTrigger } from '../state/reducers/user.reducer';
import { useLoadPosts } from '../state/hooks/loadposts.hook';

// Import auth screens
import OnboardingScreen from '../screens/Authentication/OnboardingScreen';
import LoginScreen from '../screens/Authentication/LoginScreen';
import SignupScreen from '../screens/Authentication/SignupScreen';
import SignupOTPScreen from '../screens/Authentication/SignupOTPScreen';
import FinishRegistrationScreen from '../screens/Authentication/FinishRegistrationScreen';
import SignupAvatarScreen from '../screens/Authentication/SignupAvatarScreen';
import ForgotPasswordScreen from '../screens/Authentication/ForgotPasswordScreen';
import ForgotPasswordOTPScreen from '../screens/Authentication/ForgotPasswordOTPScreen';
import ResetPasswordScreen from '../screens/Authentication/ResetPasswordScreen';

// Import main screens
import CreatePostScreen from '../screens/Post/CreatePostScreen';
import EditProfileScreen from '../screens/Main/EditProfileScreen';
import SettingsScreen from '../screens/Main/SettingsScreen';
import UpdateContactScreen from '../screens/Main/UpdateContactScreen';
import UserFollowersScreen from '../screens/Main/UserFollowersScreen';
import UserFollowingScreen from '../screens/Main/UserFollowingScreen';
import {
  ManageExperienceScreen,
  UserPostsScreen,
} from '../screens/Main/ProfileManagementScreens';
import BookConsultationScreen from '../screens/Main/BookConsultationScreen';
import MyConsultationScreen from '../screens/Main/MyConsultationScreen';
import AddConsultancyScreen from '../screens/Main/AddConsultancyScreen';
import PayConsultationScreen from '../screens/Main/PayConsultationScreen';
import RescheduleConsultationScreen from '../screens/Main/RescheduleConsultationScreen';
import ScheduledConsultationScreen from '../screens/Main/ScheduledConsultationScreen';
import FavoriteConsultantsScreen from '../screens/Main/FavoriteConsultantsScreen';
import MyBusinessScreen from '../screens/Main/MyBusinessScreen';
import MyDashboardScreen from '../screens/Main/MyDashboardScreen';
import AvailabilitySettingsScreen from '../screens/Main/AvailabilitySettingsScreen';
import MeetingPreferenceScreen from '../screens/Main/MeetingPreferenceScreen';
import PricingScreen from '../screens/Main/PricingScreen';
import CalendarViewScreen from '../screens/Main/CalendarViewScreen';
import UserWorksScreen from '@/screens/Main/UserWorksScreen';
import AddWorkScreen from '@/screens/Main/AddWorkScreen';
import ManageLanguagesScreen from '@/screens/Main/ManageLanguagesScreen';
import ManageSkillsScreen from '@/screens/Main/ManageSkillsScreen';
import ManageEducationScreen from '@/screens/Main/ManageEducationScreen';

const Stack = createNativeStackNavigator<MainStack>();

const MainNavigator = () => {
  let token, authTrigger, authBlocked, user;
  
  try {
    const authResult = useAuth();
    
    
    if (authResult && typeof authResult === 'object') {
      ({ token, authTrigger, authBlocked, user } = authResult);
    } else {
      // Fallback values
      token = undefined;
      authTrigger = false;
      authBlocked = false;
      user = null;
    }
  } catch (error) {
    console.error('Error in useAuth:', error);
    // Fallback values
    token = undefined;
    authTrigger = false;
    authBlocked = false;
    user = null;
  }
  const {
    loadAuth,
    profileLoading,
    loadUserSkills,
    loadUserEducation,
    loadUserExperience,
    loadUserLanguages,
    loadUserFollowers,
    loadUserFollows,
    loadUserConsultancy,
    loadPricing,
  } = useLoadAuth();
  const { loadUserPosts, loadUserWorks } = useLoadPosts();
  const dispatch = useDispatch();

  const runMain = useCallback(() => {
    loadAuth();
    loadUserPosts();
    loadUserWorks();
    loadUserSkills();
    loadUserEducation();
    loadUserExperience();
    loadUserLanguages();
    loadUserFollowers();
    loadUserFollows();
    loadUserConsultancy();
    loadPricing();
  }, [
    loadAuth,
    loadUserPosts,
    loadUserWorks,
    loadUserSkills,
    loadUserEducation,
    loadUserExperience,
    loadUserLanguages,
    loadUserFollows,
    loadUserFollowers,
    loadUserConsultancy,
    loadPricing,
  ]);

  useEffect(() => {
    if (authTrigger && token && !profileLoading) {
      runMain();
      dispatch(setAuthTrigger({ trigger: false }));
    }
  }, [authTrigger, runMain, dispatch, profileLoading, token]);

  useEffect(() => {
    dispatch(
      setAuthTrigger({
        trigger: true,
      }),
    );
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        
        {!(token && user && !authBlocked) ? (
          <Stack.Group>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ForgotPasswordOTP" component={ForgotPasswordOTPScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="SignupOTP" component={SignupOTPScreen} />
            <Stack.Screen name="FinishRegistration" component={FinishRegistrationScreen} />
            <Stack.Screen name="SignupAvatar" component={SignupAvatarScreen} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Tabs" component={BottomTabNavigator} />
            <Stack.Screen name="CreatePost" component={CreatePostScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="AddWork" component={AddWorkScreen} />
            <Stack.Screen name="AddConsultancy" component={AddConsultancyScreen} />
            <Stack.Screen name="UserPosts" component={UserPostsScreen} />
            <Stack.Screen name="UserWorks" component={UserWorksScreen} />
            <Stack.Screen name="UpdateContact" component={UpdateContactScreen} />
            <Stack.Screen name="ManageSkills" component={ManageSkillsScreen} />
            <Stack.Screen name="ManageEducation" component={ManageEducationScreen} />
            <Stack.Screen name="ManageExperience" component={ManageExperienceScreen} />
            <Stack.Screen name="ManageLanguages" component={ManageLanguagesScreen} />
            <Stack.Screen name="BookConsultation" component={BookConsultationScreen} />
            <Stack.Screen name="PayConsultation" component={PayConsultationScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="MyBusiness" component={MyBusinessScreen} />
            <Stack.Screen name="Dashboard" component={MyDashboardScreen} />
            <Stack.Screen name="AvailabilitySettings" component={AvailabilitySettingsScreen} />
            <Stack.Screen name="MeetingPreference" component={MeetingPreferenceScreen} />
            <Stack.Screen name="Pricing" component={PricingScreen} />
            <Stack.Screen name="CalendarView" component={CalendarViewScreen} />
            <Stack.Screen name="MyConsultation" component={MyConsultationScreen} />
            <Stack.Screen name="ScheduledConsultation" component={ScheduledConsultationScreen} />
            <Stack.Screen name="RescheduleConsultation" component={RescheduleConsultationScreen} />
            <Stack.Screen name="FavouriteConsultants" component={FavoriteConsultantsScreen} />
            <Stack.Screen name="UserFollowing" component={UserFollowingScreen} />
            <Stack.Screen name="UserFollowers" component={UserFollowersScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;