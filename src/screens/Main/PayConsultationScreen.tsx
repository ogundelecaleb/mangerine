import { ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LocaleConfig } from 'react-native-calendars';

import Box from '../../components/Box';
import Text from '../../components/Text';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import Button from '../../components/Button';
import { MainStack } from '../../utils/ParamList';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../utils/theme';
import { useBookAppointmentMutation } from '../../state/services/appointment.service';
import { useAuth } from '../../state/hooks/user.hook';
import { useDispatch } from 'react-redux';
import { setAuthTrigger } from '../../state/reducers/user.reducer';
import { showMessage } from 'react-native-flash-message';
import { ErrorData } from '../../utils/ParamList';

LocaleConfig.locales.en = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan',
    'Feb.',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Déc',
  ],
  dayNames: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],

  dayNamesShort: ['S', 'M', 'T', 'W', 'TH', 'F', 'S'],
  today: 'Today',
};

LocaleConfig.defaultLocale = 'en';

const PayConsultationScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<MainStack, 'PayConsultation'>) => {
  const theme = useTheme<Theme>();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [createBooking, { isLoading }] = useBookAppointmentMutation();
  const [paymentData] = useState(route?.params?.paymentData);

  const confirmPayment = useCallback(async () => {
    try {
      if (!paymentData?.paymentDetails) {
        showMessage({
          message: 'Payment data is missing',
          type: 'danger',
        });
        return;
      }

      const { consultationDetails } = paymentData;
      
      const response = await createBooking({
        body: {
          availabilityId: consultationDetails.availabilityId,
          consultantId: consultationDetails.consultantId,
          message: consultationDetails.message,
          timeslots: consultationDetails.timeslots,
          userId: consultationDetails.userId,
          videoOption: consultationDetails.videoOption,
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
      
      dispatch(
        setAuthTrigger({
          trigger: true,
        }),
      );
      
      navigation.goBack();
      showMessage({
        message: 'Payment successful! Booking confirmed.',
        type: 'success',
      });
    } catch (error) {
      console.log('payment confirmation error:', error);
      showMessage({
        message: 'Failed to confirm booking',
        type: 'danger',
      });
    }
  }, [createBooking, dispatch, navigation, paymentData]);

  const paymentDetails = paymentData?.paymentDetails;

  useEffect(() => {
    if (!paymentData) {
      showMessage({
        message: 'Invalid payment session',
        type: 'danger',
      });
      navigation.goBack();
    }
  }, [paymentData, navigation]);

  return (
    <BaseScreenComponent>
      <Box flex={1}>
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
                  onPress={navigation.goBack}
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
                  Payment
                </Text>
              </Box>
              <Box padding="s" opacity={0}>
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={24}
                  color={theme.colors.foreground}
                />
              </Box>
            </Box>
            <Box flex={1} position="relative">
              <ScrollView showsVerticalScrollIndicator={false}>
                <Box paddingVertical="l">
                  <Box
                    marginHorizontal="l"
                    backgroundColor="background"
                    padding="m"
                    borderRadius={8}
                    borderWidth={1}
                    borderColor="border">
                    <Box>
                      <Text variant="semibold" fontSize={18}>
                        Payment Information
                      </Text>
                    </Box>
                    <Box gap="s" marginTop="m">
                      <Box
                        flexDirection="row"
                        gap="l"
                        alignItems="center"
                        justifyContent="space-between">
                        <Box flex={1}>
                          <Text variant="medium">Consultation Fee</Text>
                        </Box>
                        <Box>
                          <Text>${paymentDetails?.basePrice?.toFixed(2) || '0.00'}</Text>
                        </Box>
                      </Box>
                      {paymentDetails?.hasRecording && (
                        <Box
                          flexDirection="row"
                          gap="l"
                          alignItems="center"
                          justifyContent="space-between">
                          <Box flex={1}>
                            <Text variant="medium">Recording Fee</Text>
                          </Box>
                          <Box>
                            <Text>$5.00</Text>
                          </Box>
                        </Box>
                      )}
                      {(paymentDetails?.penaltyAmount || 0) > 0 && (
                        <Box
                          flexDirection="row"
                          gap="l"
                          alignItems="center"
                          justifyContent="space-between">
                          <Box flex={1}>
                            <Text variant="medium">Penalty ({paymentDetails?.penaltyInfo})</Text>
                          </Box>
                          <Box>
                            <Text>${paymentDetails?.penaltyAmount?.toFixed(2)}</Text>
                          </Box>
                        </Box>
                      )}
                      <Box
                        flexDirection="row"
                        gap="l"
                        alignItems="center"
                        justifyContent="space-between">
                        <Box flex={1}>
                          <Text variant="medium" fontSize={16}>
                            Total Fee
                          </Text>
                        </Box>
                        <Box>
                          <Text variant="medium" fontSize={16}>
                            ${paymentDetails?.price?.toFixed(2) || '0.00'}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box marginHorizontal="l" marginTop="xxl" marginBottom="xl">
                    <Button 
                      displayText="Confirm Payment" 
                      onPress={confirmPayment}
                      loading={isLoading}
                    />
                  </Box>
                </Box>
              </ScrollView>
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};

export default PayConsultationScreen;