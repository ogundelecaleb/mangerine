import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Box from './Box';
import Text from './Text';
import { MainStack } from '../utils/ParamList';
import { useAuth } from '../state/hooks/user.hook';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../utils/theme';

const ServicesCarousel = () => {
  const { services = [] } = useAuth();
  const theme = useTheme<Theme>();
  const navigation = useNavigation<NativeStackNavigationProp<MainStack>>();

  const renderServiceItem = ({ item }: { item: any }) => (
    <Box
      width={200}
      marginRight="m"
      backgroundColor="background"
      borderRadius={8}
      padding="m"
      shadowColor="foreground"
      shadowOpacity={0.1}
      shadowRadius={4}
      elevation={2}
      shadowOffset={{
        height: 0,
        width: 0,
      }}>
      <Box
        height={100}
        borderRadius={6}
        backgroundColor="faded"
        marginBottom="s"
        overflow="hidden"
        justifyContent="center"
        alignItems="center">
        <MaterialCommunityIcons
          name="briefcase"
          size={40}
          color={theme.colors.label}
        />
      </Box>
      <Text variant="semibold" fontSize={14} numberOfLines={2}>
        {item.title}
      </Text>
      <Text fontSize={12} color="label" numberOfLines={3} marginTop="xs">
        {item.description}
      </Text>
      <Box flexDirection="row" alignItems="center" marginTop="s">
        <MaterialCommunityIcons
          name="clock-outline"
          size={14}
          color={theme.colors.label}
        />
        <Text fontSize={12} color="label" marginLeft="xs">
          {item.hours} hours
        </Text>
      </Box>
    </Box>
  );

  return (
    <Box>
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 0,
        }}
      />
      {services.length > 0 && (
        <Box alignItems="center" marginTop="m">
          <TouchableOpacity
            onPress={() => navigation.navigate('AddConsultancy')}>
            <Text fontSize={14} variant="semibold" color="primary">
              Manage Services
            </Text>
          </TouchableOpacity>
        </Box>
      )}
    </Box>
  );
};

export default ServicesCarousel;