import { ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { showMessage } from 'react-native-flash-message';

import Box from '../../components/Box';
import Text from '../../components/Text';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import EmptyState from '../../components/EmptyState';
import { MainStack } from '../../utils/ParamList';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../utils/theme';
import { useGetFavoriteConsultantsMutation } from '../../state/services/consultants.service';
import { ErrorData } from '../../utils/types';

const FavoriteConsultantsScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'FavouriteConsultants'>) => {
  const theme = useTheme<Theme>();
  const [getFavorites, { isLoading }] = useGetFavoriteConsultantsMutation();
  const [favoriteConsultants, setFavoriteConsultants] = useState<any[]>([]);

  const loadFavorites = useCallback(async () => {
    try {
      const response = await getFavorites({});
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
      setFavoriteConsultants((response as any)?.data?.data?.favoriteConsultants || []);
    } catch (error) {
      console.log('favorites error:', error);
    }
  }, [getFavorites]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

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
                  Favorite Consultants
                </Text>
              </Box>
              <Box padding="s" opacity={0} width={32}></Box>
            </Box>
            <Box flex={1}>
              {isLoading && (
                <Box alignItems="center" padding="l">
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                </Box>
              )}
              <ScrollView showsVerticalScrollIndicator={false}>
                <Box paddingHorizontal="l" gap="m" paddingVertical="m">
                  {favoriteConsultants.length > 0 ? (
                    favoriteConsultants.map((favorite) => (
                      <TouchableOpacity
                        key={favorite.id}
                        onPress={() => {
                          navigation.navigate('ViewProfile', {
                            user: favorite.consultant,
                          });
                        }}>
                        <Box flexDirection="row" alignItems="center" gap="l">
                          <Box
                            flex={1}
                            flexDirection="row"
                            gap="s"
                            alignItems="stretch">
                            <Box
                              height={48}
                              width={48}
                              borderRadius={48}
                              overflow="hidden"
                              backgroundColor="faded">
                              <Image
                                style={{ height: '100%', width: '100%' }}
                                source={{ uri: favorite.consultant?.profilePics || '' }}
                                contentFit="cover"
                              />
                            </Box>
                            <Box justifyContent="space-between">
                              <Text
                                variant="semibold"
                                fontSize={16}
                                numberOfLines={1}>
                                {favorite.consultant?.fullName}
                              </Text>
                              <Text variant="medium" numberOfLines={1} color="label">
                                {favorite.consultant?.title || 'Consultant'}
                              </Text>
                            </Box>
                          </Box>
                          <Box>
                            <TouchableOpacity>
                              <Box
                                height={40}
                                width={40}
                                borderWidth={2}
                                borderRadius={40}
                                borderColor="border"
                                justifyContent="center"
                                alignItems="center">
                                <MaterialCommunityIcons
                                  name="heart"
                                  size={24}
                                  color="#E8BC8B"
                                />
                              </Box>
                            </TouchableOpacity>
                          </Box>
                        </Box>
                      </TouchableOpacity>
                    ))
                  ) : (
                    !isLoading && (
                      <EmptyState subtitle="No favorite consultants yet" />
                    )
                  )}
                </Box>
              </ScrollView>
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};

export default FavoriteConsultantsScreen;