import React, { useCallback, useState } from 'react';
import { Keyboard, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { showMessage } from 'react-native-flash-message';
import * as yup from 'yup';
import YupPassword from 'yup-password';
import { MainStack } from '../../utils/ParamList';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import Box from '../../components/Box';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useChangePasswordMutation } from '../../state/services/auth.service';
import MLogo from '../../assets/svgs/MLogo';
import EyeSVG from '../../assets/svgs/EyeSVG';

YupPassword(yup);

const schema = yup
  .object({
    password: yup
      .string()
      .password()
      .min(8, 'Password must be at least 8 characters long')
      .minUppercase(1, 'Password must have at least one uppercase character')
      .minNumbers(0, 'No numbers')
      .minSymbols(0, 'No symbols')
      .minLowercase(0, 'No lowercase')
      .required('required'),
    confirmPassword: yup
      .string()
      .password()
      .min(8, 'Password must be at least 8 characters long')
      .minUppercase(1, 'Password must have at least one uppercase character')
      .minNumbers(0, 'No numbers')
      .minSymbols(0, 'No symbols')
      .minLowercase(0, 'No lowercase')
      .required('required'),
  })
  .required();

type Props = NativeStackScreenProps<MainStack, 'ResetPassword'>;

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const ResetPasswordScreen = ({ navigation, route }: Props) => {
  const [secure, setSecure] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [changepass, { isLoading }] = useChangePasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(schema),
  });

  const proceed = useCallback(
    async (cred: { [key: string]: string }) => {
      try {
        const { password, confirmPassword } = cred;
        const { email } = route.params;
        if (password !== confirmPassword) {
          showMessage({
            message: 'Passwords do not match',
            type: 'danger',
          });
          return;
        }
        const response = await changepass({
          email,
          password,
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
        
        showMessage({
          message: 'Password reset successfully!',
          type: 'success',
        });
        
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1000);
      } catch (error) {
        console.log('reset password error:', error);
      }
    },
    [route.params, changepass, navigation],
  );

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <Box flex={1} backgroundColor="background">
          <SafeAreaView style={{ flex: 1 }}>
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
                  <Box paddingVertical="l" paddingHorizontal="l" gap="s">
                    <Text fontSize={24} variant="semibold">
                      Reset Password
                    </Text>
                    <Text color="label" fontSize={16}>
                      Set a new password below
                    </Text>
                  </Box>
                  <Box paddingHorizontal="l">
                    <Controller
                      control={control}
                      name="password"
                      render={({ field: { onChange, value } }) => (
                        <Input
                          label="New Password"
                          secureTextEntry={secure}
                          error={errors.password?.message}
                          required
                          value={value}
                          onChangeText={onChange}
                          subtext="Use 8 or more characters with a mix of letters numbers and symbols."
                          placeholder="123!gv2"
                          rightComponent={
                            <TouchableOpacity onPress={() => setSecure(!secure)}>
                              <EyeSVG filled={!secure} />
                            </TouchableOpacity>
                          }
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="confirmPassword"
                      render={({ field: { onChange, value } }) => (
                        <Input
                          error={errors.confirmPassword?.message}
                          label="Confirm Password"
                          secureTextEntry={secure2}
                          required
                          value={value}
                          onChangeText={onChange}
                          placeholder="123!gv2"
                          rightComponent={
                            <TouchableOpacity onPress={() => setSecure2(!secure2)}>
                              <EyeSVG filled={!secure2} />
                            </TouchableOpacity>
                          }
                        />
                      )}
                    />
                  </Box>
                  <Box paddingHorizontal="l" marginTop="l">
                    <Button
                      loading={isLoading}
                      displayText="Reset Password"
                      onPress={handleSubmit(proceed)}
                    />
                  </Box>
                </Box>
              </ScrollView>
            </Box>
          </SafeAreaView>
        </Box>
      </TouchableWithoutFeedback>
    </BaseScreenComponent>
  );
};

export default ResetPasswordScreen;