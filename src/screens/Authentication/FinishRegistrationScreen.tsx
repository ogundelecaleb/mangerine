import React, { useCallback, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { showMessage } from 'react-native-flash-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { MainStack } from '../../utils/ParamList';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import Box from '../../components/Box';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import CheckBox from '../../components/Checkbox';
import { useCreateAccountMutation } from '../../state/services/auth.service';
import { useAppDispatch } from '../../state/hooks/redux';
import { setCredentials } from '../../state/reducers/user.reducer';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../utils/theme';

const schema = yup
  .object({
    businessName: yup.string().max(255),
    userType: yup.string().max(255).required('Type is required'),
    location: yup.string().required('Location is required'),
  })
  .required();

type Props = NativeStackScreenProps<MainStack, 'FinishRegistration'>;

// Mock data - in real app this would come from API
const mockUserTypes = [
  { id: '1', name: 'Individual' },
  { id: '2', name: 'Business Owner' },
  { id: '3', name: 'Freelancer' },
  { id: '4', name: 'Agency' },
];

const mockInterests = [
  { id: '1', name: 'Technology' },
  { id: '2', name: 'Marketing' },
  { id: '3', name: 'Design' },
  { id: '4', name: 'Business' },
  { id: '5', name: 'Finance' },
  { id: '6', name: 'Health' },
  { id: '7', name: 'Education' },
  { id: '8', name: 'Entertainment' },
];

const FinishRegistrationScreen = ({ navigation, route }: Props) => {
  const theme = useTheme<Theme>();
  const { email, password, fullName } = route.params;
  const dispatch = useAppDispatch();
  const [createAccount, { isLoading }] = useCreateAccountMutation();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showInterests, setShowInterests] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      businessName: '',
      location: '',
      userType: '',
    },
    resolver: yupResolver(schema),
  });
  

  const proceed = useCallback(
    async (formData: { businessName?: string; location: string; userType: string }) => {
      try {
        const { businessName, location, userType } = formData;
        
        if (!location || !userType || selectedInterests.length < 1) {
          showMessage({
            message: 'Fill all required fields to proceed',
            type: 'danger',
          });
          return;
        }

        const selectedUserType = mockUserTypes.find(t => t.name === userType);
        
        const result = await createAccount({
          email,
          fullName,
          password,
          businessName: businessName || '',
          location,
          interests: selectedInterests,
          userType: [selectedUserType?.id || '1'],
        }).unwrap();

        if (result.status === "success") {
          dispatch(setCredentials({
            user: result.data.user,
            token: result.data.token,
          }));
          navigation.navigate('SignupAvatar');
        }
      } catch (error: any) {
        showMessage({
          message: error?.data?.message || 'Something went wrong',
          type: 'danger',
        });
      }
    },
    [email, password, fullName, selectedInterests, createAccount, dispatch, navigation],
  );

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <Box flex={1} backgroundColor="background">
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              keyboardVerticalOffset={20}
              behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
              style={{ flex: 1 }}
              contentContainerStyle={{ flex: 1 }}>
              <Box flex={1}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Box onStartShouldSetResponder={() => true}>
                    {/* Header */}
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      padding="l"
                      justifyContent="space-between">
                      <Text variant="bold" fontSize={24} color="foreground_primary">
                        Mangerine
                      </Text>
                      <TouchableOpacity onPress={() => navigation.pop(2)}>
                        <Text color="label">Cancel</Text>
                      </TouchableOpacity>
                    </Box>

                    {/* Progress Bar */}
                    <Box paddingHorizontal="l">
                      <Box
                        height={10}
                        borderRadius={10}
                        flexDirection="row"
                        alignItems="stretch"
                        style={{ backgroundColor: '#B5B9C7' }}>
                        <Box
                          backgroundColor="foreground_primary"
                          borderRadius={10}
                          width="50%"
                        />
                        <Box
                          height={20}
                          width={20}
                          borderRadius={20}
                          borderWidth={4}
                          borderColor="foreground_primary"
                          style={{
                            marginTop: -5,
                            backgroundColor: '#B5B9C7',
                            marginLeft: -10,
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Title */}
                    <Box paddingVertical="l" paddingHorizontal="l" gap="s">
                      <Text fontSize={24} variant="semibold">
                        Sign Up
                      </Text>
                      <Text color="label" fontSize={16}>
                        Finish your registration.
                      </Text>
                    </Box>

                    {/* Form */}
                    <Box paddingHorizontal="l">
                      {/* Business Name */}
                      <Box>
                        <Controller
                          control={control}
                          name="businessName"
                          render={({ field: { onChange, value } }) => (
                            <Input
                              value={value}
                              onChangeText={onChange}
                              label="Business Name"
                              placeholder="Input business name"
                              error={errors?.businessName?.message}
                              rightComponent={
                                <MaterialCommunityIcons
                                  name="account"
                                  size={24}
                                  color={theme.colors.foreground}
                                />
                              }
                            />
                          )}
                        />
                      </Box>

                      {/* Interests */}
                      <Box marginBottom="m">
                        <Text fontSize={12} color="label" marginBottom="s">
                          Area of interests *
                        </Text>
                        <TouchableOpacity
                          onPress={() => setShowInterests(true)}>
                          <Box
                            borderWidth={1}
                            borderRadius={8}
                            borderColor="border"
                            height={50}
                            backgroundColor="background"
                            flexDirection="row"
                            justifyContent="space-between"
                            paddingHorizontal="m"
                            alignItems="center">
                            <Text variant="medium" numberOfLines={1}>
                              {selectedInterests
                                .map(
                                  x => mockInterests.find(xx => xx.id === x)?.name || x,
                                )
                                ?.join(', ') || 'Select Interests'}
                            </Text>
                            <MaterialCommunityIcons
                              name="chevron-down"
                              size={20}
                              color={theme.colors.foreground}
                            />
                          </Box>
                        </TouchableOpacity>
                      </Box>

                      {/* User Type */}
                      <Box>
                        <Controller
                          control={control}
                          name="userType"
                          render={({ field: { onChange, value } }) => (
                            <Select
                              error={errors?.userType?.message}
                              required
                              value={value}
                              onSelect={onChange}
                              label="Who are you?"
                              data={mockUserTypes.map(x => ({
                                title: x.name,
                                value: x.name,
                              }))}
                            />
                          )}
                        />
                      </Box>

                      {/* Location */}
                      <Box>
                        <Controller
                          control={control}
                          name="location"
                          render={({ field: { onChange, value } }) => (
                            <Input
                              required
                              value={value}
                              onChangeText={onChange}
                              label="Location"
                              placeholder="Input Location"
                              error={errors?.location?.message}
                            />
                          )}
                        />
                      </Box>
                    </Box>

                    {/* Submit Button */}
                    <Box paddingHorizontal="l" marginTop="xl">
                      <Button
                        loading={isLoading}
                        displayText="Sign Up"
                        onPress={handleSubmit(proceed)}
                      />
                    </Box>

                    {/* Divider */}
                    <Box
                      marginVertical="l"
                      flexDirection="row"
                      paddingHorizontal="l"
                      gap="l"
                      alignItems="center">
                      <Box
                        flex={1}
                        borderBottomColor="label"
                        borderBottomWidth={1}
                      />
                      <Text color="label" fontSize={16} variant="semibold">
                        OR
                      </Text>
                      <Box
                        flex={1}
                        borderBottomColor="label"
                        borderBottomWidth={1}
                      />
                    </Box>

                    {/* Login Link */}
                    <Box marginBottom="xl" paddingHorizontal="l">
                      <Text fontSize={16}>
                        Already have an account?{' '}
                        <Text
                          onPress={() => navigation.navigate('Login')}
                          fontSize={16}
                          variant="bold"
                          color="foreground_primary">
                          Login
                        </Text>
                      </Text>
                    </Box>
                  </Box>
                </ScrollView>
              </Box>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Box>
      </TouchableWithoutFeedback>

      {/* Interests Modal */}
      {showInterests && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            paddingHorizontal: 16,
          }}>
          <Box
            backgroundColor="background"
            borderRadius={12}
            padding="l"
            maxHeight={400}>
            <Box
              marginBottom="l"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between">
              <Text variant="semibold" fontSize={20}>
                Select Interests
              </Text>
              <TouchableOpacity onPress={() => setShowInterests(false)}>
                <MaterialCommunityIcons
                  name="close-circle-outline"
                  size={20}
                  color={theme.colors.foreground}
                />
              </TouchableOpacity>
            </Box>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <Box gap="m" paddingBottom="l">
                {mockInterests.map(interest => (
                  <TouchableOpacity
                    key={interest.id}
                    onPress={() => {
                      const selected = selectedInterests.includes(interest.id);
                      if (selected) {
                        setSelectedInterests(prev => prev.filter(x => x !== interest.id));
                      } else {
                        setSelectedInterests(prev => [...prev, interest.id]);
                      }
                    }}>
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      gap="m">
                      <Box flex={1}>
                        <Text variant="semibold">{interest.name}</Text>
                      </Box>
                      <CheckBox
                        size={20}
                        checked={selectedInterests.includes(interest.id)}
                        onPress={() => {
                          const selected = selectedInterests.includes(interest.id);
                          if (selected) {
                            setSelectedInterests(prev => prev.filter(x => x !== interest.id));
                          } else {
                            setSelectedInterests(prev => [...prev, interest.id]);
                          }
                        }}
                      />
                    </Box>
                  </TouchableOpacity>
                ))}
              </Box>
            </ScrollView>
            
            <Button
              displayText="Done"
              onPress={() => setShowInterests(false)}
            />
          </Box>
        </View>
      )}
    </BaseScreenComponent>
  );
};

export default FinishRegistrationScreen;