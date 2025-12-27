import { ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
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
import { MainStack, Appointment, ErrorData } from '../utils/ParamList';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../utils/theme';
import { setAuthTrigger } from '../state/reducers/user.reducer';
import { useCancelAppointmentMutation } from '../state/services/appointment.service';
import { addAlpha } from '../utils/helpers';

interface Props {
  item: Appointment;
  onRefresh?: () => void;
}

const ConsultationItem = ({ item, onRefresh }: Props) => {
  const theme = useTheme<Theme>();
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [apptDeleted, setApptDeleted] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<MainStack>>();
  const [cancelBooking, { isLoading: cancelLoading }] = useCancelAppointmentMutation();
  const dispatch = useDispatch();

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
        <Box
          marginBottom="l"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Box flexDirection="row" alignItems="center" gap="s">
            <Box
              height={44}
              width={44}
              borderRadius={4}
              backgroundColor="faded"
              overflow="hidden"
              justifyContent="center"
              alignItems="center">
              <Text variant="semibold" fontSize={18}>
                {item?.consultant?.fullName?.charAt(0) || 'C'}
              </Text>
            </Box>
            <Box>
              <Text variant="semibold" fontSize={16}>
                {item?.consultant?.fullName}
              </Text>
              <Text>{item?.consultant?.title}</Text>
            </Box>
          </Box>
          <Box flexDirection="row" alignItems="center" gap="s">
            <TouchableOpacity>
              <Box
                width={40}
                height={40}
                borderRadius={6}
                backgroundColor="background"
                justifyContent="center"
                alignItems="center"
                shadowColor="foreground"
                shadowOpacity={0.1}
                shadowRadius={4}
                elevation={2}
                shadowOffset={{
                  height: 0,
                  width: 0,
                }}>
                <MaterialCommunityIcons name="message" color={theme.colors.label} size={20} />
              </Box>
            </TouchableOpacity>
            <TouchableOpacity>
              <Box
                width={40}
                height={40}
                backgroundColor="background"
                borderRadius={6}
                justifyContent="center"
                alignItems="center"
                shadowColor="foreground"
                shadowOpacity={0.1}
                shadowRadius={4}
                elevation={2}
                shadowOffset={{
                  height: 0,
                  width: 0,
                }}>
                <MaterialCommunityIcons name="video" color={theme.colors.label} size={20} />
              </Box>
            </TouchableOpacity>
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
        <Box flexDirection="row" gap="l">
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
    </>
  );
};

export default ConsultationItem;