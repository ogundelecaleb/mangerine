import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Box from './Box';
import Text from './Text';
import EmptyState from './EmptyState';
import { MainStack } from '../utils/ParamList';
import { useAuth } from '../state/hooks/user.hook';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../utils/theme';

const ProfileWorksSection = () => {
  const { works = [] } = useAuth();
  const theme = useTheme<Theme>();
  const navigation = useNavigation<NativeStackNavigationProp<MainStack>>();

  return (
    <Box marginTop="l">
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Box flex={1}>
          <Text variant="semibold" fontSize={18}>
            Works
          </Text>
        </Box>
        <Box>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('UserWorks');
            }}>
            <MaterialCommunityIcons
              name="pencil"
              size={18}
              color={theme.colors.foreground}
            />
          </TouchableOpacity>
        </Box>
      </Box>
      <Box marginTop="m">
        {works.length > 0 ? (
          <Box>
            {works.slice(0, 3).map((work, index) => (
              <Box key={work.id || index} marginBottom="m">
                <Box
                  height={120}
                  borderRadius={8}
                  backgroundColor="faded"
                  overflow="hidden"
                  justifyContent="center"
                  alignItems="center">
                  <Text color="label">Work Item {index + 1}</Text>
                </Box>
                <Box marginTop="xs">
                  <Text variant="semibold" fontSize={14}>
                    {work.title}
                  </Text>
                  <Text fontSize={12} color="label" numberOfLines={2}>
                    {work.description}
                  </Text>
                </Box>
              </Box>
            ))}
            {works.length > 3 && (
              <Box alignItems="center" marginTop="s">
                <TouchableOpacity
                  onPress={() => navigation.navigate('UserWorks')}>
                  <Text fontSize={14} variant="semibold" color="primary">
                    View all works
                  </Text>
                </TouchableOpacity>
              </Box>
            )}
          </Box>
        ) : (
          <EmptyState
            subtitle="No works added yet"
            buttonText="Add Work"
            doSomething={() => {
              navigation.navigate('AddWork');
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default ProfileWorksSection;