import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Box from '../../components/Box';
import Text from '../../components/Text';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import { MainStack } from '../../utils/ParamList';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../utils/theme';

// ManageSkillsScreen
export const ManageSkillsScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'ManageSkills'>) => {
  const theme = useTheme<Theme>();

  return (
    <BaseScreenComponent>
      <Box flex={1} backgroundColor="background">
        <SafeAreaView style={{ flex: 1 }}>
          <Box flex={1}>
            <Box
              flexDirection="row"
              alignItems="center"
              paddingHorizontal="l"
              gap="m"
              paddingVertical="m">
              <TouchableOpacity
                onPress={navigation.goBack}
                style={{ padding: 8, paddingLeft: 0 }}>
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={24}
                  color={theme.colors.foreground}
                />
              </TouchableOpacity>
              <Box flex={1} alignItems="center">
                <Text variant="semibold" fontSize={20}>
                  Manage Skills
                </Text>
              </Box>
              <Box padding="s" opacity={0} />
            </Box>
            <Box flex={1} justifyContent="center" alignItems="center">
              <Text>Manage Skills - Coming Soon</Text>
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};



// ManageExperienceScreen
export const ManageExperienceScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'ManageExperience'>) => {
  const theme = useTheme<Theme>();

  return (
    <BaseScreenComponent>
      <Box flex={1} backgroundColor="background">
        <SafeAreaView style={{ flex: 1 }}>
          <Box flex={1}>
            <Box
              flexDirection="row"
              alignItems="center"
              paddingHorizontal="l"
              gap="m"
              paddingVertical="m">
              <TouchableOpacity
                onPress={navigation.goBack}
                style={{ padding: 8, paddingLeft: 0 }}>
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={24}
                  color={theme.colors.foreground}
                />
              </TouchableOpacity>
              <Box flex={1} alignItems="center">
                <Text variant="semibold" fontSize={20}>
                  Manage Experience
                </Text>
              </Box>
              <Box padding="s" opacity={0} />
            </Box>
            <Box flex={1} justifyContent="center" alignItems="center">
              <Text>Manage Experience - Coming Soon</Text>
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};



// UserPostsScreen
export const UserPostsScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'UserPosts'>) => {
  const theme = useTheme<Theme>();

  return (
    <BaseScreenComponent>
      <Box flex={1} backgroundColor="background">
        <SafeAreaView style={{ flex: 1 }}>
          <Box flex={1}>
            <Box
              flexDirection="row"
              alignItems="center"
              paddingHorizontal="l"
              gap="m"
              paddingVertical="m">
              <TouchableOpacity
                onPress={navigation.goBack}
                style={{ padding: 8, paddingLeft: 0 }}>
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={24}
                  color={theme.colors.foreground}
                />
              </TouchableOpacity>
              <Box flex={1} alignItems="center">
                <Text variant="semibold" fontSize={20}>
                  My Posts
                </Text>
              </Box>
              <Box padding="s" opacity={0} />
            </Box>
            <Box flex={1} justifyContent="center" alignItems="center">
              <Text>User Posts - Coming Soon</Text>
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};


