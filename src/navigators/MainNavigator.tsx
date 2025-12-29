import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { MainStack } from '../utils/ParamList';
import BottomTabNavigator from './BottomTabNavigator';
import { useAppSelector } from '../state/hooks/redux';
import { useAuth } from '../state/hooks/user.hook';
import { useLoadAuth } from '../state/hooks/loadauth.hook';
import { setAuthTrigger } from '../state/reducers/user.reducer';

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

import UpdateContactScreen from '../screens/Main/UpdateContactScreen';
import UserFollowersScreen from '../screens/Main/UserFollowersScreen';
import UserFollowingScreen from '../screens/Main/UserFollowingScreen';
import {
  ManageSkillsScreen,
  ManageEducationScreen,
  ManageExperienceScreen,
  ManageLanguagesScreen,
  UserPostsScreen,
  UserWorksScreen,
  AddWorkScreen,
} from '../screens/Main/ProfileManagementScreens';
import EditProfileScreen from '../screens/Main/EditProfileScreen';
import SettingsScreen from '../screens/Main/SettingsScreen';
// import PostDetailsScreen from '../screens/Post/PostDetailsScreen';
import CreatePostScreen from '../screens/Post/CreatePostScreen';
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

const Stack = createNativeStackNavigator<MainStack>();

const MainNavigator = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { authTrigger, token } = useAuth();
  const { loadAuth, profileLoading } = useLoadAuth();
  const dispatch = useDispatch();

  // Handle authTrigger to reload user data
  useEffect(() => {
    if (authTrigger && token && !profileLoading) {
      loadAuth();
      dispatch(setAuthTrigger({ trigger: false }));
    }
  }, [authTrigger, loadAuth, dispatch, profileLoading, token]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        
        {!isAuthenticated ? (
          // Auth screens
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="SignupOTP" component={SignupOTPScreen} />
            <Stack.Screen name="FinishRegistration" component={FinishRegistrationScreen} />
            <Stack.Screen name="SignupAvatar" component={SignupAvatarScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ForgotPasswordOTP" component={ForgotPasswordOTPScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
        ) : (
          // Main app screens
          <>
            <Stack.Screen name="Tabs" component={BottomTabNavigator} />
            
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="UpdateContact" component={UpdateContactScreen} />
            <Stack.Screen name="UserFollowers" component={UserFollowersScreen} />
            <Stack.Screen name="UserFollowing" component={UserFollowingScreen} />
            <Stack.Screen name="ManageSkills" component={ManageSkillsScreen} />
            <Stack.Screen name="ManageEducation" component={ManageEducationScreen} />
            <Stack.Screen name="ManageExperience" component={ManageExperienceScreen} />
            <Stack.Screen name="ManageLanguages" component={ManageLanguagesScreen} />
           {/* <Stack.Screen name="UserPosts" component={UserPostsScreen} />
            <Stack.Screen name="UserWorks" component={UserWorksScreen} />
            <Stack.Screen name="AddWork" component={AddWorkScreen} /> */}
            {/* <Stack.Screen name="PostDetails" component={PostDetailsScreen} /> */}
            <Stack.Screen name="CreatePost" component={CreatePostScreen} />
            <Stack.Screen name="BookConsultation" component={BookConsultationScreen} />
            <Stack.Screen name="PayConsultation" component={PayConsultationScreen} />
            <Stack.Screen name="RescheduleConsultation" component={RescheduleConsultationScreen} />
            <Stack.Screen name="ScheduledConsultation" component={ScheduledConsultationScreen} />
            <Stack.Screen name="FavouriteConsultants" component={FavoriteConsultantsScreen} />
            <Stack.Screen name="MyBusiness" component={MyBusinessScreen} />
            <Stack.Screen name="Dashboard" component={MyDashboardScreen} />
            <Stack.Screen name="AvailabilitySettings" component={AvailabilitySettingsScreen} />
            <Stack.Screen name="MeetingPreference" component={MeetingPreferenceScreen} />
            <Stack.Screen name="Pricing" component={PricingScreen} />
            <Stack.Screen name="CalendarView" component={CalendarViewScreen} />
            <Stack.Screen name="MyConsultation" component={MyConsultationScreen} />
            <Stack.Screen name="AddConsultancy" component={AddConsultancyScreen} />
            
            {/* Modal screens that appear over tabs */}
            {/* <Stack.Screen name="CreatePost" component={CreatePostScreen} />
            <Stack.Screen name="EditPost" component={EditPostScreen} />
            <Stack.Screen name="PostDetails" component={PostDetailsScreen} />
            <Stack.Screen name="ViewProfile" component={ViewProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="BookConsultation" component={BookConsultationScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} /> */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;