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
import { loginSchema } from '../../utils/validation';
import { useLoginMutation } from '../../state/services/auth.service';
import { useAppDispatch } from '../../state/hooks/redux';
import { setCredentials } from '../../state/reducers/user.reducer';
import { setAuthBlocked } from '@/state/reducers/user.reducer';
import MLogo from '../../assets/svgs/MLogo';
import EnvelopeSVG from '../../assets/svgs/EnvelopeSVG';
import EyeSVG from '../../assets/svgs/EyeSVG';

type Props = NativeStackScreenProps<MainStack, 'Login'>;

interface LoginForm {
  email: string;
  password: string;
}

const LoginScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [secure, setSecure] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await login({
        username: data.email,
        password: data.password,
      });

      if (response?.error) {
        const err = response as any;
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
        setAuthBlocked({
          value: false,
        }),
      );

      const result = (response as any)?.data;

      dispatch(
        setCredentials({
          user: result.data.user,
          token: result.data.token,
        }),
      );
    } catch (error: any) {
      showMessage({
        message: error?.data?.message || 'Something went wrong',
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
                    <Box flexDirection="row" alignItems="center" padding="l">
                      <MLogo height={41} />
                    </Box>
                    <Box paddingVertical="l" paddingHorizontal="l" gap="s">
                      <Text fontSize={24} variant="semibold">
                        Welcome Back!
                      </Text>
                      <Text color="label" fontSize={16}>
                        Login to your account to continue
                      </Text>
                    </Box>
                    <Box paddingHorizontal="l">
                      <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            label="Email Address"
                            required
                            autoCapitalize="none"
                            error={errors.email?.message}
                            placeholder="johndoe@gmail.com"
                            rightComponent={
                              <Box>
                                <EnvelopeSVG />
                              </Box>
                            }
                            value={value}
                            onChangeText={onChange}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            label="Password"
                            secureTextEntry={secure}
                            required
                            placeholder="123!gv2"
                            error={errors.password?.message}
                            rightComponent={
                              <TouchableOpacity onPress={() => setSecure(!secure)}>
                                <EyeSVG filled={secure} />
                              </TouchableOpacity>
                            }
                            value={value}
                            onChangeText={onChange}
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
                        <Text>Remember me</Text>
                      </Box>
                      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text>Forget Password?</Text>
                      </TouchableOpacity>
                    </Box>
                    <Box paddingHorizontal="l" marginTop="30">
                      <Button
                        loading={isLoading}
                        displayText="Login"
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
                        Don't have an account?{' '}
                        <Text
                          fontSize={16}
                          variant="bold"
                          color="primary"
                          onPress={() => navigation.navigate('Signup')}>
                          Sign Up
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

export default LoginScreen;
