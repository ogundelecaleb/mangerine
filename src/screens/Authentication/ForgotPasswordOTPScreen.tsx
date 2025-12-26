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
import { otpSchema } from '../../utils/validation';
import { useVerifyEmailOTPMutation, useForgotPasswordMutation } from '../../state/services/auth.service';

type Props = NativeStackScreenProps<MainStack, 'ForgotPasswordOTP'>;

interface OTPForm {
  otpCode: string;
}

const ForgotPasswordOTPScreen = ({ navigation, route }: Props) => {
  const { email } = route.params;
  const [verifyOTP, { isLoading }] = useVerifyEmailOTPMutation();
  const [resendCode, { isLoading: isResending }] = useForgotPasswordMutation();

  const { control, handleSubmit, formState: { errors } } = useForm<OTPForm>({
    resolver: yupResolver(otpSchema),
    defaultValues: {
      otpCode: '',
    },
  });

  const onSubmit = async (data: OTPForm) => {
    try {
      const response = await verifyOTP({
        otpCode: data.otpCode,
        email,
      });

      if (response?.error) {
        const err = response as any;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Invalid OTP code',
          type: 'danger',
        });
        return;
      }
      
      const result = (response as any)?.data;
      if (result?.success) {
        showMessage({
          message: 'Code verified successfully',
          type: 'success',
        });
        navigation.navigate('ResetPassword', { email });
      }
    } catch (error: any) {
      showMessage({
        message: error?.data?.message || 'Invalid OTP code',
        type: 'danger',
      });
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await resendCode({ email });
      
      if (response?.error) {
        const err = response as any;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Failed to resend code',
          type: 'danger',
        });
        return;
      }
      
      showMessage({
        message: 'Reset code has been resent to your email',
        type: 'success',
      });
    } catch (error: any) {
      showMessage({
        message: error?.data?.message || 'Failed to resend code',
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
              Enter Reset Code
            </Text>
            <Text variant="regular" fontSize={16} color="label" marginTop="s" textAlign="center">
              We've sent a 6-digit code to {email}
            </Text>
          </Box>

          {/* Form */}
          <Box gap="m">
            <Controller
              control={control}
              name="otpCode"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Reset Code"
                  placeholder="Enter 6-digit code"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.otpCode?.message}
                  keyboardType="numeric"
                  maxLength={6}
                />
              )}
            />

            <Button
              displayText="Verify Code"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
            />
          </Box>

          {/* Footer Links */}
          <Box alignItems="center" gap="m">
            <Text variant="regular" fontSize={14} color="label" textAlign="center">
              Didn't receive the code?
            </Text>
            
            <Button
              displayText="Resend Code"
              onPress={handleResendCode}
              loading={isResending}
              buttonProps={{ backgroundColor: 'transparent' }}
              textProps={{ color: 'primary', fontSize: 14 }}
            />
            
            <Button
              displayText="Back to Login"
              onPress={() => navigation.navigate('Login')}
              buttonProps={{ backgroundColor: 'transparent' }}
              textProps={{ color: 'label', fontSize: 14 }}
            />
          </Box>
        </Box>
      </Box>
    </BaseScreenComponent>
  );
};

export default ForgotPasswordOTPScreen;