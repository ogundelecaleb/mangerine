import React, { useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { showMessage } from 'react-native-flash-message';
import { Ionicons } from '@expo/vector-icons';
import { MainStack } from '../../utils/ParamList';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import Box from '../../components/Box';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Checkbox from '../../components/Checkbox';
import { signupSchema } from '../../utils/validation';
import { usePreSignupMutation } from '../../state/services/auth.service';
import { useThemeColors } from '../../hooks/useTheme';
import MLogo from '../../assets/svgs/MLogo';
import EnvelopeSVG from '../../assets/svgs/EnvelopeSVG';
import EyeSVG from '../../assets/svgs/EyeSVG';

type Props = NativeStackScreenProps<MainStack, 'Signup'>;

interface SignupForm {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupScreen = ({ navigation }: Props) => {
  const [preSignup, { isLoading }] = usePreSignupMutation();
  const [secure, setSecure] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const { foreground } = useThemeColors();

  const { control, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      const { email, password, confirmPassword, firstName, middleName, lastName } = data;

      if (!rememberMe) {
        showMessage({
          message: 'Kindly agree to our terms to proceed',
          type: 'danger',
        });
        return;
      }
      if (password !== confirmPassword) {
        showMessage({
          message: 'Passwords do not match',
          type: 'danger',
        });
        return;
      }
      if (!firstName.trim() || !lastName.trim()) {
        showMessage({
          message: 'Enter a valid full name',
          type: 'danger',
        });
        return;
      }

      const fullName = `${firstName}${middleName ? ' ' + middleName : ''} ${lastName}`;
      
      const result = await preSignup({ email }).unwrap();
      
      showMessage({
        message: 'Verification code sent to your email',
        type: 'success',
      });
      
      navigation.navigate('SignupOTP', {
        email,
        password,
        fullName,
      });
    } catch (error: any) {
      showMessage({
        message: error?.data?.message || error?.message || 'Something went wrong',
        type: 'danger',
      });
    }
  };

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
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      padding="l"
                      justifyContent="space-between">
                      <MLogo height={41} />
                      <TouchableOpacity onPress={navigation.goBack}>
                        <Text color="label">Cancel</Text>
                      </TouchableOpacity>
                    </Box>
                    <Box paddingHorizontal="l">
                      <Box
                        height={10}
                        borderRadius={10}
                        flexDirection="row"
                        alignItems="stretch"
                        style={{ backgroundColor: '#B5B9C7' }}>
                        <Box
                          backgroundColor="primary"
                          borderRadius={10}
                          width="30%"
                        />
                        <Box
                          height={20}
                          width={20}
                          borderRadius={20}
                          borderWidth={4}
                          borderColor="primary"
                          style={{
                            marginTop: -5,
                            backgroundColor: '#B5B9C7',
                            marginLeft: -10,
                          }}
                        />
                      </Box>
                    </Box>
                    <Box paddingVertical="l" paddingHorizontal="l" gap="s">
                      <Text fontSize={24} variant="semibold">
                        Sign Up
                      </Text>
                      <Text color="label" fontSize={16}>
                        Create your Mangerine account.
                      </Text>
                    </Box>
                    <Box paddingHorizontal="l">
                      <Controller
                        control={control}
                        name="firstName"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            error={errors.firstName?.message}
                            label="First Name"
                            required
                            value={value}
                            onChangeText={onChange}
                            placeholder="Enter First Name"
                            rightComponent={
                              <Box>
                                <Ionicons name="person" size={24} color={foreground} />
                              </Box>
                            }
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="middleName"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            error={errors.middleName?.message}
                            label="Middle Name"
                            value={value}
                            onChangeText={onChange}
                            placeholder="Enter Middle Name"
                            rightComponent={
                              <Box>
                                <Ionicons name="person" size={24} color={foreground} />
                              </Box>
                            }
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="lastName"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            error={errors.lastName?.message}
                            label="Last Name"
                            required
                            value={value}
                            onChangeText={onChange}
                            placeholder="Enter Last Name"
                            rightComponent={
                              <Box>
                                <Ionicons name="person" size={24} color={foreground} />
                              </Box>
                            }
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            error={errors.email?.message}
                            value={value}
                            onChangeText={onChange}
                            label="Email Address"
                            required
                            autoCapitalize="none"
                            keyboardType="email-address"
                            placeholder="johndoe@gmail.com"
                            rightComponent={
                              <Box>
                                <EnvelopeSVG />
                              </Box>
                            }
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            value={value}
                            onChangeText={onChange}
                            label="Password"
                            error={errors.password?.message}
                            secureTextEntry={secure}
                            required
                            placeholder="Enter Password"
                            rightComponent={
                              <TouchableOpacity
                                style={{
                                  height: '100%',
                                  justifyContent: 'center',
                                }}
                                onPress={() => setSecure(!secure)}>
                                <EyeSVG filled={!secure} />
                              </TouchableOpacity>
                            }
                            subtext="Password must be at least 8 characters long and include at least one uppercase letter (A - Z)."
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            value={value}
                            onChangeText={onChange}
                            label="Confirm Password"
                            error={errors.confirmPassword?.message}
                            secureTextEntry={secure2}
                            required
                            placeholder="Confirm Password"
                            rightComponent={
                              <TouchableOpacity
                                style={{
                                  height: '100%',
                                  justifyContent: 'center',
                                }}
                                onPress={() => setSecure2(!secure2)}>
                                <EyeSVG filled={!secure2} />
                              </TouchableOpacity>
                            }
                          />
                        )}
                      />
                    </Box>
                    <Box
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="center"
                      paddingHorizontal="l">
                      <Box flexDirection="row" gap="s" alignItems="center">
                        <Checkbox
                          checked={rememberMe}
                          onPress={() => setRememberMe(!rememberMe)}
                        />
                        <Text>
                          I agree to the{' '}
                          <Text color="primary">
                            Terms & Conditions
                          </Text>
                        </Text>
                      </Box>
                    </Box>
                    <Box paddingHorizontal="l" marginTop="30">
                      <Button
                        loading={isLoading}
                        displayText="Sign Up"
                        onPress={handleSubmit(onSubmit)}
                      />
                    </Box>
                    <Box
                      marginVertical="l"
                      flexDirection="row"
                      paddingHorizontal="l"
                      gap="l"
                      alignItems="center">
                      <Box flex={1} borderBottomColor="label" borderBottomWidth={1} />
                      <Text color="label" fontSize={16} variant="semibold">
                        OR
                      </Text>
                      <Box flex={1} borderBottomColor="label" borderBottomWidth={1} />
                    </Box>
                    <Box marginBottom="mxl" paddingHorizontal="l" gap="mid">
                      <Button buttonProps={{ backgroundColor: 'white' }}>
                        <Box flexDirection="row" alignItems="center" gap="s">
                          <Image
                            style={{ height: 23, width: 23 }}
                            resizeMode="contain"
                            source={require('../../assets/images/googlr-logo.png')}
                          />
                          <Text variant="semibold" color="label" fontSize={16}>
                            Login with Google
                          </Text>
                        </Box>
                      </Button>
                      <Button buttonProps={{ backgroundColor: 'white' }}>
                        <Box flexDirection="row" alignItems="center" gap="s">
                          <Ionicons name="logo-apple" color={'#000000'} size={24} />
                          <Text variant="semibold" color="label" fontSize={16}>
                            Login with Apple
                          </Text>
                        </Box>
                      </Button>
                      <Text fontSize={16} marginTop="mid">
                        Already have an account?{' '}
                        <Text
                          onPress={() => navigation.navigate('Login')}
                          fontSize={16}
                          variant="bold"
                          color="primary">
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
    </BaseScreenComponent>
  );
};

export default SignupScreen;