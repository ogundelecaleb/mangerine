import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message';
import moment from 'moment';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useDispatch } from 'react-redux';

import Box from '../../components/Box';
import Text from '../../components/Text';
import Input from '../../components/Input';
import Button from '../../components/Button';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import { MainStack, Availability, ErrorData } from '../../utils/ParamList';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../utils/theme';
import { setAuthTrigger } from '../../state/reducers/user.reducer';
import { useRescheduleAppointmentMutation } from '../../state/services/appointment.service';
import { useGetConsultantAvailabilityMutation } from '../../state/services/availability.service';
import { useAuth } from '../../state/hooks/user.hook';
import CheckBox from '@/components/Checkbox';

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

const RescheduleConsultationScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<MainStack, 'RescheduleConsultation'>) => {
  const theme = useTheme<Theme>();
  const [selectedTime, setSelectedTime] = useState(
    route?.params?.appointment?.timeslots?.[0]?.id || '',
  );
  const [message, setMessage] = useState('');
  const [video, setVideo] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [activeMonth, setActiveMonth] = useState(
    moment(route?.params?.appointment?.availability?.date).format('YYYY-MM-DD'),
  );
  const [markedDate, setMarkedDate] = useState(
    route?.params?.appointment?.availability?.date || '',
  );
  const [getAvailability, { isLoading: availabilityLoading }] =
    useGetConsultantAvailabilityMutation();
  const { user } = useAuth();
  const [createBooking, { isLoading }] = useRescheduleAppointmentMutation();
  const [availability, setAvailability] = useState<Availability[]>([]);
  const dispatch = useDispatch();

  const fullMonth = useMemo(
    () =>
      Array.from(
        {
          length: moment(activeMonth).daysInMonth(),
        },
        (_, i) => ({
          index: i,
          dateString:
            moment(activeMonth).format('YYYY-MM') +
            '-' +
            (i <= 8 ? `0${i + 1}` : `${i + 1}`),
        }),
      ),
    [activeMonth],
  );

  const availableMarkedDate = useMemo(() => {
    const transformedAvailability = availability.map(availabledate => ({
      [availabledate.date]: {
        marked: true,
        dotColor:
          markedDate === availabledate.date ? theme.colors.primary : undefined,
        selected: markedDate === availabledate.date,
      },
    }));
    return Object.values({
      ...transformedAvailability.flat(),
    }).reduce(
      (
        acc: {
          [x: string]: {
            marked: boolean;
            dotColor: string | undefined;
          };
        },
        obj,
      ) => {
        const [key, value] = Object.entries(obj)[0];
        acc[key] = value;
        return acc;
      },
      {},
    );
  }, [availability, theme.colors.primary, markedDate]);

  const inactiveDates = useMemo(() => {
    const stringAvailableDates = Object.keys(availableMarkedDate || {});

    return fullMonth.filter(d => {
      return !stringAvailableDates.includes(d.dateString);
    });
  }, [availableMarkedDate, fullMonth]);

  const loadConsultancy = useCallback(async () => {
    try {
      const response = await getAvailability({
        params: {
          userId: route?.params?.appointment?.consultantId!,
          startDate: moment(activeMonth).startOf('month').format('YYYY/MM/DD'),
          endDate: moment(activeMonth).endOf('month').format('YYYY/MM/DD'),
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
      setAvailability((response as any)?.data?.data || []);
    } catch (error) {
      console.log('get availability error', JSON.stringify(error));
    }
  }, [getAvailability, route, activeMonth]);

  useEffect(() => {
    loadConsultancy();
  }, [loadConsultancy]);

  const bookAppointment = useCallback(async () => {
    try {
      const response = await createBooking({
        body: {
          availabilityId: availability.find(a => a.date === markedDate)?.id!,
          consultantId: route?.params?.appointment?.consultantId,
          message,
          timeslots: selectedTime ? [selectedTime] : [],
          userId: user?.id!,
          videoOption: video,
        },
        appointmentId: route?.params?.appointment?.id!,
        userId: route?.params?.appointment?.userId!,
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
      navigation?.goBack();
      showMessage({
        message: 'You have successfully updated your booking',
        type: 'success',
      });
    } catch (error) {
      console.log('book error:', error);
    }
  }, [
    availability,
    createBooking,
    dispatch,
    markedDate,
    message,
    navigation,
    route,
    selectedTime,
    user?.id,
    video,
  ]);

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
                  Reschedule Consultation
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
                  <Box marginHorizontal="l" gap="m" marginBottom="m">
                    {availabilityLoading && (
                      <Box alignItems="center">
                        <Text fontSize={12} textAlign="center">
                          Loading availability for the month...
                        </Text>
                      </Box>
                    )}
                    <Box>
                      <TouchableOpacity
                        onPress={() => setShowCalendar(!showCalendar)}>
                        <Box
                          borderWidth={1}
                          borderRadius={8}
                          borderColor="border"
                          height={50}
                          backgroundColor="background"
                          overflow="hidden"
                          flexDirection="row"
                          paddingHorizontal="m"
                          justifyContent="space-between"
                          alignItems="center">
                          <Text fontSize={16}>Select Date</Text>
                          <MaterialCommunityIcons
                            name="chevron-down"
                            size={16}
                            color={theme.colors.foreground}
                          />
                        </Box>
                      </TouchableOpacity>
                    </Box>
                    {showCalendar && (
                      <Box
                        borderRadius={8}
                        backgroundColor="background"
                        elevation={4}
                        shadowColor="foreground"
                        shadowOpacity={0.1}
                        shadowRadius={10}
                        shadowOffset={{
                          height: 4,
                          width: 0,
                        }}>
                        <Calendar
                          style={{
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                            height: 350,
                          }}
                          onMonthChange={dateData => {
                            setActiveMonth(dateData.dateString);
                          }}
                          disableAllTouchEventsForInactiveDays
                          disableAllTouchEventsForDisabledDays
                          hideExtraDays
                          markedDates={availableMarkedDate}
                          monthFormat={'MMM, yyyy'}
                          disabledDaysIndexes={inactiveDates.map(x => x.index)}
                          minDate={moment().toISOString()}
                          onDayPress={day => {
                            if (
                              availability.find(a => a.date === day.dateString)
                            ) {
                              setMarkedDate(day.dateString);
                            }
                          }}
                          theme={{
                            backgroundColor: 'transparent',
                            calendarBackground: 'transparent',
                            textSectionTitleColor: theme.colors.primary,
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: theme.colors.foreground,
                            dayTextColor: theme.colors.foreground,
                            textDisabledColor: theme.colors.label,
                            textDayFontSize: 12,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 12,
                            dotColor: theme.colors.primary,
                            arrowColor: theme.colors.primary,
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                  {markedDate && (
                    <Box marginHorizontal="l" gap="m">
                      <Text fontSize={20} variant="semibold">
                        Select Time
                      </Text>
                      <Box
                        flexDirection="row"
                        alignItems="flex-start"
                        gap="l"
                        flexWrap="wrap">
                        {availability
                          .find(a => a.date === markedDate)
                          ?.timeslots?.map(t => (
                            <TouchableOpacity
                              disabled={t?.isBooked}
                              key={t.id}
                              onPress={() => setSelectedTime(t.id)}>
                              <Box
                                height={40}
                                justifyContent="center"
                                paddingHorizontal="m"
                                opacity={t?.isBooked ? 0.5 : undefined}
                                borderWidth={1}
                                borderRadius={6}
                                borderColor={
                                  selectedTime === t.id
                                    ? 'primary'
                                    : 'label'
                                }>
                                <Text
                                  fontSize={16}
                                  variant="semibold"
                                  color={
                                    selectedTime === t.id
                                      ? 'primary'
                                      : 'label'
                                  }>
                                  {t.startTime}
                                </Text>
                              </Box>
                            </TouchableOpacity>
                          ))}
                      </Box>
                    </Box>
                  )}
                  {selectedTime && (
                    <Box marginHorizontal="l" gap="m" marginTop="l">
                      <Text fontSize={20} variant="semibold">
                        Duration & Pricing
                      </Text>
                      <Box>
                        <Input
                          value={
                            availability
                              .find(a => a.date === markedDate)
                              ?.timeslots?.find(s => s.id === selectedTime)
                              ?.duration
                              ? `${
                                  availability
                                    .find(a => a.date === markedDate)
                                    ?.timeslots?.find(
                                      s => s.id === selectedTime,
                                    )?.duration || ''
                                } minutes`
                              : ''
                          }
                          editable={false}
                        />
                      </Box>
                    </Box>
                  )}
                  <Box marginHorizontal="l" gap="m" marginTop="l">
                    <Text fontSize={20} variant="semibold">
                      Message to Consultant
                    </Text>
                    <Box>
                      <Input
                        textAlignVertical="top"
                        borderColor="border"
                        height={120}
                        multiline
                        placeholder="Have anything to say to this consultant?"
                        value={message}
                        onChangeText={setMessage}
                      />
                    </Box>
                  </Box>
                  <Box
                    marginTop="m"
                    marginHorizontal="l"
                    flexDirection="row"
                    alignItems="flex-start"
                    gap="m">
                    <CheckBox
                      checked={video}
                      size={16}
                      onPress={() => setVideo(!video)}
                    />
                    <Box flex={1}>
                      <Text color="label" fontSize={16}>
                        Send me a recorded video of the consultation at{' '}
                        <Text fontSize={16}>$5</Text>
                      </Text>
                    </Box>
                  </Box>
                  <Box marginHorizontal="l" marginTop="xxl" marginBottom="xl">
                    <Button
                      disabled={!markedDate || !selectedTime}
                      loading={isLoading}
                      onPress={bookAppointment}
                      displayText="Reschedule Consultation"
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

export default RescheduleConsultationScreen;