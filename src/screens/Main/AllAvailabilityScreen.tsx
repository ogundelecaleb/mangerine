import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';

import Box from '../../components/Box';
import Text from '../../components/Text';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import EmptyState from '../../components/EmptyState';
import ConfirmModal from '../../components/ConfirmModal';
import { MainStack, Availability, ErrorData } from '../../utils/ParamList';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../utils/theme';
import {
  useGetConsultantAvailabilityMutation,
  useDeleteAvailabilityMutation,
} from '../../state/services/availability.service';
import { useAuth } from '../../state/hooks/user.hook';
import { addAlpha } from '../../utils/helpers';

const AllAvailabilityScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'AllAvailability'>) => {
  const theme = useTheme<Theme>();
  const { user } = useAuth();
  const [getAvailabilities, { isLoading }] = useGetConsultantAvailabilityMutation();
  const [deleteAvailability, { isLoading: deleteLoading }] = useDeleteAvailabilityMutation();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadAvailabilities = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const startDate = moment().format('YYYY-MM-DD');
      const endDate = moment().add(3, 'months').format('YYYY-MM-DD');
      
      const response = await getAvailabilities({
        params: {
          userId: user.id,
          startDate,
          endDate,
        },
      });

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
      setAvailabilities((response as any)?.data?.data || []);
    } catch (error) {
      console.log('get availabilities error', JSON.stringify(error));
    }
  }, [getAvailabilities, user?.id]);

  const handleDelete = useCallback(async () => {
    if (!selectedId) return;
    
    try {
      const response = await deleteAvailability({ id: selectedId });
      
      if (response?.error) {
        const err = response as ErrorData;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Failed to delete availability',
          type: 'danger',
        });
        return;
      }
      
      showMessage({
        message: 'Availability deleted successfully',
        type: 'success',
      });
      
      setDeleteConfirm(false);
      setSelectedId(null);
      loadAvailabilities();
    } catch (error) {
      console.log('delete availability error', JSON.stringify(error));
    }
  }, [deleteAvailability, selectedId, loadAvailabilities]);

  useFocusEffect(
    useCallback(() => {
      loadAvailabilities();
    }, [loadAvailabilities]),
  );

  const renderAvailabilityItem = ({ item }: { item: Availability }) => {
    const sortedTimeslots = [...item.timeslots].sort((a, b) => 
      a.startTime.localeCompare(b.startTime)
    );
    
    return (
      <Box
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
        <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="m">
          <Box flex={1}>
            <Text variant="semibold" fontSize={16}>
              {moment(item.date).format('MMM D, YYYY')}
            </Text>
            <Text fontSize={12} color="label">
              {moment(item.date).format('dddd')}
            </Text>
          </Box>
          <TouchableOpacity
            onPress={() => {
              setSelectedId(item.id);
              setDeleteConfirm(true);
            }}
            disabled={deleteLoading}>
            <Box
              width={36}
              height={36}
              borderRadius={18}
              backgroundColor="faded"
              justifyContent="center"
              alignItems="center">
              <MaterialCommunityIcons
                name="delete-outline"
                size={18}
                color={theme.colors.danger}
              />
            </Box>
          </TouchableOpacity>
        </Box>
        
        <Box flexDirection="row" flexWrap="wrap" gap="xs">
          {sortedTimeslots.map((slot) => (
            <Box
              key={slot.id}
              paddingHorizontal="m"
              paddingVertical="xs"
              borderRadius={6}
              style={{
                backgroundColor: slot.isBooked
                  ? addAlpha(theme.colors.label, 0.1)
                  : addAlpha(theme.colors.primary, 0.1),
              }}>
              <Text
                fontSize={12}
                variant="medium"
                color={slot.isBooked ? 'label' : 'primary'}>
                {slot.startTime} - {slot.endTime}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

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
                  All Availability
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
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={isLoading}
                    onRefresh={loadAvailabilities}
                  />
                }
                data={availabilities}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 16,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                }}
                keyExtractor={({ id }) => id}
                renderItem={renderAvailabilityItem}
                ListEmptyComponent={
                  !isLoading ? (
                    <EmptyState subtitle="No availability set yet" />
                  ) : null
                }
              />
            </Box>
          </Box>
        </SafeAreaView>
      </Box>

      <ConfirmModal
        closeModal={() => {
          setDeleteConfirm(false);
          setSelectedId(null);
        }}
        isVisible={deleteConfirm}
        title="Delete Availability?"
        subtitle="Are you sure you want to delete this availability? This action cannot be undone."
        confirmButton="Yes, Delete"
        cancelButton="Cancel"
        confirm={handleDelete}
        headComponent={
          <Box
            height={80}
            width={80}
            justifyContent="center"
            alignItems="center"
            borderRadius={100}
            style={{
              backgroundColor: addAlpha(theme.colors.danger, 0.1),
            }}>
            <Box
              justifyContent="center"
              alignItems="center"
              borderRadius={12}
              height={36}
              width={36}
              style={{
                backgroundColor: theme.colors.danger,
              }}>
              <MaterialCommunityIcons
                name="delete-outline"
                color="#FFF"
                size={20}
              />
            </Box>
          </Box>
        }
      />
    </BaseScreenComponent>
  );
};

export default AllAvailabilityScreen;
