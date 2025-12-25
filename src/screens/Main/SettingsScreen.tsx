import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MainStack } from '../../utils/ParamList';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import Box from '../../components/Box';
import Text from '../../components/Text';
import { useThemeColors } from '../../hooks/useTheme';

type Props = NativeStackScreenProps<MainStack, 'Settings'>;

const SettingsScreen = ({ navigation }: Props) => {
  const { label, primary } = useThemeColors();

  const settingsOptions = [
    {
      title: 'Account Settings',
      icon: 'person-outline',
      screen: 'AccountSettings',
      description: 'Manage your account preferences',
    },
    {
      title: 'Privacy Settings',
      icon: 'shield-outline',
      screen: 'PrivacySettings',
      description: 'Control your privacy and data',
    },
    {
      title: 'Notification Settings',
      icon: 'notifications-outline',
      screen: 'NotificationSettings',
      description: 'Manage your notifications',
    },
    {
      title: 'Payment Settings',
      icon: 'card-outline',
      screen: 'PaymentSettings',
      description: 'Manage payment methods',
    },
    {
      title: 'Security Settings',
      icon: 'lock-closed-outline',
      screen: 'SecuritySettings',
      description: 'Password and security options',
    },
    {
      title: 'General Settings',
      icon: 'settings-outline',
      screen: 'GeneralSettings',
      description: 'App preferences and settings',
    },
    {
      title: 'Help & Support',
      icon: 'help-circle-outline',
      screen: 'HelpAndSupport',
      description: 'Get help and contact support',
    },
  ];

  return (
    <BaseScreenComponent>
      <Box flex={1} backgroundColor="background">
        {/* Header */}
        <Box 
          flexDirection="row" 
          alignItems="center" 
          paddingHorizontal="l"
          paddingVertical="m"
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={label} />
          </TouchableOpacity>
          
          <Text variant="bold" fontSize={20} marginLeft="m">
            Settings
          </Text>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Box paddingHorizontal="l" gap="xs">
            {settingsOptions.map((option, index) => (
              <TouchableOpacity 
                key={index}
                onPress={() => navigation.navigate(option.screen as any)}
              >
                <Box 
                  flexDirection="row" 
                  alignItems="center" 
                  paddingVertical="m"
                  borderBottomWidth={1}
                  borderBottomColor="faded_border"
                >
                  <Box 
                    width={40} 
                    height={40} 
                    borderRadius={20} 
                    backgroundColor="minute_black"
                    justifyContent="center" 
                    alignItems="center"
                    marginRight="m"
                  >
                    <Ionicons 
                      name={option.icon as any} 
                      size={20} 
                      color={primary} 
                    />
                  </Box>
                  
                  <Box flex={1}>
                    <Text variant="medium" fontSize={16} marginBottom="xs">
                      {option.title}
                    </Text>
                    <Text variant="regular" fontSize={14} color="label">
                      {option.description}
                    </Text>
                  </Box>
                  
                  <Ionicons name="chevron-forward" size={20} color={label} />
                </Box>
              </TouchableOpacity>
            ))}
          </Box>
        </ScrollView>
      </Box>
    </BaseScreenComponent>
  );
};

export default SettingsScreen;