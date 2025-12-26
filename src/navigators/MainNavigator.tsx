import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStack } from '../utils/ParamList';
import BottomTabNavigator from './BottomTabNavigator';
import { useAppSelector } from '../state/hooks/redux';

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
import EditProfileScreen from '../screens/Main/EditProfileScreen';
import SettingsScreen from '../screens/Main/SettingsScreen';
import PostDetailsScreen from '../screens/Post/PostDetailsScreen';
import CreatePostScreen from '../screens/Post/CreatePostScreen';
import BookConsultationScreen from '../screens/Main/BookConsultationScreen';
import MyConsultationScreen from '../screens/Main/MyConsultationScreen';
import AddConsultancyScreen from '../screens/Main/AddConsultancyScreen';

const Stack = createNativeStackNavigator<MainStack>();

const MainNavigator = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

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
            
            {/* Profile and Settings screens */}
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="PostDetails" component={PostDetailsScreen} />
            <Stack.Screen name="CreatePost" component={CreatePostScreen} />
            {/* <Stack.Screen name="EditPost" component={EditPostScreen} /> */}
            <Stack.Screen name="BookConsultation" component={BookConsultationScreen} />
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