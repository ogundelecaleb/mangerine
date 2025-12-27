import React, { useState, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import Box from '../../components/Box';
import Text from '../../components/Text';
import { BottomTabList, MainStack } from '../../utils/ParamList';
import { useAuth } from '../../state/hooks/user.hook';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../utils/theme';
import { addAlpha } from '../../utils/helpers';
import { setAuthTrigger } from '../../state/reducers/user.reducer';
import { useLoadAuth } from '../../state/hooks/loadauth.hook';

interface Props extends BottomTabScreenProps<BottomTabList, 'Profile'> {}

const ProfileScreen = ({ navigation }: Props) => {
  const {
    user,
    skills = [],
    education = [],
    experience = [],
    languages = [],
    followers = [],
    follows = [],
    followerCount = 0,
    followsCount = 0,
    services = [],
  } = useAuth();
  const theme = useTheme<Theme>();
  const mainNavigation = useNavigation<NativeStackNavigationProp<MainStack, 'Tabs'>>();
  const dispatch = useDispatch();
  const { profileLoading } = useLoadAuth();
  
  const tabs = useMemo(
    () => [
      'Activity Feeds',
      ...(user?.isConsultant ? ['Consulting', 'Reviews'] : []),
    ],
    [user],
  );
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={profileLoading}
              onRefresh={() => {
                dispatch(
                  setAuthTrigger({
                    trigger: true,
                  }),
                );
              }}
            />
          }
          showsVerticalScrollIndicator={false}>
          <Box>
            <Box paddingHorizontal="l" marginTop="m">
              <Box overflow="hidden" paddingBottom="l" borderRadius={12}>
                {/* Profile Banner */}
                <TouchableOpacity activeOpacity={0.98}>
                  <Box height={106} backgroundColor="faded" position="relative">
                    <Box
                      flexDirection="row"
                      marginTop="s"
                      alignItems="center"
                      justifyContent="space-between">
                      <TouchableOpacity>
                        <Box
                          height={40}
                          justifyContent="center"
                          alignItems="center"
                          width={40}
                          borderRadius={8}
                          style={{
                            backgroundColor: addAlpha('#000000', 0.4),
                          }}>
                          <MaterialCommunityIcons
                            name="arrow-left"
                            size={20}
                            color="#FFF"
                          />
                        </Box>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Box
                          height={40}
                          justifyContent="center"
                          alignItems="center"
                          width={40}
                          borderRadius={8}
                          style={{
                            backgroundColor: addAlpha('#000000', 0.4),
                          }}>
                          <Ionicons name="share-outline" size={20} color="#FFF" />
                        </Box>
                      </TouchableOpacity>
                    </Box>
                  </Box>
                </TouchableOpacity>
                
                {/* Profile Info */}
                <Box>
                  <Box
                    marginLeft="l"
                    style={{ marginTop: -30 }}
                    justifyContent="space-between"
                    alignItems="flex-start"
                    flexDirection="row">
                    {/* Profile Avatar */}
                    <TouchableOpacity>
                      <Box
                        height={100}
                        borderRadius={100}
                        width={104}
                        overflow="hidden"
                        borderColor="background"
                        backgroundColor="faded"
                        borderWidth={8}
                        justifyContent="center"
                        alignItems="center">
                        <Text variant="bold" fontSize={32} color="label">
                          {user?.fullName?.charAt(0) || 'U'}
                        </Text>
                      </Box>
                    </TouchableOpacity>
                    
                    {/* User Info */}
                    <Box marginTop="30" paddingTop="s" flex={1}>
                      <Box flexDirection="row" alignItems="flex-start">
                        <Box paddingHorizontal="m" flex={1}>
                          <Text variant="bold" fontSize={16}>
                            {user?.fullName || 'User Name'}
                          </Text>
                          <Text marginVertical="xs" color="label">
                            {user?.title || 'Professional Title'}
                          </Text>
                        </Box>
                        <TouchableOpacity
                          onPress={() => {
                            mainNavigation.navigate('EditProfile');
                          }}>
                          <MaterialCommunityIcons
                            name="pencil"
                            size={24}
                            color={theme.colors.primary}
                          />
                        </TouchableOpacity>
                      </Box>
                      
                      {/* Location and DOB */}
                      <Box
                        flexDirection="row"
                        alignItems="flex-start"
                        gap="m"
                        paddingHorizontal="m">
                        <Box
                          flexDirection="row"
                          alignItems="flex-start"
                          flex={1}
                          maxWidth={user?.dateOfBirth ? '42%' : undefined}>
                          <MaterialCommunityIcons
                            name="map-marker"
                            size={16}
                            color={theme.colors.label}
                          />
                          <Text numberOfLines={3} fontSize={10} marginLeft="xs">
                            {user?.location || 'Location'}
                          </Text>
                        </Box>
                        {user?.dateOfBirth && (
                          <Box flex={1} flexDirection="row" alignItems="center">
                            <MaterialCommunityIcons
                              name="account"
                              size={16}
                              color={theme.colors.label}
                            />
                            <Text fontSize={10} marginLeft="xs">
                              Born {moment(user?.dateOfBirth).format('D MMMM')}
                            </Text>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                
                {/* Bio */}
                <Box marginTop="s" marginBottom="m">
                  <Box marginTop="m">
                    <Text numberOfLines={3}>
                      {user?.bio || 'User bio will appear here...'}
                    </Text>
                  </Box>
                </Box>
                
                {/* Followers/Following */}
                <Box flexDirection="row" alignItems="center" gap="m">
                  <TouchableOpacity
                    onPress={() => {
                      mainNavigation.navigate('UserFollowers', {
                        user: user!,
                        users: followers || [],
                      });
                    }}>
                    <Text fontSize={12} color="primary">
                      {followerCount || 0} Follower(s)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      mainNavigation.navigate('UserFollowing', {
                        user: user!,
                        users: follows || [],
                      });
                    }}>
                    <Text fontSize={12} color="primary">
                      {followsCount || 0} Following
                    </Text>
                  </TouchableOpacity>
                </Box>
              </Box>
            </Box>
          </Box>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
};


export default ProfileScreen;