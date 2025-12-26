import { Animated, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useMemo, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Box from './Box';
import Input from './Input';
import Text from './Text';
import Modal from './Modal';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../utils/theme';
import { useAppSelector, useAppDispatch } from '../state/hooks/redux';
import { logout } from '../state/reducers/authSlice';
import { BottomTabList, MainStack } from '../utils/ParamList';

interface Props {
  onSearch?: () => void;
  searchValue?: string;
  setSearchValue?: (v: string) => void;
}

const BottomTabHeader = ({ onSearch, searchValue, setSearchValue }: Props) => {
  const [maxWidth, setMaxWidth] = useState(0);
  const theme = useTheme<Theme>();
  const [visible, setVisible] = useState(false);
  const [animatedWidth] = useState(new Animated.Value(0));
  const [showMenu, setShowMenu] = useState(false);
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const bottomTabNavigation = useNavigation<BottomTabNavigationProp<BottomTabList, 'Home'>>();
  const mainNavigation = useNavigation<NativeStackNavigationProp<MainStack>>();

  const items = useMemo(
    () => [
      {
        title: 'Saved Items',
        icon: <Ionicons name="bookmarks-outline" size={16} color={theme.colors.foreground} />,
        onPress: () => {},
      },
      {
        title: 'Payments',
        icon: <MaterialCommunityIcons name="cash" size={16} color={theme.colors.foreground} />,
        onPress: () => {},
      },
    ],
    [theme.colors.foreground],
  );

  useEffect(() => {
    if (visible) {
      Animated.timing(animatedWidth, {
        toValue: maxWidth,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedWidth, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [visible, animatedWidth, maxWidth]);

  useEffect(() => {
    if (!visible && setSearchValue) {
      setSearchValue('');
    }
  }, [visible, setSearchValue]);

  return (
    <Box>
      <Box
        flexDirection="row"
        paddingHorizontal="l"
        paddingVertical="m"
        gap="s"
        alignItems="flex-start">
        <Box paddingTop="m">
          <TouchableOpacity onPress={() => setShowMenu(true)}>
            <Text variant="bold" fontSize={24} color="foreground_primary">
              Mangerine
            </Text>
          </TouchableOpacity>
        </Box>
        <Box
          flex={1}
          flexDirection="row"
          position="relative"
          alignItems="center"
          justifyContent="flex-end"
          onLayout={e => setMaxWidth(e.nativeEvent.layout.width)}>
          {!visible && (
            <Box
              marginTop="m"
              flexDirection="row"
              alignItems="center"
              gap="m">
              <TouchableOpacity
                onPress={() => {
                  if (onSearch) {
                    onSearch();
                    return;
                  }
                  setVisible(!visible);
                }}>
                <MaterialCommunityIcons
                  name="magnify"
                  size={30}
                  color={theme.colors.label}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={30}
                  color={theme.colors.label}
                />
              </TouchableOpacity>
            </Box>
          )}
          <Box position="absolute" top={0} right={0}>
            <Animated.View
              style={{
                width: animatedWidth,
                overflow: 'hidden',
              }}>
              <Box
                flexDirection="row"
                alignItems="center"
                gap="s"
                paddingTop="s">
                <Box
                  flexDirection="row"
                  alignItems="center"
                  flex={1}
                  backgroundColor="faded"
                  borderRadius={8}
                  paddingHorizontal="m">
                  <MaterialCommunityIcons
                    name="magnify"
                    size={30}
                    color={theme.colors.label}
                  />
                  <Box flex={1} justifyContent="center">
                    <Input
                      noMargin
                      backgroundColor="transparent"
                      borderWidth={0}
                      value={searchValue}
                      onChangeText={setSearchValue}
                    />
                  </Box>
                  <TouchableOpacity onPress={() => setVisible(!visible)}>
                    <MaterialCommunityIcons
                      name="close"
                      size={30}
                      color={theme.colors.label}
                    />
                  </TouchableOpacity>
                </Box>
                <TouchableOpacity onPress={() => setVisible(!visible)}>
                  <Text color="foreground_primary" variant="medium">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </Box>
            </Animated.View>
          </Box>
        </Box>
      </Box>

      <Modal
        visible={showMenu}
        onClose={() => setShowMenu(false)}>
        <Box backgroundColor="background" width="75%" flex={1}>
          <SafeAreaView style={{ flex: 1 }}>
            <Box flex={1} paddingVertical="l">
              <Box
                marginTop="xl"
                flexDirection="row"
                alignItems="center"
                paddingHorizontal="l"
                marginBottom="l"
                justifyContent="space-between">
                <TouchableOpacity>
                  <Box
                    height={50}
                    borderWidth={1}
                    borderRadius={6}
                    width={50}
                    borderColor="border"
                    justifyContent="center"
                    alignItems="center">
                    <Text variant="bold" fontSize={20} color="foreground_primary">
                      M
                    </Text>
                  </Box>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowMenu(false);
                    setTimeout(() => {
                      mainNavigation.navigate('Settings');
                    }, 900);
                  }}>
                  <Ionicons
                    name="settings-outline"
                    size={24}
                    color={theme.colors.foreground}
                  />
                </TouchableOpacity>
              </Box>
              <Box flex={1}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Box paddingBottom="l" paddingHorizontal="m">
                    <Box
                      borderWidth={1}
                      overflow="hidden"
                      paddingBottom="l"
                      borderColor="border"
                      borderRadius={8}>
                      <Box
                        height={106}
                        backgroundColor="faded"
                        position="relative">
                      </Box>
                      <Box>
                        <Box marginHorizontal="l" style={{ marginTop: -30 }}>
                          <TouchableOpacity
                            onPress={() => {
                              setShowMenu(false);
                              bottomTabNavigation.navigate('Profile');
                            }}>
                            <Box
                              height={73}
                              borderRadius={50}
                              width={57}
                              overflow="hidden"
                              backgroundColor="faded"
                              borderWidth={1}
                              justifyContent="center"
                              alignItems="center">
                              <Text variant="bold" fontSize={20}>
                                {user?.fullName?.charAt(0) || 'U'}
                              </Text>
                            </Box>
                          </TouchableOpacity>
                        </Box>
                      </Box>
                      <Box marginTop="l">
                        <Box paddingHorizontal="m">
                          <Text variant="bold" fontSize={18}>
                            {user?.fullName || 'User'}
                          </Text>
                          <Text>
                            User | Individual
                          </Text>
                        </Box>
                        <Box
                          flexDirection="row"
                          alignItems="center"
                          gap="m"
                          paddingHorizontal="m"
                          marginTop="m">
                          <Box flexDirection="row" alignItems="center" gap="s">
                            <MaterialCommunityIcons
                              name="map-marker"
                              size={16}
                              color="#00A991"
                            />
                            <Text fontSize={10}>Location</Text>
                          </Box>
                        </Box>
                        <Box marginTop="m" paddingHorizontal="m">
                          <Text numberOfLines={5}>Welcome to Mangerine!</Text>
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      marginTop="m"
                      borderWidth={1}
                      overflow="hidden"
                      paddingVertical="l"
                      paddingHorizontal="m"
                      borderColor="border"
                      borderRadius={8}>
                      <Box gap="m">
                        {items.map(i => (
                          <TouchableOpacity onPress={i.onPress} key={i.title}>
                            <Box
                              alignItems="center"
                              flexDirection="row"
                              gap="m">
                              {i.icon}
                              <Text>{i.title}</Text>
                            </Box>
                          </TouchableOpacity>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </ScrollView>
              </Box>
              <Box paddingHorizontal="xl" marginBottom="xl">
                <TouchableOpacity
                  onPress={() => {
                    dispatch(logout());
                  }}>
                  <Box flexDirection="row" alignItems="center">
                    <Ionicons name="exit-sharp" color={theme.colors.danger} size={24} />
                    <Text color="danger">Log out</Text>
                  </Box>
                </TouchableOpacity>
              </Box>
            </Box>
          </SafeAreaView>
        </Box>
      </Modal>
    </Box>
  );
};

export default BottomTabHeader;