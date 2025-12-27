import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Keyboard, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { showMessage } from 'react-native-flash-message';
import { MainStack } from '../../utils/ParamList';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import Box from '../../components/Box';
import Text from '../../components/Text';
import Button from '../../components/Button';
import { usePreSignupMutation, useVerifyEmailOTPMutation } from '../../state/services/auth.service';
import { useThemeColors } from '../../hooks/useTheme';
import { getFormattedTime } from '../../utils/helpers';
import useCountDown from '../../hooks/useCountDown';
import MLogo from '../../assets/svgs/MLogo';

const initialTime = 4 * 60 * 1000;
const interval = 1000;

type Props = NativeStackScreenProps<MainStack, 'SignupOTP'>;

interface OTPForm {
  otpCode: string;
}

const SignupOTPScreen = ({ navigation, route }: Props) => {
  const [timeLeft, { start, reset }] = useCountDown(initialTime, interval);
  const [code, setCode] = useState('');
  const { primary, border, text } = useThemeColors();
  const [presignup, { isLoading: resendLoading }] = usePreSignupMutation();
  const [verify, { isLoading }] = useVerifyEmailOTPMutation();

  const resend = useCallback(async () => {
    try {
      const { email } = route.params;
      const response = await presignup({ body: { email } });
      
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
      reset();
      start();
    } catch (error) {
      console.log('resend error:', error);
    }
  }, [presignup, route, reset, start]);

  const verifyCode = useCallback(async () => {
    try {
      if (code.length < 6) {
        return;
      }
      const { email, fullName, password } = route.params;
      const verifyresponse = await verify({
        email,
        otpCode: code,
      });
      
      if (verifyresponse?.error) {
        const err = verifyresponse as any;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
      navigation.navigate('FinishRegistration', {
        email,
        password,
        fullName,
      });
    } catch (error) {
      console.log('verifyCode error:', error);
    }
  }, [code, navigation, route.params, verify]);

  useEffect(() => {
    start();
  }, []);

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
                      Email Verification
                    </Text>
                    <Text color="label" fontSize={16}>
                      Input the code sent to{' '}
                      <Text color="primary" fontSize={16}>
                        {route.params.email}
                      </Text>{' '}
                      to verify your email
                    </Text>
                  </Box>
                  <Box paddingHorizontal="l">
                    <Input
                      label="Verification Code"
                      value={code}
                      onChangeText={setCode}
                      placeholder="Enter 6-digit code"
                      keyboardType="numeric"
                      maxLength={6}
                      textAlign="center"
                      style={{
                        fontSize: 18,
                        letterSpacing: 8,
                        textAlign: 'center',
                      }}
                    />
                  </Box>
                  <Box alignItems="center" marginTop="l" gap="s">
                    <Text>
                      Expires in{' '}
                      <Text color="danger">
                        {getFormattedTime(timeLeft / 1000)}
                      </Text>{' '}
                      minute(s)
                    </Text>
                    <Text>
                      Didn't receive a code?{' '}
                      <Text
                        disabled={timeLeft > 0}
                        variant="bold"
                        onPress={() => resend()}
                        color="primary">
                        Resend
                      </Text>
                    </Text>
                  </Box>
                  {resendLoading && (
                    <Box padding="l" alignItems="center">
                      <ActivityIndicator size="small" color={primary} />
                    </Box>
                  )}
                  <Box paddingHorizontal="l" marginTop="30" gap="l">
                    <Button
                      loading={isLoading}
                      disabled={code.trim().length !== 6}
                      displayText="Verify"
                      onPress={() => {
                        verifyCode();
                      }}
                    />
                    <Box alignItems="center">
                      <Text
                        variant="bold"
                        color="primary"
                        onPress={navigation.goBack}>
                        Back
                      </Text>
                    </Box>
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

export default SignupOTPScreen;