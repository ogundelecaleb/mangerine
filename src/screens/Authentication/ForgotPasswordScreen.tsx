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
import { forgotPasswordSchema } from '../../utils/validation';
import { useForgotPasswordMutation } from '../../state/services/auth.service';

type Props = NativeStackScreenProps<MainStack, 'ForgotPassword'>;

interface ForgotPasswordForm {
  email: string;
}

const ForgotPasswordScreen = ({ navigation }: Props) => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      const response = await forgotPassword({ email: data.email });
      
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
      
      const result = (response as any)?.data;
      if (result?.success) {
        showMessage({
          message: 'Reset code sent to your email',
          type: 'success',
        });
        navigation.navigate('ForgotPasswordOTP', {
          email: data.email,
          otpHash: result.data?.otpHash,
        });
      }
    } catch (error: any) {
      showMessage({
        message: error?.data?.message || 'Something went wrong',
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
              Forgot Password
            </Text>
            <Text variant="regular" fontSize={16} color="label" marginTop="s" textAlign="center">
              Enter your email address and we'll send you a code to reset your password
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

            <Button
              displayText="Send Reset Code"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
            />
          </Box>

          {/* Footer Links */}
          <Box alignItems="center" gap="m">
            <Button
              displayText="Back to Login"
              onPress={() => navigation.navigate('Login')}
              buttonProps={{ backgroundColor: 'transparent' }}
              textProps={{ color: 'primary', fontSize: 14 }}
            />
          </Box>
        </Box>
      </Box>
    </BaseScreenComponent>
  );
};

export default ForgotPasswordScreen;