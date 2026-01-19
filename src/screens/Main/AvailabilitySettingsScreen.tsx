import { ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import Box from '../../components/Box';
import Text from '../../components/Text';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import Select from '../../components/Select';
import Button from '../../components/Button';
import { MainStack, ErrorData } from '../../utils/ParamList';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../utils/theme';
import { setAuthTrigger } from '../../state/reducers/user.reducer';
import { useCreateAvailabilityMutation, useGetCurrentAvailabilitySettingsMutation } from '../../state/services/availability.service';
import { addAlpha } from '../../utils/helpers';

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const time = moment().hour(hour).minute(min);
      times.push({
        title: time.format('hh:mm A'),
        value: time.format('HH:mm'),
      });
    }
  }
  return times;
};

const TimePickerModal = ({ visible, onClose, onSelect, title }: any) => {
  const theme = useTheme<Theme>();
  const times = generateTimeOptions();
  
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Box flex={1} backgroundColor="transparent" justifyContent="flex-end">
        <TouchableOpacity 
          style={{ flex: 1 }} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <Box 
          backgroundColor="background" 
          borderTopLeftRadius={20} 
          borderTopRightRadius={20}
          maxHeight={400}>
          <Box 
            padding="m" 
            borderBottomWidth={1} 
            borderBottomColor="border"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center">
            <Text variant="semibold" fontSize={16}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color={theme.colors.foreground} />
            </TouchableOpacity>
          </Box>
          <ScrollView showsVerticalScrollIndicator={false}>
            {times.map((time) => (
              <TouchableOpacity
                key={time.value}
                onPress={() => {
                  onSelect(time.value);
                  onClose();
                }}>
                <Box 
                  padding="m" 
                  borderBottomWidth={1} 
                  borderBottomColor="faded_border">
                  <Text>{time.title}</Text>
                </Box>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Box>
      </Box>
    </Modal>
  );
};

const AvailabilityAccordion = ({
  day,
  active,
  toggleDay,
  addSlot,
  removeSlot,
  slots,
  onEditSlot,
}: any) => {
  const theme = useTheme<Theme>();
  
  return (
    <Box
      marginVertical="s"
      borderWidth={1}
      borderColor={active ? 'primary' : 'border'}
      borderRadius={8}
      overflow="hidden"
      style={{
        backgroundColor: active ? addAlpha(theme.colors.primary, 0.02) : 'transparent',
      }}>
      <TouchableOpacity onPress={toggleDay}>
        <Box
          padding="m"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Box flexDirection="row" alignItems="center" gap="s">
            <Box
              width={20}
              height={20}
              borderRadius={10}
              borderWidth={2}
              borderColor={active ? 'primary' : 'border'}
              justifyContent="center"
              alignItems="center"
              style={{
                backgroundColor: active ? theme.colors.primary : 'transparent',
              }}>
              {active && (
                <MaterialCommunityIcons name="check" size={12} color="#FFF" />
              )}
            </Box>
            <Text variant="medium" fontSize={16}>{day}</Text>
          </Box>
          <MaterialCommunityIcons
            name={active ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.colors.foreground}
          />
        </Box>
      </TouchableOpacity>
      {active && (
        <Box paddingHorizontal="m" paddingBottom="m">
          <Box gap="s">
            {slots?.map((slot: any, index: number) => (
              <Box
                key={index}
                flexDirection="row"
                alignItems="center"
                gap="s"
                padding="s"
                borderRadius={6}
                backgroundColor="faded_border">
                <TouchableOpacity 
                  style={{ flex: 1 }}
                  onPress={() => onEditSlot(index, 'from')}>
                  <Box 
                    padding="s" 
                    borderRadius={4}
                    backgroundColor="background">
                    <Text fontSize={14}>{moment(slot.from, 'HH:mm').format('hh:mm A')}</Text>
                  </Box>
                </TouchableOpacity>
                <MaterialCommunityIcons name="arrow-right" size={16} color={theme.colors.label} />
                <TouchableOpacity 
                  style={{ flex: 1 }}
                  onPress={() => onEditSlot(index, 'to')}>
                  <Box 
                    padding="s" 
                    borderRadius={4}
                    backgroundColor="background">
                    <Text fontSize={14}>{moment(slot.to, 'HH:mm').format('hh:mm A')}</Text>
                  </Box>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeSlot(index)}>
                  <Box
                    width={32}
                    height={32}
                    borderRadius={16}
                    backgroundColor="faded_danger"
                    justifyContent="center"
                    alignItems="center">
                    <MaterialCommunityIcons 
                      name="delete-outline" 
                      size={16} 
                      color={theme.colors.danger} 
                    />
                  </Box>
                </TouchableOpacity>
              </Box>
            ))}
          </Box>
          <Box marginTop="m">
            <TouchableOpacity onPress={addSlot}>
              <Box
                padding="m"
                borderRadius={6}
                borderWidth={1}
                borderColor="primary"
                borderStyle="dashed"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                gap="s">
                <MaterialCommunityIcons name="plus" size={20} color={theme.colors.primary} />
                <Text color="primary" variant="medium">Add Time Slot</Text>
              </Box>
            </TouchableOpacity>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const AvailabilitySettingsScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'AvailabilitySettings'>) => {
  const theme = useTheme<Theme>();
  const [timezone, setTimezone] = useState('');
  const [preferredDur, setPreferredDur] = useState('60');
  const [createAvailabil, { isLoading }] = useCreateAvailabilityMutation();
  const [getCurrentSettings, { isLoading: loadingSettings }] = useGetCurrentAvailabilitySettingsMutation();
  const dispatch = useDispatch();
  const [timeSlots, setTimeSlots] = useState<
    {
      day: string;
      enabled: boolean;
      slots: { from: string; to: string }[];
    }[]
  >([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingSlot, setEditingSlot] = useState<{
    day: string;
    index: number;
    field: 'from' | 'to';
  } | null>(null);

  const loadCurrentSettings = useCallback(async () => {
    try {
      const response = await getCurrentSettings({});
      if (response?.data?.data) {
        const { timezone: tz, availability } = response.data.data;
        setTimezone(tz || 'gmt');
        
        const formattedSlots = availability?.map((av: any) => ({
          day: av.day,
          enabled: av.enabled,
          slots: av.slots?.map((s: any) => ({
            from: moment(s.from[0], 'hh:mm A').format('HH:mm'),
            to: moment(s.to[0], 'hh:mm A').format('HH:mm'),
          })) || [],
        })) || [];
        
        setTimeSlots(formattedSlots);
        if (availability?.[0]?.duration?.[0]) {
          setPreferredDur(availability[0].duration[0]);
        }
      }
    } catch (error) {
      console.log('Error loading current settings:', error);
    }
  }, [getCurrentSettings]);

  useEffect(() => {
    loadCurrentSettings();
  }, [loadCurrentSettings]);

  const sortedDates = useMemo(
    () =>
      days.map(d => {
        const dates = [];
        for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
          const targetMonth = moment().add(monthOffset, 'month');
          const daysInMonth = targetMonth.daysInMonth();

          for (let i = 1; i <= daysInMonth; i++) {
            const date = moment(
              targetMonth.format('YYYY-MM-') + String(i).padStart(2, '0'),
            );
            if (date.format('dddd').toLowerCase() === d.toLowerCase()) {
              dates.push({
                dayString: date.format('dddd'),
                date: date.format('YYYY-MM-DD'),
              });
            }
          }
        }

        return {
          day: d,
          dates: dates,
        };
      }),
    [],
  );

  const preparedDates = useMemo(() => {
    const datesWithSlots = timeSlots
      .filter(x => x.enabled)
      .map(x => {
        const foundDay = sortedDates.find(
          xx => xx.day.toLowerCase() === x.day.toLowerCase(),
        );

        return foundDay?.dates?.map(sx => ({
          date: sx.date,
          timeslots: x?.slots?.map(xp => ({
            startTime: moment(xp.from, 'HH:mm').format('HH:mm'),
            endTime: moment(xp.to, 'HH:mm').format('HH:mm'),
            duration: Number(preferredDur),
            isAvailable: true,
          })),
        }));
      })
      ?.flat()
      ?.filter(x => {
        const isValid =
          x !== undefined && moment(x?.date).valueOf() > moment().valueOf();
        return isValid;
      });

    return datesWithSlots;
  }, [preferredDur, sortedDates, timeSlots]);

  const addSlot = useCallback(
    (day: string) => {
      const freshSlots = [...timeSlots];
      const slotDayExists = freshSlots.findIndex(t => t.day === day);
      
      const lastSlot = slotDayExists > -1 
        ? freshSlots[slotDayExists].slots[freshSlots[slotDayExists].slots.length - 1]
        : null;
      
      const startTime = lastSlot 
        ? moment(lastSlot.to, 'HH:mm').add(30, 'minutes').format('HH:mm')
        : '09:00';
      
      const endTime = moment(startTime, 'HH:mm')
        .add(Number(preferredDur), 'minutes')
        .format('HH:mm');
      
      if (slotDayExists > -1) {
        freshSlots[slotDayExists].slots.push({ from: startTime, to: endTime });
        freshSlots[slotDayExists].enabled = true;
      } else {
        freshSlots.push({
          day,
          enabled: true,
          slots: [{ from: startTime, to: endTime }],
        });
      }
      setTimeSlots(freshSlots);
    },
    [timeSlots, preferredDur],
  );

  const removeSlot = useCallback(
    (day: string, index: number) => {
      const freshSlots = [...timeSlots];
      const slotDayExists = freshSlots.findIndex(t => t.day === day);
      if (slotDayExists > -1) {
        freshSlots[slotDayExists].slots = freshSlots[slotDayExists].slots.filter(
          (_, ind) => ind !== index
        );
        if (freshSlots[slotDayExists].slots.length === 0) {
          freshSlots[slotDayExists].enabled = false;
        }
        setTimeSlots(freshSlots);
      }
    },
    [timeSlots],
  );

  const updateSlot = useCallback(
    (day: string, index: number, field: 'from' | 'to', time: string) => {
      const freshSlots = [...timeSlots];
      const slotDayExists = freshSlots.findIndex(t => t.day === day);
      if (slotDayExists > -1 && freshSlots[slotDayExists].slots[index]) {
        freshSlots[slotDayExists].slots[index][field] = time;
        setTimeSlots(freshSlots);
      }
    },
    [timeSlots],
  );

  const handleEditSlot = useCallback((day: string, index: number, field: 'from' | 'to') => {
    setEditingSlot({ day, index, field });
    setShowTimePicker(true);
  }, []);

  const handleTimeSelect = useCallback((time: string) => {
    if (editingSlot) {
      updateSlot(editingSlot.day, editingSlot.index, editingSlot.field, time);
      setEditingSlot(null);
    }
  }, [editingSlot, updateSlot]);

  const toggleDay = useCallback(
    (day: string) => {
      const freshSlots = [...timeSlots];
      const existingIndex = freshSlots.findIndex(x => x.day === day);
      if (existingIndex > -1) {
        freshSlots[existingIndex].enabled = !freshSlots[existingIndex].enabled;
        setTimeSlots(freshSlots);
      } else {
        addSlot(day);
      }
    },
    [timeSlots, addSlot],
  );

  const newAvailability = useCallback(async () => {
    try {
      const avObj = {
        timezone,
        availability_settings: timeSlots.map(slot => ({
          day: slot.day,
          enabled: slot.enabled,
          slots: slot.slots.map(s => ({
            from: [moment(s.from, 'HH:mm').format('hh:mm A')],
            to: [moment(s.to, 'HH:mm').format('hh:mm A')],
          })),
          duration: [preferredDur],
        })),
        availabilities: preparedDates,
      };

      if (!preparedDates.length) {
        showMessage({
          message: 'Please add at least one time slot',
          type: 'warning',
        });
        return;
      }
      const response = await createAvailabil({
        body: avObj as any,
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
      showMessage({
        message:
          "Availability generation has been queued successfully. You will receive a notification when it's complete",
        type: 'success',
      });
      dispatch(
        setAuthTrigger({
          trigger: true,
        }),
      );
    } catch (error) {
      console.log('Error creating availability:', error);
    }
  }, [createAvailabil, dispatch, preparedDates, timezone, timeSlots, preferredDur]);

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
                  Availability
                </Text>
              </Box>
              <TouchableOpacity
                onPress={() => navigation.navigate('AllAvailability')}
                style={{ padding: 8, paddingRight: 0 }}>
                <MaterialCommunityIcons
                  name="calendar-month"
                  size={24}
                  color={theme.colors.foreground}
                />
              </TouchableOpacity>
            </Box>
            <Box flex={1}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Box paddingVertical="m" paddingHorizontal="l">
                  {loadingSettings && (
                    <Box alignItems="center" marginBottom="m">
                      <Text fontSize={12} textAlign="center">
                        Loading current availability settings...
                      </Text>
                    </Box>
                  )}
                  <Box marginBottom="l">
                    <Text textAlign="center" color="label">
                      Please update your availability for consultation
                    </Text>
                  </Box>
                  <Box flexDirection="row" marginBottom="m" gap="m">
                    <Box>
                      <Text fontSize={16} variant="medium">
                        Time Zone
                      </Text>
                      <Text color="label">Set your time zone</Text>
                    </Box>
                    <Box flex={1}>
                      <Select
                        borderColor="border"
                        defaultValue={timezone}
                        data={[
                          {
                            title: 'PST (Pacific Standard Time)',
                            value: 'pst',
                          },
                          {
                            title: 'GMT (Greenwich Mean Time)',
                            value: 'gmt',
                          },
                          {
                            title: 'EST (Eastern Standard Time)',
                            value: 'est',
                          },
                        ]}
                        value={timezone}
                        onSelect={v => setTimezone(v)}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Text variant="medium" marginBottom="s" fontSize={16}>
                      Preferred Appointment Duration
                    </Text>
                    <Select
                      borderColor="border"
                      defaultValue={preferredDur}
                      data={[
                        {
                          title: '15 Mins',
                          value: '15',
                        },
                        {
                          title: '30 Mins',
                          value: '30',
                        },
                        {
                          title: '60 Mins',
                          value: '60',
                        },
                        {
                          title: 'Custom',
                          value: 'Custom',
                        },
                      ]}
                      value={preferredDur}
                      onSelect={v => setPreferredDur(v)}
                    />
                  </Box>
                  <Box marginTop="l">
                    {days?.map(d => (
                      <AvailabilityAccordion
                        key={d}
                        day={d}
                        active={timeSlots.find(x => x.day === d)?.enabled}
                        toggleDay={() => toggleDay(d)}
                        addSlot={() => addSlot(d)}
                        onEditSlot={(index: number, field: 'from' | 'to') => 
                          handleEditSlot(d, index, field)
                        }
                        removeSlot={(index: number) => removeSlot(d, index)}
                        slots={timeSlots.find(x => x.day === d)?.slots}
                      />
                    ))}
                  </Box>
                </Box>
              </ScrollView>
            </Box>
            <Box gap="l" paddingHorizontal="l" paddingTop="l">
              <Box>
                <Button
                  displayText="Save"
                  loading={isLoading}
                  onPress={newAvailability}
                />
              </Box>
              <Box>
                <Button
                  variant="outline"
                  displayText="Cancel"
                  onPress={navigation.goBack}
                />
              </Box>
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
      
      <TimePickerModal
        visible={showTimePicker}
        onClose={() => {
          setShowTimePicker(false);
          setEditingSlot(null);
        }}
        onSelect={handleTimeSelect}
        title={editingSlot ? `Select ${editingSlot.field === 'from' ? 'Start' : 'End'} Time` : 'Select Time'}
      />
    </BaseScreenComponent>
  );
};

export default AvailabilitySettingsScreen;
