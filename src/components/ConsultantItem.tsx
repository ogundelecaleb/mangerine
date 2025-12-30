import { TouchableOpacity } from 'react-native';
import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Box from './Box';
import Text from './Text';
import ScaledImage from './ScaledImage';
import { MainStack } from '../utils/ParamList';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../utils/theme';
import { useAppSelector } from '../state/hooks/redux';
import { useFavouriteConsultantMutation, useUnfavouriteConsultantMutation } from '../state/services/consultants.service';

interface Consultant {
  id: string;
  fullName: string;
  title?: string;
  profilePics?: string;
  bio?: string;
  hourlyRate?: number;
  rating?: number;
  specialization?: string;
  isVerified?: boolean;
  location?: string;
  isFavorite?: boolean;
}

interface Props {
  consultant: Consultant;
}

const ConsultantItem = ({ consultant }: Props) => {
  const theme = useTheme<Theme>();
  const user = useAppSelector(state => state.user?.user);
  const navigation = useNavigation<NativeStackNavigationProp<MainStack>>();
  const [favouriteConsultant] = useFavouriteConsultantMutation();
  const [unfavouriteConsultant] = useUnfavouriteConsultantMutation();

  const handleFavorite = useCallback(async () => {
    try {
      if (consultant.isFavorite) {
        await unfavouriteConsultant({
          body: {
            userId: user?.id!,
            consultantId: consultant.id,
          },
        });
      } else {
        await favouriteConsultant({
          body: {
            userId: user?.id!,
            consultantId: consultant.id,
          },
        });
      }
    } catch (error) {
      console.log('favorite error:', error);
    }
  }, [consultant.isFavorite, consultant.id, user?.id, favouriteConsultant, unfavouriteConsultant]);

  const handlePress = useCallback(() => {
    if (consultant?.id === user?.id) {
      navigation.navigate('Tabs', {
        screen: 'Profile',
      });
    } else {
      navigation.navigate('BookConsultation', {
        consultant,
      });
    }
  }, [consultant, user?.id, navigation]);

  return (
    <TouchableOpacity onPress={handlePress}>
      <Box>
        <Box
          height={200}
          overflow="hidden"
          backgroundColor="faded"
          borderRadius={8}
          position="relative">
          {consultant?.profilePics ? (
            <ScaledImage
              style={{ height: '100%', width: '100%' }}
              source={{ uri: consultant.profilePics }}
            />
          ) : (
            <Box
              flex={1}
              justifyContent="center"
              alignItems="center"
              backgroundColor="faded">
              <Text variant="bold" fontSize={48} color="label">
                {consultant.fullName.charAt(0)}
              </Text>
            </Box>
          )}
          
          {consultant.isVerified && (
            <Box position="absolute" top={8} right={8}>
              <Box
                backgroundColor="primary"
                borderRadius={12}
                padding="xs">
                <MaterialCommunityIcons
                  name="check"
                  size={16}
                  color="white"
                />
              </Box>
            </Box>
          )}
        </Box>
        
        <Box marginTop="s">
          <Box flexDirection="row" gap="l" alignItems="flex-start">
            <Box flex={1} gap="xs">
              <Text numberOfLines={1} variant="semibold" fontSize={18}>
                {consultant.fullName}
              </Text>
              <Text numberOfLines={1} color="label" fontSize={14}>
                {consultant?.title || consultant?.specialization}
              </Text>
            </Box>
            
            {consultant.hourlyRate && (
              <Box>
                <Text variant="semibold" color="primary">
                  ${consultant.hourlyRate}/hr
                </Text>
              </Box>
            )}
          </Box>
          
          <Box
            flexDirection="row"
            alignItems="flex-end"
            marginTop="s"
            gap="m">
            <Box flex={1}>
              {consultant?.bio && (
                <Text numberOfLines={2} fontSize={14} color="foreground">
                  {consultant.bio}
                </Text>
              )}

              <Box flexDirection="row" alignItems="center" marginTop="s" gap="xs">
                <MaterialCommunityIcons
                  name="map-marker"
                  size={16}
                  color={theme.colors.label}
                />
                <Text fontSize={12} color="label">
                  {consultant?.location || 'Location not specified'}
                </Text>
              </Box>
              
              {consultant.rating && (
                <Box flexDirection="row" alignItems="center" marginTop="xs" gap="xs">
                  <MaterialCommunityIcons
                    name="star"
                    size={16}
                    color="#FFD700"
                  />
                  <Text fontSize={12} color="label">
                    {consultant.rating.toFixed(1)}
                  </Text>
                </Box>
              )}
            </Box>
            
            <Box>
              <TouchableOpacity onPress={handleFavorite}>
                <Box
                  height={40}
                  width={40}
                  borderWidth={1}
                  borderRadius={20}
                  borderColor="border"
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor={consultant.isFavorite ? 'primary' : 'background'}>
                  <MaterialCommunityIcons
                    name={consultant.isFavorite ? 'heart' : 'heart-outline'}
                    size={20}
                    color={consultant.isFavorite ? 'white' : theme.colors.label}
                  />
                </Box>
              </TouchableOpacity>
            </Box>
          </Box>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export default ConsultantItem;