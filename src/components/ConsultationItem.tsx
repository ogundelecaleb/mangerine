import { ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import Box from './Box';
import Text from './Text';
import Button from './Button';
import ConfirmModal from './ConfirmModal';
import AgoraCallModal from './AgoraCallModal';
import { MainStack, Appointment, ErrorData } from '../utils/ParamList';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../utils/theme';
import { setAuthTrigger } from '../state/reducers/user.reducer';
import { useCancelAppointmentMutation } from '../state/services/appointment.service';
import { addAlpha } from '../utils/helpers';
import { useAuth } from '../state/hooks/user.hook';

interface Props {
  item: Appointment;
  onRefresh?: () => void;
}

const ConsultationItem = ({ item, onRefresh }: Props) => {
  const theme = useTheme<Theme>();
  const { user } = useAuth();
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [apptDeleted, setApptDeleted] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<MainStack>>();
  const [cancelBooking, { isLoading: cancelLoading }] = useCancelAppointmentMutation();
  const dispatch = useDispatch();

  const appointmentStatus = useMemo(() => {
    const appointmentDate = moment(item?.availability?.date);
    const startTime = item?.timeslots?.[0]?.startTime;
    const endTime = item?.timeslots?.[0]?.endTime;
    
    if (!startTime || !endTime) return { canJoin: false, status: 'unknown', message: '' };
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const appointmentStart = appointmentDate.clone().set({ hour: startHour, minute: startMin });
    const appointmentEnd = appointmentDate.clone().set({ hour: endHour, minute: endMin });
    
    const now = moment();
    const windowStart = appointmentStart.clone().subtract(5, 'minutes');
    const windowEnd = appointmentEnd.clone().add(15, 'minutes');
    
    // Check if can join (5 mins before to 15 mins after)
    if (now.isBetween(windowStart, windowEnd)) {
      return { canJoin: true, status: 'active', message: 'Join Now' };
    }
    
    // Check if appointment has passed
    if (now.isAfter(windowEnd)) {
      return { canJoin: false, status: 'completed', message: 'Completed' };
    }
    
    // Appointment is upcoming
    const duration = moment.duration(appointmentStart.diff(now));
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    
    if (hours > 0) {
      return { canJoin: false, status: 'upcoming', message: `Starts in ${hours}h ${minutes}m` };
    } else if (minutes > 0) {
      return { canJoin: false, status: 'upcoming', message: `Starts in ${minutes}m` };
    }
    
    return { canJoin: false, status: 'upcoming', message: 'Starting soon' };
  }, [item]);

  const conversation = useMemo(() => ({
    id: item?.id,
    consultantId: item?.consultantId,
    userId: item?.userId,
    consultant: item?.consultant,
    user: item?.user,
  }), [item]);

  const cancelThisAppointment = useCallback(async () => {
    try {
      const response = await cancelBooking({
        appointmentId: item?.id,
        userId: item?.userId,
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
      dispatch(
        setAuthTrigger({
          trigger: true,
        }),
      );
      onRefresh && onRefresh();
      setApptDeleted(true);
    } catch (error) {
      console.log('cancel error:', error);
    }
  }, [cancelBooking, dispatch, item, onRefresh]);

  return (
    <>
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
        <Box marginBottom="m">
          <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom="m">
            <Box flexDirection="row" alignItems="center" gap="s" flex={1}>
              <Box
                height={48}
                width={48}
                borderRadius={24}
                backgroundColor="faded"
                overflow="hidden"
                justifyContent="center"
                alignItems="center">
                <Text variant="semibold" fontSize={18}>
                  {item?.consultant?.fullName?.charAt(0) || 'C'}
                </Text>
              </Box>
              <Box flex={1}>
                <Text variant="semibold" fontSize={16} numberOfLines={1}>
                  {item?.consultant?.fullName}
                </Text>
                <Text fontSize={13} color="label" numberOfLines={1}>
                  {item?.consultant?.title}
                </Text>
              </Box>
            </Box>
            <Box flexDirection="row" alignItems="center" gap="s">
              <TouchableOpacity>
                <Box
                  width={40}
                  height={40}
                  borderRadius={20}
                  backgroundColor="faded"
                  justifyContent="center"
                  alignItems="center">
                  <MaterialCommunityIcons name="message" color={theme.colors.label} size={20} />
                </Box>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => appointmentStatus.canJoin && setShowCallModal(true)}
                disabled={!appointmentStatus.canJoin}
              >
                <Box
                  width={40}
                  height={40}
                  backgroundColor={appointmentStatus.canJoin ? "primary" : "faded"}
                  borderRadius={20}
                  justifyContent="center"
                  alignItems="center">
                  <MaterialCommunityIcons 
                    name="video" 
                    color={appointmentStatus.canJoin ? "#FFF" : theme.colors.label} 
                    size={20} 
                  />
                </Box>
              </TouchableOpacity>
            </Box>
          </Box>
          
          {/* Status Badge */}
          <Box
            alignSelf="flex-start"
            paddingHorizontal="m"
            paddingVertical="xs"
            borderRadius={12}
            style={{
              backgroundColor:
                appointmentStatus.status === 'active' ? addAlpha(theme.colors.primary, 0.1) :
                appointmentStatus.status === 'completed' ? addAlpha('#9E9E9E', 0.1) :
                addAlpha(theme.colors.primary, 0.05)
            }}>
            <Text 
              fontSize={12} 
              variant="medium"
              color={
                appointmentStatus.status === 'active' ? 'primary' :
                appointmentStatus.status === 'completed' ? 'label' :
                'foreground'
              }>
              {appointmentStatus.message}
            </Text>
          </Box>
        </Box>
        <Box
          backgroundColor="faded"
          marginBottom="l"
          borderRadius={6}
          paddingHorizontal="m"
          height={40}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Box flexDirection="row" alignItems="center" gap="xs">
            <MaterialCommunityIcons
              name="calendar-text-outline"
              size={16}
              color={theme.colors.label}
            />
            <Text>
              {moment(item?.availability?.date).format('MMM D, YYYY')}
            </Text>
          </Box>
          <Box flexDirection="row" alignItems="center" gap="xs">
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color={theme.colors.label}
            />
            <Text>
              {item?.timeslots?.[0]?.startTime} -{' '}
              {item?.timeslots?.[0]?.endTime}
            </Text>
          </Box>
        </Box>
        {appointmentStatus.status !== 'completed' && (
          <Box flexDirection="row" gap="m">
            <Box flex={1}>
              <Button
                displayText="Cancel"
                onPress={() => setCancelConfirm(true)}
              />
            </Box>
            <Box flex={1}>
              <Button
                displayText="Reschedule"
                onPress={() =>
                  navigation.navigate('RescheduleConsultation', {
                    appointment: item,
                  })
                }
              />
            </Box>
          </Box>
        )}
      </Box>
      
      {cancelLoading && (
        <Box alignItems="center" padding="l">
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </Box>
      )}

      <ConfirmModal
        closeModal={() => setCancelConfirm(false)}
        isVisible={cancelConfirm}
        title="Are you sure you want to cancel?"
        subtitle="You'll lose the option to reschedule, and 10% of your payment will be deducted. Proceed?"
        confirmButton="Yes, Cancel"
        cancelButton="No, Keep"
        confirm={() => {
          setCancelConfirm(false);
          setTimeout(() => {
            cancelThisAppointment();
          }, 900);
        }}
        headComponent={
          <Box
            height={80}
            width={80}
            justifyContent="center"
            alignItems="center"
            borderRadius={100}
            style={{
              backgroundColor: addAlpha('#FFC107', 0.1),
            }}>
            <Box
              justifyContent="center"
              alignItems="center"
              borderRadius={12}
              height={36}
              width={36}
              style={{
                backgroundColor: '#FFC107',
              }}>
              <MaterialCommunityIcons
                name="exclamation"
                color="#FFF"
                size={24}
              />
            </Box>
          </Box>
        }
      />

      <ConfirmModal
        closeModal={() => setApptDeleted(false)}
        isVisible={apptDeleted}
        title="Consultation Canceled Successfully"
        subtitle="10% has been deducted, and the remaining amount is credited to your wallet."
        confirmButton="View Transaction"
        cancelButton="Cancel"
        confirm={() => {
          setApptDeleted(false);
          setTimeout(() => {
            navigation.navigate('MyConsultation');
          }, 900);
        }}
        headComponent={
          <Box
            height={80}
            width={80}
            justifyContent="center"
            alignItems="center"
            borderRadius={100}
            style={{
              backgroundColor: addAlpha('#4CAF50', 0.1),
            }}>
            <Box
              justifyContent="center"
              alignItems="center"
              borderRadius={12}
              height={36}
              width={36}
              style={{
                backgroundColor: '#4CAF50',
              }}>
              <MaterialCommunityIcons name="check" color="#FFF" size={24} />
            </Box>
          </Box>
        }
      />

      <AgoraCallModal
        isVisible={showCallModal}
        closeModal={() => setShowCallModal(false)}
        conversation={conversation as any}
        caller={user?.id || ''}
      />
    </>
  );
};

export default ConsultationItem;