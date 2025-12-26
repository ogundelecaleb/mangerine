import {
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message';
import moment from 'moment';

import Box from '../../components/Box';
import Text from '../../components/Text';
import Input from '../../components/Input';
import Button from '../../components/Button';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import { MainStack } from '../../utils/ParamList';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../utils/theme';
import { useAppSelector } from '../../state/hooks/redux';
import { useBookConsultationMutation } from '../../state/services/consultants.service';

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
}

type Props = NativeStackScreenProps<MainStack, 'BookConsultation'>;

const BookConsultationScreen = ({ navigation, route }: Props) => {
  const { consultant } = route.params;
  const theme = useTheme<Theme>();
  const user = useAppSelector(state => state.auth.user);
  const [bookConsultation, { isLoading }] = useBookConsultationMutation();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [message, setMessage] = useState('');
  const [videoRecording, setVideoRecording] = useState(false);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const durations = [
    { label: '30 minutes', value: '30', price: 50 },
    { label: '60 minutes', value: '60', price: 75 },
    { label: '90 minutes', value: '90', price: 100 },
    { label: '120 minutes', value: '120', price: 120 },
  ];

  const selectedDuration = durations.find(d => d.value === duration);
  const totalPrice = (selectedDuration?.price || 0) + (videoRecording ? 5 : 0);

  const handleBooking = useCallback(async () => {
    try {
      if (!selectedDate || !selectedTime || !duration) {
        showMessage({
          message: 'Please fill in all required fields',
          type: 'warning',
        });
        return;
      }

      const response = await bookConsultation({
        body: {
          consultantId: consultant.id,
          userId: user?.id,
          date: selectedDate,
          time: selectedTime,
          duration: parseInt(duration),
          message: message.trim(),
          videoRecording,
          totalAmount: totalPrice,
        },
      });

      if (response?.error) {
        const err = response as any;
        showMessage({
          message: err?.error?.data?.message || 'Failed to book consultation',
          type: 'danger',
        });
        return;
      }

      showMessage({
        message: 'Consultation booked successfully!',
        type: 'success',
      });

      navigation.navigate('MyConsultation');
    } catch (error) {
      console.log('booking error:', error);
      showMessage({
        message: 'Failed to book consultation',
        type: 'danger',
      });
    }
  }, [
    selectedDate,
    selectedTime,
    duration,
    message,
    videoRecording,
    totalPrice,
    consultant.id,
    user?.id,
    bookConsultation,
    navigation,
  ]);

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
                Book Consultation
              </Text>
            </Box>
            
            <Box width={24} />
          </Box>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Box padding="l" gap="l">
              {/* Consultant Info */}
              <Box
                backgroundColor="faded"
                borderRadius={12}
                padding="m"
                flexDirection="row"
                gap="m">
                <Box
                  width={60}
                  height={60}
                  borderRadius={30}
                  backgroundColor="background"
                  justifyContent="center"
                  alignItems="center">
                  <Text variant="bold" fontSize={20}>
                    {consultant.fullName.charAt(0)}
                  </Text>
                </Box>
                
                <Box flex={1}>
                  <Text variant="semibold" fontSize={16}>
                    {consultant.fullName}
                  </Text>
                  <Text color="label" fontSize={14}>
                    {consultant.specialization || consultant.title}
                  </Text>
                  {consultant.hourlyRate && (
                    <Text color="primary" variant="semibold">
                      ${consultant.hourlyRate}/hour
                    </Text>
                  )}
                </Box>
              </Box>

              {/* Date Selection */}
              <Box>
                <Text variant="semibold" fontSize={16} marginBottom="s">
                  Select Date
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    // For now, set tomorrow as default
                    const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');
                    setSelectedDate(tomorrow);
                  }}>
                  <Box
                    borderWidth={1}
                    borderColor="border"
                    borderRadius={8}
                    padding="m"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center">
                    <Text>
                      {selectedDate 
                        ? moment(selectedDate).format('MMMM DD, YYYY')
                        : 'Choose a date'
                      }
                    </Text>
                    <MaterialCommunityIcons
                      name="calendar"
                      size={20}
                      color={theme.colors.label}
                    />
                  </Box>
                </TouchableOpacity>
              </Box>

              {/* Time Selection */}
              {selectedDate && (
                <Box>
                  <Text variant="semibold" fontSize={16} marginBottom="s">
                    Select Time
                  </Text>
                  <Box flexDirection="row" flexWrap="wrap" gap="s">
                    {timeSlots.map((time) => (
                      <TouchableOpacity
                        key={time}
                        onPress={() => setSelectedTime(time)}>
                        <Box
                          paddingHorizontal="m"
                          paddingVertical="s"
                          borderWidth={1}
                          borderRadius={8}
                          borderColor={selectedTime === time ? 'primary' : 'border'}
                          backgroundColor={selectedTime === time ? 'primary' : 'background'}>
                          <Text
                            color={selectedTime === time ? 'white' : 'foreground'}
                            variant="medium">
                            {time}
                          </Text>
                        </Box>
                      </TouchableOpacity>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Duration Selection */}
              {selectedTime && (
                <Box>
                  <Text variant="semibold" fontSize={16} marginBottom="s">
                    Duration & Pricing
                  </Text>
                  <Box gap="s">
                    {durations.map((dur) => (
                      <TouchableOpacity
                        key={dur.value}
                        onPress={() => setDuration(dur.value)}>
                        <Box
                          flexDirection="row"
                          justifyContent="space-between"
                          alignItems="center"
                          padding="m"
                          borderWidth={1}
                          borderRadius={8}
                          borderColor={duration === dur.value ? 'primary' : 'border'}
                          backgroundColor={duration === dur.value ? 'faded' : 'background'}>
                          <Text variant="medium">{dur.label}</Text>
                          <Text variant="semibold" color="primary">
                            ${dur.price}
                          </Text>
                        </Box>
                      </TouchableOpacity>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Message */}
              <Box>
                <Text variant="semibold" fontSize={16} marginBottom="s">
                  Message (Optional)
                </Text>
                <Input
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  placeholder="Any specific topics or questions you'd like to discuss?"
                  value={message}
                  onChangeText={setMessage}
                />
              </Box>

              {/* Video Recording Option */}
              <Box flexDirection="row" alignItems="center" gap="m">
                <TouchableOpacity onPress={() => setVideoRecording(!videoRecording)}>
                  <Box
                    width={20}
                    height={20}
                    borderRadius={4}
                    borderWidth={2}
                    borderColor={videoRecording ? 'primary' : 'border'}
                    backgroundColor={videoRecording ? 'primary' : 'background'}
                    justifyContent="center"
                    alignItems="center">
                    {videoRecording && (
                      <MaterialCommunityIcons
                        name="check"
                        size={14}
                        color="white"
                      />
                    )}
                  </Box>
                </TouchableOpacity>
                <Box flex={1}>
                  <Text>
                    Record consultation video{' '}
                    <Text color="primary" variant="semibold">
                      (+$5)
                    </Text>
                  </Text>
                </Box>
              </Box>

              {/* Total Price */}
              {selectedDuration && (
                <Box
                  backgroundColor="faded"
                  borderRadius={8}
                  padding="m"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center">
                  <Text variant="semibold" fontSize={16}>
                    Total Amount
                  </Text>
                  <Text variant="bold" fontSize={18} color="primary">
                    ${totalPrice}
                  </Text>
                </Box>
              )}

              {/* Book Button */}
              <Box marginTop="m">
                <Button
                  displayText={isLoading ? 'Booking...' : 'Book Consultation'}
                  onPress={handleBooking}
                  disabled={!selectedDate || !selectedTime || !duration || isLoading}
                  loading={isLoading}
                />
              </Box>
            </Box>
          </ScrollView>
        </Box>
      </SafeAreaView>
    </BaseScreenComponent>
  );
};

export default BookConsultationScreen;