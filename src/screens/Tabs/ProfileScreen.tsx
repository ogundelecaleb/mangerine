import React from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabList } from '../../utils/ParamList';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import Box from '../../components/Box';
import Text from '../../components/Text';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import ScaledImage from '../../components/ScaledImage';
import { useGetInfoQuery } from '../../state/services/users.service';
import { useAppDispatch } from '../../state/hooks/redux';
import { logout } from '../../state/reducers/authSlice';
import { useThemeColors } from '../../hooks/useTheme';

type Props = BottomTabScreenProps<BottomTabList, 'Profile'>;

const ProfileScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { primary, label, faded_border } = useThemeColors();
  const { data: profile, isLoading, error } = useGetInfoQuery();

  const handleLogout = () => {
    dispatch(logout());
  };

  if (isLoading) {
    return (
      <BaseScreenComponent>
        <LoadingSpinner fullScreen text="Loading profile..." />
      </BaseScreenComponent>
    );
  }

  if (error) {
    return (
      <BaseScreenComponent>
        <Box flex={1} justifyContent="center" alignItems="center" paddingHorizontal="l">
          <Text variant="bold" fontSize={18} marginBottom="m">
            Failed to load profile
          </Text>
          <Button displayText="Try Again" onPress={() => {}} />
        </Box>
      </BaseScreenComponent>
    );
  }

  const user = profile?.data?.user;

  return (
    <BaseScreenComponent>
      <Box flex={1} backgroundColor="background">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Box 
            flexDirection="row" 
            justifyContent="space-between" 
            alignItems="center"
            paddingHorizontal="l"
            paddingVertical="m"
          >
            <Text variant="bold" fontSize={20}>
              Profile
            </Text>
            
            <TouchableOpacity onPress={() => navigation.navigate('Settings' as any)}>
              <Ionicons name="settings-outline" size={24} color={label} />
            </TouchableOpacity>
          </Box>

          {/* Profile Header */}
          <Box paddingHorizontal="l" marginBottom="l">
            <Box alignItems="center" gap="m">
              {/* Profile Picture */}
              <TouchableOpacity>
                <Box
                  width={100}
                  height={100}
                  borderRadius={50}
                  borderWidth={3}
                  borderColor="primary"
                  overflow="hidden"
                >
                  {user?.avatar ? (
                    <ScaledImage uri={user.avatar} width={94} height={94} />
                  ) : (
                    <Box 
                      flex={1} 
                      backgroundColor="faded" 
                      justifyContent="center" 
                      alignItems="center"
                    >
                      <Ionicons name="person" size={40} color={label} />
                    </Box>
                  )}
                </Box>
              </TouchableOpacity>

              {/* User Info */}
              <Box alignItems="center" gap="xs">
                <Text variant="bold" fontSize={24}>
                  {user?.fullName || 'User Name'}
                </Text>
                
                {user?.occupation && (
                  <Text variant="regular" fontSize={16} color="label">
                    {user.occupation}
                  </Text>
                )}
                
                {user?.location && (
                  <Box flexDirection="row" alignItems="center" gap="xs">
                    <Ionicons name="location-outline" size={16} color={label} />
                    <Text variant="regular" fontSize={14} color="label">
                      {user.location}
                    </Text>
                  </Box>
                )}
              </Box>

              {/* Stats */}
              <Box flexDirection="row" gap="xl" marginTop="m">
                <TouchableOpacity>
                  <Box alignItems="center">
                    <Text variant="bold" fontSize={18}>
                      {user?.followersCount || 0}
                    </Text>
                    <Text variant="regular" fontSize={14} color="label">
                      Followers
                    </Text>
                  </Box>
                </TouchableOpacity>
                
                <TouchableOpacity>
                  <Box alignItems="center">
                    <Text variant="bold" fontSize={18}>
                      {user?.followingCount || 0}
                    </Text>
                    <Text variant="regular" fontSize={14} color="label">
                      Following
                    </Text>
                  </Box>
                </TouchableOpacity>
                
                <TouchableOpacity>
                  <Box alignItems="center">
                    <Text variant="bold" fontSize={18}>
                      {user?.postsCount || 0}
                    </Text>
                    <Text variant="regular" fontSize={14} color="label">
                      Posts
                    </Text>
                  </Box>
                </TouchableOpacity>
              </Box>

              {/* Edit Profile Button */}
              <Button
                displayText="Edit Profile"
                onPress={() => navigation.navigate('EditProfile' as any)}
                buttonProps={{ 
                  backgroundColor: 'transparent', 
                  borderWidth: 1, 
                  borderColor: 'primary' 
                }}
                textProps={{ color: 'primary' }}
              />
            </Box>
          </Box>

          {/* Bio */}
          {user?.bio && (
            <Box paddingHorizontal="l" marginBottom="l">
              <Text variant="regular" fontSize={14} lineHeight={20}>
                {user.bio}
              </Text>
            </Box>
          )}

          {/* Quick Actions */}
          <Box paddingHorizontal="l" gap="s">
            <TouchableOpacity>
              <Box 
                flexDirection="row" 
                alignItems="center" 
                justifyContent="space-between"
                paddingVertical="m"
                borderBottomWidth={1}
                borderBottomColor="faded_border"
              >
                <Box flexDirection="row" alignItems="center" gap="m">
                  <Ionicons name="briefcase-outline" size={20} color={primary} />
                  <Text variant="medium" fontSize={16}>
                    My Works
                  </Text>
                </Box>
                <Ionicons name="chevron-forward" size={20} color={label} />
              </Box>
            </TouchableOpacity>

            <TouchableOpacity>
              <Box 
                flexDirection="row" 
                alignItems="center" 
                justifyContent="space-between"
                paddingVertical="m"
                borderBottomWidth={1}
                borderBottomColor="faded_border"
              >
                <Box flexDirection="row" alignItems="center" gap="m">
                  <Ionicons name="school-outline" size={20} color={primary} />
                  <Text variant="medium" fontSize={16}>
                    Skills & Education
                  </Text>
                </Box>
                <Ionicons name="chevron-forward" size={20} color={label} />
              </Box>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout}>
              <Box 
                flexDirection="row" 
                alignItems="center" 
                justifyContent="space-between"
                paddingVertical="m"
              >
                <Box flexDirection="row" alignItems="center" gap="m">
                  <Ionicons name="log-out-outline" size={20} color="red" />
                  <Text variant="medium" fontSize={16} color="danger">
                    Logout
                  </Text>
                </Box>
                <Ionicons name="chevron-forward" size={20} color={label} />
              </Box>
            </TouchableOpacity>
          </Box>
        </ScrollView>
      </Box>
    </BaseScreenComponent>
  );
};

export default ProfileScreen;