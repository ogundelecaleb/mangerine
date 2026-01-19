import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { BottomTabList } from '../utils/ParamList';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../utils/theme';
import BottomTabBar from '../components/BottomTabBar';

import ProfileScreen from '../screens/Tabs/ProfileScreen';
import HomeScreen from '../screens/Tabs/HomeScreen';
import ConsultantScreen from '../screens/Tabs/ConsultantScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import MessageScreen from '../screens/Tabs/MessageScreen';
import HomeSVG from '@/assets/svgs/HomeSVG';
import HeadphoneSVG from '@/assets/svgs/HeadphoneSVG';

const Tab = createBottomTabNavigator<BottomTabList>();

const BottomTabNavigator = () => {
  const theme = useTheme<Theme>();

  return (
    <Tab.Navigator
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              // <MaterialCommunityIcons name="home" size={20} color={theme.colors.primary} />
              <HomeSVG size={20} color={theme.colors.primary} />
            ) : (
              <MaterialCommunityIcons
                name="home-outline"
                size={20}
                color={theme.colors.primary}
              />
            ),
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="Consultant"
        component={ConsultantScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <HeadphoneSVG size={20} color={theme.colors.primary} />
            ) : (
              <MaterialCommunityIcons
                name="headset"
                size={20}
                color={theme.colors.primary}
              />
            ),
          title: 'Consultation',
        }}
      />
      <Tab.Screen
        name="Message"
        component={MessageScreen}
        initialParams={{ title: 'Messages' }}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="message"
                size={20}
                color={theme.colors.primary}
              />
            ) : (
              <MaterialCommunityIcons
                name="message-outline"
                size={20}
                color={theme.colors.primary}
              />
            ),
          title: 'Messages',
        }}
      />
      <Tab.Screen
        name="Communities"
        component={PlaceholderScreen}
        initialParams={{ title: 'Communities' }}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="account-group"
                size={20}
                color={theme.colors.primary}
              />
            ) : (
              <MaterialCommunityIcons
                name="account-group-outline"
                size={20}
                color={theme.colors.primary}
              />
            ),
          title: 'Groups',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="account"
                size={20}
                color={theme.colors.primary}
              />
            ) : (
              <MaterialCommunityIcons
                name="account-outline"
                size={20}
                color={theme.colors.primary}
              />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
