import {
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message';
import moment from 'moment';

import Box from '../../components/Box';
import Text from '../../components/Text';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import EmptyState from '../../components/EmptyState';
import { MainStack } from '../../utils/ParamList';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../utils/theme';
import { useGetMyConsultationsMutation, useCancelConsultationMutation } from '../../state/services/consultants.service';

interface Consultation {
  id: string;
  consultant: {
    id: string;
    fullName: string;
    profilePics?: string;
    specialization?: string;
  };
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
  message?: string;
  videoRecording: boolean;
}

type Props = NativeStackScreenProps<MainStack, 'MyConsultation'>;

const MyConsultationScreen = ({ navigation }: Props) => {
  const theme = useTheme<Theme>();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [getMyConsultations, { isLoading }] = useGetMyConsultationsMutation();
  const [cancelConsultation] = useCancelConsultationMutation();
  const [refreshing, setRefreshing] = useState(false);

  const loadConsultations = useCallback(async () => {
    try {
      const response = await getMyConsultations({});
      
      if (response?.error) {
        const err = response as any;
        showMessage({
          message: err?.error?.data?.message || 'Failed to load consultations',
          type: 'danger',
        });
        return;
      }
      
      setConsultations((response as any)?.data?.data || []);
    } catch (error) {
      console.log('consultations error:', error);
      showMessage({
        message: 'Failed to load consultations',
        type: 'danger',
      });
    } finally {
      setRefreshing(false);
    }
  }, [getMyConsultations]);

  const handleCancelConsultation = useCallback(async (consultationId: string) => {
    try {
      const response = await cancelConsultation({ id: consultationId });
      
      if (response?.error) {
        const err = response as any;
        showMessage({
          message: err?.error?.data?.message || 'Failed to cancel consultation',
          type: 'danger',
        });
        return;
      }
      
      showMessage({
        message: 'Consultation cancelled successfully',
        type: 'success',
      });
      
      loadConsultations();
    } catch (error) {
      console.log('cancel error:', error);
      showMessage({
        message: 'Failed to cancel consultation',
        type: 'danger',
      });
    }
  }, [cancelConsultation, loadConsultations]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadConsultations();
  }, [loadConsultations]);

  useEffect(() => {
    loadConsultations();
  }, [loadConsultations]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return theme.colors.primary;
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return theme.colors.danger;
      default:
        return theme.colors.label;
    }
  };

  const renderConsultationItem = ({ item }: { item: Consultation }) => (
    <Box
      backgroundColor="background"
      borderRadius={12}
      padding="m"
      marginBottom="m"
      borderWidth={1}
      borderColor="border">
      <Box flexDirection="row" justifyContent="space-between" alignItems="flex-start" marginBottom="s">
        <Box flex={1}>
          <Text variant="semibold" fontSize={16} marginBottom="xs">
            {item.consultant.fullName}
          </Text>
          <Text color="label" fontSize={14}>
            {item.consultant.specialization}
          </Text>
        </Box>
        
        <Box
          backgroundColor="faded"
          paddingHorizontal="s"
          paddingVertical="xs"
          borderRadius={6}>
          <Text
            fontSize={12}
            variant="semibold"
            style={{ color: getStatusColor(item.status) }}>
            {item.status.toUpperCase()}
          </Text>
        </Box>
      </Box>

      <Box flexDirection="row" alignItems="center" gap="m" marginBottom="s">
        <Box flexDirection="row" alignItems="center" gap="xs">
          <MaterialCommunityIcons
            name="calendar"
            size={16}
            color={theme.colors.label}
          />
          <Text fontSize={14} color="label">
            {moment(item.date).format('MMM DD, YYYY')}
          </Text>
        </Box>
        
        <Box flexDirection="row" alignItems="center" gap="xs">
          <MaterialCommunityIcons
            name="clock"
            size={16}
            color={theme.colors.label}
          />
          <Text fontSize={14} color="label">
            {item.time} ({item.duration} min)
          </Text>
        </Box>
      </Box>

      <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="s">
        <Text variant="semibold" color="primary">
          ${item.totalAmount}
        </Text>
        
        {item.videoRecording && (
          <Box flexDirection="row" alignItems="center" gap="xs">
            <MaterialCommunityIcons
              name="video"
              size={16}
              color={theme.colors.primary}
            />
            <Text fontSize={12} color="primary">
              Video Recording
            </Text>
          </Box>
        )}
      </Box>

      {item.message && (
        <Box marginBottom="s">
          <Text fontSize={14} color="foreground" numberOfLines={2}>
            "{item.message}"
          </Text>
        </Box>
      )}

      <Box flexDirection="row" gap="s">
        {item.status === 'pending' && (
          <>
            <Box flex={1}>
              <TouchableOpacity
                onPress={() => navigation.navigate('RescheduleConsultation', { 
                  appointment: item 
                })}>
                <Box
                  backgroundColor="faded"
                  borderRadius={8}
                  padding="s"
                  alignItems="center">
                  <Text variant="medium" color="foreground">
                    Reschedule
                  </Text>
                </Box>
              </TouchableOpacity>
            </Box>
            
            <Box flex={1}>
              <TouchableOpacity onPress={() => handleCancelConsultation(item.id)}>
                <Box
                  backgroundColor="danger"
                  borderRadius={8}
                  padding="s"
                  alignItems="center">
                  <Text variant="medium" color="white">
                    Cancel
                  </Text>
                </Box>
              </TouchableOpacity>
            </Box>
          </>
        )}
        
        {item.status === 'confirmed' && (
          <Box flex={1}>
            <TouchableOpacity>
              <Box
                backgroundColor="primary"
                borderRadius={8}
                padding="s"
                alignItems="center">
                <Text variant="medium" color="white">
                  Join Meeting
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <BaseScreenComponent>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1}>
          {/* Header */}
          <Box
            flexDirection="row"
            alignItems="center"
            paddingHorizontal="l"
            paddingVertical="m"
            gap="m">
            <TouchableOpacity onPress={navigation.goBack}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={24}
                color={theme.colors.foreground}
              />
            </TouchableOpacity>
            
            <Box flex={1} alignItems="center">
              <Text variant="semibold" fontSize={18}>
                My Consultations
              </Text>
            </Box>
            
            <Box width={24} />
          </Box>

          {/* Content */}
          <Box flex={1} paddingHorizontal="l">
            {isLoading && !refreshing ? (
              <Box flex={1} justifyContent="center" alignItems="center">
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </Box>
            ) : (
              <FlatList
                data={consultations}
                keyExtractor={(item) => item.id}
                renderItem={renderConsultationItem}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }
                ListEmptyComponent={
                  <Box paddingTop="xl">
                    <EmptyState
                      title="No consultations yet"
                      description="Book your first consultation to get started"
                      actionText="Browse Consultants"
                      onAction={() => navigation.navigate('Tabs', { screen: 'Consultant' })}
                    />
                  </Box>
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </Box>
        </Box>
      </SafeAreaView>
    </BaseScreenComponent>
  );
};

export default MyConsultationScreen;