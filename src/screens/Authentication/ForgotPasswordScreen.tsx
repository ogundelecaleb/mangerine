import React, { useState } from 'react';
import { Keyboard, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { showMessage } from 'react-native-flash-message';
import { MainStack } from '../../utils/ParamList';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import Box from '../../components/Box';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useForgotPasswordMutation } from '../../state/services/auth.service';
import { validateEmail } from '../../utils/helpers';
import MLogo from '../../assets/svgs/MLogo';
import EnvelopeSVG from '../../assets/svgs/EnvelopeSVG';

type Props = NativeStackScreenProps<MainStack, 'ForgotPassword'>;

interface ForgotPasswordForm {
  email: string;
}

const ForgotPasswordScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [errored, setErrored] = useState(false);
  const [forgot, { isLoading }] = useForgotPasswordMutation();

  const proceed = async () => {
    try {
      if (!email.trim()) {
        return;
      }
      if (!validateEmail(email)) {
        setErrored(true);
        return;
      }

      const response = await forgot({ email });
      
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
      
      navigation.navigate('ForgotPasswordOTP', {
        email,
        otpHash: (response as any)?.data?.data?.otpHash,
      });
    } catch (error) {
      console.log('ForgotPasswordScreen proceed error:', error);
    }
  };

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
                      Forgot Password?
                    </Text>
                    <Text color="label" fontSize={16}>
                      Input your email address below to receive your password
                      reset instruction.
                    </Text>
                  </Box>
                  <Box paddingHorizontal="l">
                    <Input
                      value={email}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      label="Email Address"
                      textContentType="emailAddress"
                      onChangeText={setEmail}
                      required
                      error={errored ? 'Enter a valid email' : undefined}
                      placeholder="johndoe@gmail.com"
                      rightComponent={
                        <Box>
                          <EnvelopeSVG />
                        </Box>
                      }
                    />
                  </Box>
                  <Box paddingHorizontal="l" marginTop="30" gap="l">
                    <Button
                      loading={isLoading}
                      onPress={proceed}
                      disabled={!email.trim()}
                      displayText="Continue"
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

export default ForgotPasswordScreen;