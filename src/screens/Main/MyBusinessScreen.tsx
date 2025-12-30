import { Animated, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Box from '../../components/Box';
import Text from '../../components/Text';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import { MainStack } from '../../utils/ParamList';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../utils/theme';

const addAlpha = (color: string, alpha: number) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const MyBusinessScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'MyBusiness'>) => {
  const theme = useTheme<Theme>();
  const [activeSublinks, setActiveSublinks] = useState('');

  const items = [
    {
      title: 'My Dashboard',
      color: addAlpha('#30BC0D', 0.1),
      icon: <MaterialCommunityIcons name="view-dashboard" size={24} color="#30BC0D" />,
      onPress: () => {
        navigation.navigate('Dashboard');
      },
      subLinks: [],
    },
    {
      title: 'My Meeting',
      color: addAlpha('#363853', 0.1),
      icon: <MaterialCommunityIcons name="folder" size={24} color="#363853" />,
      onPress: () => {
        // navigation.navigate('AccountSettings');
      },
      subLinks: [
        {
          title: 'Availability Settings',
          onPress: () => {
            navigation.navigate('AvailabilitySettings');
          },
        },
        {
          title: 'Meeting Preference',
          onPress: () => {
            navigation.navigate('MeetingPreference');
          },
        },
        {
          title: 'Pricing',
          onPress: () => {
            navigation.navigate('Pricing');
          },
        },
        {
          title: 'Calendar view',
          onPress: () => {
            navigation.navigate('CalendarView');
          },
        },
        {
          title: 'Upcoming Appointments',
          onPress: () => {
            navigation.navigate('ScheduledConsultation');
          },
        },
        {
          title: 'Consultation History',
          onPress: () => {
            navigation.navigate('MyConsultation');
          },
        },
      ],
    },
  ];

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
                  onPress={() => {
                    navigation.goBack();
                  }}
                  style={{ padding: 8, paddingLeft: 0 }}>
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={24}
                    color={theme.colors.foreground}
                  />
                </TouchableOpacity>
              </Box>
              <Box flex={1} alignItems="center">
                <Text
                  variant="semibold"
                  fontSize={20}
                  textTransform="capitalize">
                  My Business
                </Text>
              </Box>
              <Box padding="s" opacity={0} width={32}></Box>
            </Box>
            <Box flex={1} paddingTop="l">
              <ScrollView showsVerticalScrollIndicator={false}>
                {items.map(i => (
                  <View style={{paddingHorizontal: 24}} key={i.title}>
                    <TouchableOpacity
                      onPress={() => {
                        if (i.subLinks.length) {
                          if (activeSublinks === i.title) {
                            setActiveSublinks('');
                          } else {
                            setActiveSublinks(i.title);
                          }
                        } else {
                          i.onPress();
                        }
                      }}>
                      <Box
                        paddingHorizontal="m"
                        flexDirection="row"
                        alignItems="center"
                        gap="m"
                        paddingVertical="m"
                        borderBottomWidth={1}
                        borderBottomColor="searchbg">
                        <Box
                          height={40}
                          width={40}
                          borderRadius={40}
                          justifyContent="center"
                          alignItems="center"
                          style={{ backgroundColor: i.color }}>
                          {i.icon}
                        </Box>
                        <Box flex={1}>
                          <Text color="label" fontSize={16}>
                            {i.title}
                          </Text>
                        </Box>
                        <MaterialCommunityIcons
                          name={
                            activeSublinks === i.title
                              ? 'chevron-down'
                              : 'chevron-right'
                          }
                          size={24}
                          color={theme.colors.label}
                        />
                      </Box>
                    </TouchableOpacity>
                    <Box
                      marginLeft="xl"
                      borderLeftWidth={1}
                      borderLeftColor="label">
                      <Animated.View
                        style={{
                          maxHeight: activeSublinks === i.title ? 500 : 0,
                          overflow: 'hidden',
                        }}>
                        <Box>
                          {i.subLinks.map(s => (
                            <TouchableOpacity
                              key={s.title}
                              onPress={() => {
                                s.onPress();
                              }}>
                              <Box
                                flexDirection="row"
                                alignItems="center"
                                marginVertical="m">
                                <Box
                                  width={25}
                                  marginRight="l"
                                  borderBottomWidth={1}
                                  borderBottomColor="label"
                                />
                                <Text color="label" fontSize={16}>
                                  {s.title}
                                </Text>
                              </Box>
                            </TouchableOpacity>
                          ))}
                        </Box>
                      </Animated.View>
                    </Box>
                  </View>
                ))}
              </ScrollView>
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};

export default MyBusinessScreen;