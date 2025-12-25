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
import { resetPasswordSchema } from '../../utils/validation';
import { useChangePasswordMutation } from '../../state/services/auth.service';

type Props = NativeStackScreenProps<MainStack, 'ResetPassword'>;

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const ResetPasswordScreen = ({ navigation, route }: Props) => {
  const { email } = route.params;
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const { control, handleSubmit, formState: { errors } } = useForm<ResetPasswordForm>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      const result = await changePassword({
        email,
        password: data.password,
      }).unwrap();

      if (result.success) {
        Alert.alert(
          'Success',
          'Your password has been reset successfully',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <BaseScreenComponent>
      <Box flex={1} backgroundColor="background">
        <Box flex={1} justifyContent="center" paddingHorizontal="l" gap="l">
          {/* Header */}
          <Box alignItems="center" marginBottom="xl">
            <Text variant="bold" fontSize={28}>
              Reset Password
            </Text>
            <Text variant="regular" fontSize={16} color="label" marginTop="s" textAlign="center">
              Enter your new password
            </Text>
          </Box>

          {/* Form */}
          <Box gap="m">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="New Password"
                  placeholder="Enter new password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirm Password"
                  placeholder="Confirm new password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  secureTextEntry
                />
              )}
            />

            <Button
              displayText="Reset Password"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
            />
          </Box>

          {/* Footer Links */}
          <Box alignItems="center">
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

export default ResetPasswordScreen;