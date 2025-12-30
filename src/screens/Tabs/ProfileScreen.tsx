import {
  Platform,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useMemo, useState } from 'react';
import Box from '../../components/Box';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BottomTabList, MainStack } from '../../utils/ParamList';
import { useAuth } from '../../state/hooks/user.hook';
import { Image } from 'expo-image';
import Text from '../../components/Text';
import { useThemeColors } from '../../hooks/useTheme';
import { addAlpha } from '../../utils/helpers';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import ProfileWorksSection from '../../components/ProfileWorksSection';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import moment from 'moment';
import {
  useUpdateProfileBannerMutation,
  useUpdateProfilePicMutation,
  useUpdateProfileVideoMutation,
} from '../../state/services/users.service';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { ErrorData } from '../../utils/types';
import { showMessage } from 'react-native-flash-message';
import { setAuthTrigger } from '../../state/reducers/user.reducer';
import { usePosts } from '../../state/hooks/posts.hook';
import Animated, { FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import PostItem from '../../components/PostItem';
import EmptyState from '../../components/EmptyState';
import { Video } from 'expo-av';
import { useLoadAuth } from '../../state/hooks/loadauth.hook';
import ServicesCarousel from '../../components/ServicesCarousel';
import { useLoadPosts } from '../../state/hooks/loadposts.hook';
import Modal from '../../components/Modal';

// interface Props extends BottomTabScreenProps<BottomTabList, 'Profile'> {}

const ProfileScreen = ({
  // route,
  navigation,
}: BottomTabScreenProps<BottomTabList, 'Profile'>) => {
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
  console.log("user", user?.works)
  const { label, foreground_primary, foreground } = useThemeColors();
  const mainNavigation =
    useNavigation<NativeStackNavigationProp<MainStack, 'Tabs'>>();
  const tabs = useMemo(
    () => [
      'Activity Feeds',
      ...(user?.isConsultant ? ['Consulting', 'Reviews'] : []),
    ],
    [user],
  );
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const [updatepic, {}] = useUpdateProfilePicMutation();
  const [updateBanner, {}] = useUpdateProfileBannerMutation();
  const [updateVideo, {}] = useUpdateProfileVideoMutation();
  const dispatch = useDispatch();
  const { userPosts = [] } = usePosts();
  const { profileLoading } = useLoadAuth();
  const { loadUserPosts } = useLoadPosts();
  const [viewKey, setViewKey] = useState<
    'skills' | 'education' | 'experience' | 'languages'
  >();
  const [viewAll, setViewAll] = useState(false);


  const updatePic = useCallback(
    async (
      result: ImagePicker.ImagePickerResult,
      type = 'avatar' as 'avatar' | 'banner' | 'video',
    ) => {
      try {
        if (result.canceled || !result.assets || result.assets.length < 1) {
          return;
        }
        const asset = result.assets[0];
        const body = new FormData();
        body.append('file', {
          uri: asset.uri,
          name: asset.fileName || `${type}.${asset.uri.split('.').pop()}`,
          type: asset.mimeType || 'image/jpeg',
        } as any);
        const exec =
          type === 'avatar'
            ? updatepic
            : type === 'banner'
            ? updateBanner
            : updateVideo;
        const response = await exec({
          body,
        });
        // console.log('updatePic response:', JSON.stringify(response));
        if (response?.error) {
          const err = response as ErrorData;
          showMessage({
            message:
              err?.error?.data?.message ||
              err?.error?.data?.error ||
              'Something went wrong',
            type: 'danger',
          });
          return;
        }
        showMessage({
          message: 'Profile picture updated',
          type: 'success',
        });
        dispatch(
          setAuthTrigger({
            trigger: true,
          }),
        );
      } catch (error) {
        console.log('avatar upload error:', error);
      }
    },
    [updatepic, updateBanner, updateVideo, dispatch],
  );

  const selectAvatar = async (
    type = 'avatar' as 'avatar' | 'banner' | 'video',
  ) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'video' ? ImagePicker.MediaTypeOptions.Videos : ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [16, 9],
      quality: 0.4,
    });
    if (!result.canceled) {
      updatePic(result, type);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1}>
        <Modal isVisible={viewAll} style={{ margin: 0 }}>
          <Box
            borderRadius={8}
            marginVertical="xxl"
            padding="l"
            backgroundColor="background"
            margin="l">
            <Box
              flexDirection="row"
              marginBottom="l"
              justifyContent="space-between"
              alignItems="center">
              <Text variant="semibold" fontSize={18} textTransform="capitalize">
                {viewKey}
              </Text>
              <TouchableOpacity onPress={() => setViewAll(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={foreground}
                />
              </TouchableOpacity>
            </Box>
            <Box maxHeight={400}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Box>
                  {viewKey === 'skills' && (
                    <Box gap="mid">
                      {skills.map(s => (
                        <Box key={s.id}>
                          <Box gap="xs">
                            <Text variant="semibold" fontSize={16}>
                              {s.name}
                            </Text>
                            <Text color="label">{s.skills.join(', ')}</Text>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                  {viewKey === 'education' && (
                    <Box gap="mid">
                      {education.map(s => (
                        <Box key={s.id}>
                          <Box gap="xs">
                            <Text variant="semibold" fontSize={16}>
                              {s.school_name}
                            </Text>
                            <Text>
                              {s.degree} {s.field_of_study}
                            </Text>
                            <Text color="label">
                              {s.start_month} {s.start_year} -{' '}
                              {s?.isCurrent
                                ? 'Present'
                                : `${s.end_month} ${s.end_year}`}{' '}
                            </Text>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                  {viewKey === 'experience' && (
                    <Box gap="mid">
                      {experience.map(s => (
                        <Box key={s.id}>
                          <Box gap="xs">
                            <Text variant="semibold" fontSize={16}>
                              {s.company_name}
                            </Text>
                            <Text>{s.title}</Text>
                            <Text color="label">
                              {s.start_month} {s.start_year} -{' '}
                              {s?.isCurrent
                                ? 'Present'
                                : `${s.start_month} ${s.start_year}`}{' '}
                            </Text>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                  {viewKey === 'languages' && (
                    <Box gap="mid">
                      {languages.map(s => (
                        <Box key={s.id}>
                          <Box gap="xs">
                            <Text variant="semibold" fontSize={16}>
                              {s.language}
                            </Text>
                            <Text color="label">{s.proficiency}</Text>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </ScrollView>
            </Box>
          </Box>
        </Modal>
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
              <Box paddingHorizontal="l" marginTop="mid">
                <Box overflow="hidden" paddingBottom="l" borderRadius={12}>
                  <TouchableOpacity
                    // disabled={!isUser}
                    activeOpacity={0.98}
                    onPress={() => {
                      selectAvatar('banner');
                      // navigation.navigate('Profile');
                    }}>
                    <Box
                      height={106}
                      backgroundColor="black"
                      position="relative">
                      <Box
                        position="absolute"
                        top={0}
                        left={0}
                        height="100%"
                        width="100%">
                        <Image
                          style={{ height: '100%', width: '100%' }}
                          contentFit="cover"
                          source={{ uri: user?.profileBanner || '' }}
                        />
                      </Box>
                      <Box
                        flexDirection="row"
                        marginTop="s"
                        alignItems="center"
                        justifyContent="space-between">
                        <TouchableOpacity onPress={navigation?.goBack}>
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
                        <TouchableOpacity onPress={() => {}}>
                          <Box
                            height={40}
                            justifyContent="center"
                            alignItems="center"
                            width={40}
                            borderRadius={8}
                            style={{
                              backgroundColor: addAlpha('#000000', 0.4),
                            }}>
                            <Ionicons
                              name="share-outline"
                              size={20}
                              color="#FFF"
                            />
                          </Box>
                        </TouchableOpacity>
                      </Box>
                    </Box>
                  </TouchableOpacity>
                  <Box>
                    <Box
                      marginLeft="l"
                      style={{ marginTop: -30 }}
                      justifyContent="space-between"
                      alignItems="flex-start"
                      flexDirection="row">
                      <TouchableOpacity
                        onPress={() => {
                          selectAvatar('avatar');
                          // navigation.navigate('Profile');
                        }}>
                        <Box
                          height={100}
                          borderRadius={100}
                          width={104}
                          overflow="hidden"
                          borderColor="label"
                          backgroundColor="foreground_primary"
                          borderWidth={8}>
                          <Image
                            style={{ height: '100%', width: '100%' }}
                            contentFit="cover"
                            source={{ uri: user?.profilePics || '' }}
                          />
                        </Box>
                      </TouchableOpacity>
                      <Box marginTop="30" paddingTop="s" flex={1}>
                        <Box flexDirection="row" alignItems="flex-start">
                          <Box paddingHorizontal="m" flex={1}>
                            <Text variant="bold" fontSize={16}>
                              {user?.fullName}
                            </Text>
                            <Text marginVertical="xs">{user?.title}</Text>
                          </Box>
                          <TouchableOpacity
                            onPress={() => {
                              mainNavigation.navigate('EditProfile');
                            }}>
                            <MaterialCommunityIcons
                              name="pencil"
                              size={24}
                              color={foreground_primary}
                            />
                          </TouchableOpacity>
                        </Box>
                        <Box
                          flexDirection="row"
                          alignItems="flex-start"
                          gap="mid"
                          paddingHorizontal="m">
                          <Box
                            flexDirection="row"
                            alignItems="flex-start"
                            flex={1}
                            maxWidth={user?.dateOfBirth ? '42%' : undefined}>
                            <MaterialCommunityIcons name="map-marker" size={16} color={label} />
                            <Text numberOfLines={3} fontSize={10}>
                              {user?.location}
                            </Text>
                          </Box>
                          {user?.dateOfBirth && (
                            <Box
                              flex={1}
                              flexDirection="row"
                              alignItems="center">
                              <MaterialCommunityIcons name="account" size={16} color={label} />
                              <Text fontSize={10}>
                                Born{' '}
                                {moment(user?.dateOfBirth).format('D MMMM')}
                              </Text>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box marginTop="s" marginBottom="m">
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                      marginTop="mid">
                      <Box flex={1}>
                        <Text numberOfLines={3}>{user?.bio}</Text>
                      </Box>
                      <Box>
                        <TouchableOpacity
                          onPress={() => {
                            mainNavigation.navigate('EditProfile');
                          }}>
                          <MaterialCommunityIcons
                            name="pencil"
                            size={18}
                            color={foreground}
                          />
                        </TouchableOpacity>
                      </Box>
                    </Box>
                  </Box>
                  <Box flexDirection="row" alignItems="center" gap="m">
                    <TouchableOpacity
                      onPress={() => {
                        if (user) {
                          mainNavigation.navigate('UserFollowers', {
                            user: user,
                            users: followers || [],
                          });
                        }
                      }}>
                      <Text fontSize={12} color="foreground_primary">
                        {followerCount || 0} Follower(s)
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (user) {
                          mainNavigation.navigate('UserFollowing', {
                            user: user,
                            users: follows || [],
                          });
                        }
                      }}>
                      <Text fontSize={12} color="foreground_primary">
                        {followsCount || 0} Following
                      </Text>
                    </TouchableOpacity>
                  </Box>
                </Box>
                <Box>
                  <ProfileWorksSection />
                </Box>
                <Box marginTop="m" marginBottom="xl">
                  <Box flexDirection="row" alignItems="center" gap="m">
                    {tabs.map(t => (
                      <Box flex={1} key={t}>
                        <TouchableOpacity onPress={() => setActiveTab(t)}>
                          <Box
                            height={48}
                            borderBottomWidth={1}
                            borderBottomColor={
                              activeTab === t
                                ? 'foreground_primary'
                                : 'transparent'
                            }
                            justifyContent="center"
                            alignItems="center">
                            <Text
                              color={
                                activeTab === t ? 'foreground_primary' : 'label'
                              }
                              variant={
                                activeTab === t ? 'semibold' : 'regular'
                              }>
                              {t}
                            </Text>
                          </Box>
                        </TouchableOpacity>
                      </Box>
                    ))}
                  </Box>
                  <Box>
                    <Animated.View
                      entering={FadeInLeft}
                      exiting={FadeOutRight}
                      key={`activeTab-${activeTab}`}
                      style={{
                        // borderWidth: 1,
                        minHeight: 150,
                      }}>
                      <Box marginTop="m">
                        {/* <Text>{activeTab}</Text> */}
                        {activeTab === tabs[0] && (
                          <Box>
                            {userPosts.length > 0 ? (
                              <Box>
                                <PostItem
                                  post={userPosts[0]}
                                  profile
                                  postDelete={() => {
                                    loadUserPosts();
                                  }}
                                />
                                <Box alignItems="center" marginTop="l">
                                  <TouchableOpacity
                                    onPress={() =>
                                      mainNavigation.navigate('UserPosts')
                                    }>
                                    <Text fontSize={16} variant="semibold">
                                      See all
                                    </Text>
                                  </TouchableOpacity>
                                </Box>
                              </Box>
                            ) : (
                              <EmptyState
                                subtitle="No posts added yet"
                                buttonText="Add Post"
                                doSomething={() => {
                                  mainNavigation.navigate('CreatePost');
                                }}
                              />
                            )}
                          </Box>
                        )}
                        {activeTab === tabs[1] && (
                          <Box>
                            {services?.length > 0 ? (
                              <Box>
                                <ServicesCarousel />
                              </Box>
                            ) : (
                              <EmptyState
                                subtitle="No service added yet"
                                buttonText="Add Service"
                                doSomething={() => {
                                  mainNavigation.navigate('AddConsultancy');
                                }}
                              />
                            )}
                          </Box>
                        )}
                      </Box>
                    </Animated.View>
                  </Box>
                  <Box marginTop="l">
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between">
                      <Box flex={1}>
                        <Text variant="semibold" fontSize={18}>
                          Introduction Video
                        </Text>
                      </Box>
                      <Box>
                        <TouchableOpacity onPress={() => selectAvatar('video')}>
                          <MaterialCommunityIcons
                            name="pencil"
                            size={18}
                            color={foreground}
                          />
                        </TouchableOpacity>
                      </Box>
                    </Box>
                    {user?.videoIntro ? (
                      <Box>
                        <Box
                          borderWidth={1}
                          marginTop="m"
                          height={232}
                          borderRadius={8}
                          overflow="hidden">
                          <Video
                            style={{
                              height: '100%',
                              width: '100%',
                              borderRadius: 8,
                            }}
                            source={{
                              uri: user?.videoIntro,
                            }}
                            useNativeControls
                            shouldPlay={false}
                          />
                        </Box>
                      </Box>
                    ) : (
                      <Box paddingBottom="m">
                        <EmptyState subtitle="You do not have an introduction video" />
                      </Box>
                    )}
                  </Box>
                  <Box marginTop="l">
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between">
                      <Box flex={1}>
                        <Text variant="semibold" fontSize={18}>
                          Contact Me
                        </Text>
                      </Box>
                      <Box>
                        <TouchableOpacity
                          onPress={() => {
                            mainNavigation.navigate('UpdateContact');
                          }}>
                          <MaterialCommunityIcons
                            name="pencil"
                            size={18}
                            color={foreground}
                          />
                        </TouchableOpacity>
                      </Box>
                    </Box>
                    <Box gap="mid" marginTop="m">
                      <Box gap="xs">
                        <Text variant="semibold" fontSize={16}>
                          Email Address
                        </Text>
                        <Text color="label">{user?.email}</Text>
                      </Box>
                      <Box gap="xs">
                        <Text variant="semibold" fontSize={16}>
                          Phone Number
                        </Text>
                        <Text color="label">{user?.mobileNumber}</Text>
                      </Box>
                      <Box gap="xs">
                        <Text variant="semibold" fontSize={16}>
                          Personal Website
                        </Text>
                        <Text color="label">{user?.websiteAddress}</Text>
                      </Box>
                    </Box>
                  </Box>
                  <Box marginTop="l">
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between">
                      <Box flex={1}>
                        <Text variant="semibold" fontSize={18}>
                          Skills
                        </Text>
                      </Box>
                      <Box>
                        <TouchableOpacity
                          onPress={() =>
                            mainNavigation.navigate('ManageSkills')
                          }>
                          <MaterialCommunityIcons
                            name="pencil"
                            size={18}
                            color={foreground}
                          />
                        </TouchableOpacity>
                      </Box>
                    </Box>
                    <Box gap="mid" marginTop="m">
                      {skills.length > 0 ? (
                        <>
                          {skills.slice(0, 2).map(s => (
                            <Box key={s.id}>
                              <Box gap="xs">
                                <Text variant="semibold" fontSize={16}>
                                  {s.name}
                                </Text>
                                <Text color="label">{s.skills.join(', ')}</Text>
                              </Box>
                            </Box>
                          ))}
                          {skills.length > 2 && (
                            <Box>
                              <TouchableOpacity
                                onPress={() => {
                                  setViewKey('skills');
                                  setViewAll(true);
                                }}>
                                <Text>View all</Text>
                              </TouchableOpacity>
                            </Box>
                          )}
                        </>
                      ) : (
                        <Box paddingBottom="m">
                          <EmptyState
                            subtitle="You do not have any skill added"
                            buttonText="Add skill"
                            doSomething={() =>
                              mainNavigation.navigate('ManageSkills')
                            }
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Box marginTop="l">
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between">
                      <Box flex={1}>
                        <Text variant="semibold" fontSize={18}>
                          Education
                        </Text>
                      </Box>
                      <Box>
                        <TouchableOpacity
                          onPress={() =>
                            mainNavigation.navigate('ManageEducation')
                          }>
                          <MaterialCommunityIcons
                            name="pencil"
                            size={18}
                            color={foreground}
                          />
                        </TouchableOpacity>
                      </Box>
                    </Box>
                    <Box gap="mid" marginTop="m">
                      {education.length > 0 ? (
                        <>
                          {education.slice(0, 2).map(s => (
                            <Box key={s.id}>
                              <Box gap="xs">
                                <Text variant="semibold" fontSize={16}>
                                  {s.school_name}
                                </Text>
                                <Text>
                                  {s.degree} {s.field_of_study}
                                </Text>
                                <Text color="label">
                                  {s.start_month} {s.start_year} -{' '}
                                  {s?.isCurrent
                                    ? 'Present'
                                    : `${s.end_month} ${s.end_year}`}{' '}
                                </Text>
                              </Box>
                            </Box>
                          ))}
                          {education.length > 2 && (
                            <Box>
                              <TouchableOpacity
                                onPress={() => {
                                  setViewKey('education');
                                  setViewAll(true);
                                }}>
                                <Text>View all</Text>
                              </TouchableOpacity>
                            </Box>
                          )}
                        </>
                      ) : (
                        <Box paddingBottom="m">
                          <EmptyState
                            subtitle="You do not have any education added"
                            buttonText="Add education"
                            doSomething={() =>
                              mainNavigation.navigate('ManageEducation')
                            }
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Box marginTop="l">
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between">
                      <Box flex={1}>
                        <Text variant="semibold" fontSize={18}>
                          Experience
                        </Text>
                      </Box>
                      <Box>
                        <TouchableOpacity
                          onPress={() =>
                            mainNavigation.navigate('ManageExperience')
                          }>
                          <MaterialCommunityIcons
                            name="pencil"
                            size={18}
                            color={foreground}
                          />
                        </TouchableOpacity>
                      </Box>
                    </Box>

                    <Box gap="mid" marginTop="m">
                      {experience.length > 0 ? (
                        <>
                          {experience.slice(0, 2).map(s => (
                            <Box key={s.id}>
                              <Box gap="xs">
                                <Text variant="semibold" fontSize={16}>
                                  {s.company_name}
                                </Text>
                                <Text>{s.title}</Text>
                                <Text color="label">
                                  {s.start_month} {s.start_year} -{' '}
                                  {s?.isCurrent
                                    ? 'Present'
                                    : `${s.start_month} ${s.start_year}`}{' '}
                                </Text>
                              </Box>
                            </Box>
                          ))}
                          {experience.length > 2 && (
                            <Box>
                              <TouchableOpacity
                                onPress={() => {
                                  setViewKey('experience');
                                  setViewAll(true);
                                }}>
                                <Text>View all</Text>
                              </TouchableOpacity>
                            </Box>
                          )}
                        </>
                      ) : (
                        <Box paddingBottom="m">
                          <EmptyState
                            subtitle="You do not have any experience added"
                            buttonText="Add experience"
                            doSomething={() =>
                              mainNavigation.navigate('ManageExperience')
                            }
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Box marginTop="l">
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between">
                      <Box flex={1}>
                        <Text variant="semibold" fontSize={18}>
                          Languages
                        </Text>
                      </Box>
                      <Box>
                        <TouchableOpacity
                          onPress={() =>
                            mainNavigation.navigate('ManageLanguages')
                          }>
                          <MaterialCommunityIcons
                            name="pencil"
                            size={18}
                            color={foreground}
                          />
                        </TouchableOpacity>
                      </Box>
                    </Box>
                    <Box gap="mid" marginTop="m">
                      {languages.length > 0 ? (
                        <>
                          {languages.slice(0, 2).map(s => (
                            <Box key={s.id}>
                              <Box gap="xs">
                                <Text variant="semibold" fontSize={16}>
                                  {s.language}
                                </Text>
                                <Text color="label">{s.proficiency}</Text>
                              </Box>
                            </Box>
                          ))}

                          {languages.length > 2 && (
                            <Box>
                              <TouchableOpacity
                                onPress={() => {
                                  setViewKey('languages');
                                  setViewAll(true);
                                }}>
                                <Text>View all</Text>
                              </TouchableOpacity>
                            </Box>
                          )}
                        </>
                      ) : (
                        <Box paddingBottom="m">
                          <EmptyState
                            subtitle="You do not have any language added"
                            buttonText="Add language"
                            doSomething={() =>
                              mainNavigation.navigate('ManageLanguages')
                            }
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box></Box>
            </Box>
          </ScrollView>
        </Box>
      </Box>
    </SafeAreaView>
  );
};

export default ProfileScreen;