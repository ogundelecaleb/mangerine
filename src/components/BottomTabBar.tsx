import { Animated, Platform, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Box from './Box';
import Text from './Text';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../utils/theme';

const addAlpha = (color: string, alpha: number) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const BottomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();

  const onPress = (
    key: string,
    isFocused: boolean,
    route: (typeof state.routes)[0],
  ) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const onLongPress = (key: string) => {
    navigation.emit({
      type: 'tabLongPress',
      target: key,
    });
  };

  const BarItem = ({
    options,
    isFocused,
    label,
    route,
  }: {
    options: BottomTabNavigationOptions;
    label: | string
      | ((props: {
        focused: boolean;
        color: string;
        position: any;
        children: string;
      }) => React.ReactNode);
    isFocused: boolean;
  } & { route: (typeof state.routes)[0] }) => {
    const [animatedWidth] = useState(new Animated.Value(0));

    useEffect(() => {
      if (isFocused) {
        Animated.timing(animatedWidth, {
          toValue: 100,
          duration: 225,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.timing(animatedWidth, {
          toValue: 0,
          duration: 225,
          useNativeDriver: false,
        }).start();
      }
    }, [isFocused, animatedWidth]);

    return (
      <TouchableOpacity
        onLongPress={() => onLongPress(route.key)}
        onPress={() => onPress(route.key, isFocused, route)}>
        <Box flexDirection="row" alignItems="center" gap="s" minWidth={40}>
          <Box>
            {options?.tabBarIcon &&
              options?.tabBarIcon({
                focused: isFocused,
                size: 20,
                color: theme.colors.primary,
              })}
          </Box>
          <Animated.View
            style={{ maxWidth: animatedWidth, overflow: 'hidden' }}>
            <Text numberOfLines={1} flexWrap="nowrap">
              {label as string}
            </Text>
          </Animated.View>
        </Box>
      </TouchableOpacity>
    );
  };

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      backgroundColor="background"
      justifyContent="space-between"
      minHeight={90}
      borderTopLeftRadius={16}
      borderTopRightRadius={16}
      shadowColor="foreground"
      shadowOffset={{
        height: -4,
        width: 0,
      }}
      borderLeftWidth={1}
      borderRightWidth={1}
      borderTopWidth={1}
      style={{
        borderTopColor: addAlpha(theme.colors.foreground, 0.25),
        borderLeftColor: addAlpha(theme.colors.foreground, 0.25),
        borderRightColor: addAlpha(theme.colors.foreground, 0.25),
        paddingBottom: insets.bottom + 20,
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
      }}
      shadowOpacity={0.25}
      shadowRadius={4}
      elevation={6}
      paddingHorizontal="l">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        return (
          <BarItem
            key={route.key}
            route={route}
            isFocused={isFocused}
            label={label}
            options={options}
          />
        );
      })}
    </Box>
  );
};

export default BottomTabBar;