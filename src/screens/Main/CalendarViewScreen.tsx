import { Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';

import Box from '../../components/Box';
import Text from '../../components/Text';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import { MainStack, Appointment, Availability, ErrorData } from '../../utils/ParamList';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../utils/theme';
import { useAuth } from '../../state/hooks/user.hook';
import { useGetConsultantAvailabilityMutation } from '../../state/services/availability.service';
import { useGetMyAppointmentsMutation } from '../../state/services/appointment.service';

const CalendarViewScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'CalendarView'>) => {
  const theme = useTheme<Theme>();
  const { user } = useAuth();
  const [markedDate, setMarkedDate] = useState('');
  const [getAvailability, {}] = useGetConsultantAvailabilityMutation();
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [activeMonth, setActiveMonth] = useState(moment().format('YYYY-MM-DD'));
  const [getAppointments, {}] = useGetMyAppointmentsMutation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedView, setSelectedView] = useState<
    | {
        marked: boolean;
        dotColor: string | undefined;
        appointments: Appointment[];
        date: string;
      }
    | undefined
  >(undefined);

  const availableMarkedDate = useMemo(() => {
    const transformedAvailability = availability.map(availabledate => ({
      [availabledate.date]: {
        marked: true,
        dotColor:
          markedDate === availabledate.date ? theme.colors.primary : undefined,
        selected: markedDate === availabledate.date,
        appointments: appointments?.filter(
          x => x?.availability?.date === availabledate?.date,
        ),
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
            appointments: Appointment[];
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
  }, [availability, theme.colors.primary, markedDate, appointments]);

  const loadAppointments = useCallback(async () => {
    try {
      const response = await getAppointments({
        params: {
          limit: 50,
          page: 1,
          status: 'UPCOMING',
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
      setAppointments((response as any)?.data?.data || []);
    } catch (error) {
      console.log('get appointments error', JSON.stringify(error));
    }
  }, [getAppointments]);

  const loadConsultancy = useCallback(async () => {
    try {
      const response = await getAvailability({
        params: {
          userId: user?.id!,
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
  }, [getAvailability, user, activeMonth]);

  useEffect(() => {
    loadConsultancy();
  }, [loadConsultancy]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  return (
    <BaseScreenComponent>
      <Box flex={1} backgroundColor="background">
        <SafeAreaView style={{ flex: 1 }}>
          <Modal
            isVisible={selectedView !== undefined}
            onClose={() => setSelectedView(undefined)}
            title={`Appointment for ${selectedView !== undefined &&
              moment(selectedView?.date).format('DD/MM/YYYY')}`}
          >
            <Box maxHeight={Dimensions.get('window').height * 0.65}>
              <ScrollView>
                <Box>
                  {(selectedView?.appointments?.length || 0) > 0 &&
                    selectedView?.appointments?.map((x, index) => (
                      <Box key={x?.id}>
                        <Text
                          variant="semibold"
                          fontSize={16}
                          marginBottom="l">
                          Appointment {index + 1}
                        </Text>
                        <Box gap="m">
                          <Box
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center">
                            <Box>
                              <Text color="label">Client Name:</Text>
                            </Box>
                            <Box>
                              <Text>
                                {x?.consultantId === user?.id
                                  ? x?.user?.fullName
                                  : x?.consultant?.fullName}
                              </Text>
                            </Box>
                          </Box>
                          <Box
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center">
                            <Box>
                              <Text color="label">Consultation Topic:</Text>
                            </Box>
                            <Box>
                              <Text>{x?.message}</Text>
                            </Box>
                          </Box>
                          <Box
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center">
                            <Box>
                              <Text color="label">Time:</Text>
                            </Box>
                            <Box>
                              <Text>{x?.timeslots?.[0]?.startTime}</Text>
                            </Box>
                          </Box>
                          <Box
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center">
                            <Box>
                              <Text color="label">Duration:</Text>
                            </Box>
                            <Box>
                              <Text>{x?.timeslots?.[0]?.duration}</Text>
                            </Box>
                          </Box>
                          <Box
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center">
                            <Box>
                              <Text color="label">Status:</Text>
                            </Box>
                            <Box>
                              <Text>{x?.status}</Text>
                            </Box>
                          </Box>
                        </Box>
                        <Box flexDirection="row" gap="m" marginTop="l">
                          <Box flex={1}>
                            <Button
                              displayText="Reschedule"
                              variant="outline"
                            />
                          </Box>
                          <Box flex={1}>
                            <Button displayText="View Details" />
                          </Box>
                        </Box>
                      </Box>
                    ))}
                </Box>
              </ScrollView>
            </Box>
          </Modal>
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
                  Calendar
                </Text>
              </Box>
              <Box padding="s" opacity={0} width={32}></Box>
            </Box>
            <Box flex={1}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Box paddingVertical="m" paddingHorizontal="l">
                  <Box flexDirection="row" gap="m">
                    <Box flex={1}>
                      <Input
                        noMargin
                        borderColor="border"
                        placeholder="Search calendar"
                        leftComponent={
                          <Box paddingRight="s">
                            <MaterialCommunityIcons
                              name="magnify"
                              size={24}
                              color={theme.colors.label}
                            />
                          </Box>
                        }
                      />
                    </Box>
                    <Box>
                      <Button
                        buttonProps={{
                          height: 48,
                          width: 48,
                        }}>
                        <MaterialCommunityIcons
                          name="plus"
                          size={36}
                          color="#FFF"
                        />
                      </Button>
                    </Box>
                  </Box>
                  <Box marginTop="l">
                    <Box>
                      <Calendar
                        style={{
                          borderWidth: 1,
                          borderColor: theme.colors.border,
                          minHeight: 350,
                        }}
                        onMonthChange={dateData => {
                          setActiveMonth(dateData.dateString);
                        }}
                        disableAllTouchEventsForInactiveDays
                        disableAllTouchEventsForDisabledDays
                        hideExtraDays
                        markedDates={availableMarkedDate}
                        dayComponent={({ date }) => (
                          <TouchableOpacity
                            onPress={() => {
                              if (
                                date !== undefined &&
                                availableMarkedDate?.[date?.dateString || ''] &&
                                availableMarkedDate?.[date?.dateString || '']
                                  ?.appointments?.length
                              ) {
                                setSelectedView({
                                  date: date?.dateString,
                                  ...availableMarkedDate?.[
                                    date?.dateString || ''
                                  ],
                                });
                              }
                            }}>
                            <Box
                              height={44}
                              width={44}
                              justifyContent="center"
                              alignItems="center">
                              <Box
                                height={32}
                                width={32}
                                borderRadius={32}
                                backgroundColor={
                                  availableMarkedDate?.[date?.dateString || '']
                                    ?.appointments?.length
                                    ? 'primary'
                                    : undefined
                                }
                                justifyContent="center"
                                alignItems="center">
                                <Text
                                  color={
                                    availableMarkedDate?.[
                                      date?.dateString || ''
                                    ]?.appointments?.length
                                      ? 'background'
                                      : undefined
                                  }
                                  fontSize={16}>
                                  {date?.day}
                                </Text>
                              </Box>
                            </Box>
                          </TouchableOpacity>
                        )}
                        monthFormat={'MMM, yyyy'}
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

export default CalendarViewScreen;