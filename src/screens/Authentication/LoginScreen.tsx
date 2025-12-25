import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert } from 'react-native';
import { MainStack } from '../../utils/ParamList';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import Box from '../../components/Box';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { loginSchema } from '../../utils/validation';
import { useLoginMutation } from '../../state/services/auth.service';
import { useAppDispatch } from '../../state/hooks/redux';
import { setCredentials } from '../../state/reducers/authSlice';

type Props = NativeStackScreenProps<MainStack, 'Login'>;

interface LoginForm {
  email: string;
  password: string;
}

const LoginScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await login({
        username: data.email,
        password: data.password,
      }).unwrap();

      if (result.success) {
        dispatch(setCredentials({
          user: result.data.user,
          token: result.data.token,
        }));
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error?.data?.message || 'Something went wrong');
    }
  };

  return (
    <BaseScreenComponent>
      <Box flex={1} backgroundColor="background">
        <Box flex={1} justifyContent="center" paddingHorizontal="l" gap="l">
          {/* Header */}
          <Box alignItems="center" marginBottom="xl">
            <Text variant="bold" fontSize={28}>
              Welcome Back
            </Text>
            <Text variant="regular" fontSize={16} color="label" marginTop="s">
              Sign in to continue
            </Text>
          </Box>

          {/* Form */}
          <Box gap="m">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry
                />
              )}
            />

            <Button
              displayText="Sign In"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
            />
          </Box>

          {/* Footer Links */}
          <Box alignItems="center" gap="m">
            <Button
              displayText="Forgot Password?"
              onPress={() => navigation.navigate('ForgotPassword')}
              buttonProps={{ backgroundColor: 'transparent' }}
              textProps={{ color: 'primary', fontSize: 14 }}
            />
            
            <Box flexDirection="row" alignItems="center" gap="s">
              <Text variant="regular" fontSize={14} color="label">
                Don't have an account?
              </Text>
              <Button
                displayText="Sign Up"
                onPress={() => navigation.navigate('Signup')}
                buttonProps={{ backgroundColor: 'transparent' }}
                textProps={{ color: 'primary', fontSize: 14 }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </BaseScreenComponent>
  );
};

export default LoginScreen;