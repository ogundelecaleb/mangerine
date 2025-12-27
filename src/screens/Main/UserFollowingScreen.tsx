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

const UserFollowingScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<MainStack, 'UserFollowing'>) => {
  const theme = useTheme<Theme>();
  const { user, users } = route.params;

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
              <Box>
                <TouchableOpacity
                  onPress={navigation.goBack}
                  style={{ padding: 8, paddingLeft: 0 }}>
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={24}
                    color={theme.colors.foreground}
                  />
                </TouchableOpacity>
              </Box>
              <Box flex={1} alignItems="center">
                <Text variant="semibold" fontSize={20}>
                  Following
                </Text>
              </Box>
              <Box padding="s" opacity={0}>
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={24}
                  color={theme.colors.foreground}
                />
              </Box>
            </Box>
            <Box flex={1} justifyContent="center" alignItems="center">
              <Text>Following Screen - Coming Soon</Text>
              <Text color="label" marginTop="s">
                {users.length} following
              </Text>
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};

export default UserFollowingScreen;