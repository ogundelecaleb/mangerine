import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabList } from '../utils/ParamList';
import { useThemeColors } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

// Import tab screens
import HomeScreen from '../screens/Tabs/HomeScreen';
import ConsultantScreen from '../screens/Tabs/ConsultantScreen';
// import MessageScreen from '../screens/Tabs/MessageScreen';
// import CommunitiesScreen from '../screens/Tabs/CommunitiesScreen';

// Temporary placeholder screens
import PlaceholderScreen from '../screens/PlaceholderScreen';

// Import profile screen
import ProfileScreen from '../screens/Tabs/ProfileScreen';

const Tab = createBottomTabNavigator<BottomTabList>();

const BottomTabNavigator = () => {
  const { primary, label, background, primary_background } = useThemeColors();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Consultant':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Message':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            case 'Communities':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={focused ? primary : label}
            />
          );
        },
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: label,
        tabBarStyle: {
          backgroundColor: primary_background,
          borderTopWidth: 1,
          borderTopColor: '#E8E8E9',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Outfit-Medium',
        },
      })}>
      
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
      />
      <Tab.Screen 
        name="Consultant" 
        component={ConsultantScreen}
      />
      <Tab.Screen 
        name="Message" 
        component={PlaceholderScreen}
        initialParams={{ title: 'Messages' }}
      />
      <Tab.Screen 
        name="Communities" 
        component={PlaceholderScreen}
        initialParams={{ title: 'Communities' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;