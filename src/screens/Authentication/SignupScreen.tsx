import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { showMessage } from 'react-native-flash-message';
import { MainStack } from '../../utils/ParamList';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import Box from '../../components/Box';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { signupSchema } from '../../utils/validation';
import { usePreSignupMutation } from '../../state/services/auth.service';

type Props = NativeStackScreenProps<MainStack, 'Signup'>;

interface SignupForm {
  fullName: string;
  email: string;
  password: string;
}

const SignupScreen = ({ navigation }: Props) => {
  const [preSignup, { isLoading }] = usePreSignupMutation();

  const { control, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      console.log('Signup form data:', data);
      console.log('Calling preSignup API with:', { email: data.email });
      
      const result = await preSignup({ email: data.email }).unwrap();
      console.log('PreSignup API response:', result);
      
      // Show success message and navigate
      showMessage({
        message: 'Verification code sent to your email',
        type: 'success',
      });
      
      navigation.navigate('SignupOTP', {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      });
    } catch (error: any) {
      console.error('Signup error details:', error);
      showMessage({
        message: error?.data?.message || error?.message || 'Something went wrong',
        type: 'danger',
      });
    }
  };

  return (
    <BaseScreenComponent>
      <Box flex={1} backgroundColor="background">
        <Box flex={1} justifyContent="center" paddingHorizontal="l" gap="l">
          {/* Header */}
          <Box alignItems="center" marginBottom="xl">
            <Text variant="bold" fontSize={28}>
              Create Account
            </Text>
            <Text variant="regular" fontSize={16} color="label" marginTop="s">
              Join the Mangerine community
            </Text>
          </Box>

          {/* Form */}
          <Box gap="m">
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.fullName?.message}
                />
              )}
            />

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
              displayText="Create Account"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
            />
          </Box>

          {/* Footer Links */}
          <Box alignItems="center" gap="m">
            <Box flexDirection="row" alignItems="center" gap="s">
              <Text variant="regular" fontSize={14} color="label">
                Already have an account?
              </Text>
              <Button
                displayText="Sign In"
                onPress={() => navigation.navigate('Login')}
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

export default SignupScreen;