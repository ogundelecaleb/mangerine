import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { MainStack } from '../../utils/ParamList';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import Box from '../../components/Box';
import Text from '../../components/Text';
import Button from '../../components/Button';
import { useCreateAccountMutation } from '../../state/services/auth.service';
import { useAppDispatch } from '../../state/hooks/redux';
import { setCredentials } from '../../state/reducers/authSlice';

type Props = NativeStackScreenProps<MainStack, 'FinishRegistration'>;

const FinishRegistrationScreen = ({ route }: Props) => {
  const { email, password, fullName } = route.params;
  const dispatch = useAppDispatch();
  const [createAccount, { isLoading }] = useCreateAccountMutation();

  const handleFinishRegistration = async () => {
    try {
      const result = await createAccount({
        email,
        fullName,
        password,
        businessName: '', // Will be added in later screens
        location: '',
        interests: [],
        userType: ['user'],
      }).unwrap();

      if (result.success) {
        dispatch(setCredentials({
          user: result.data.user,
          token: result.data.token,
        }));
      }
    } catch (error: any) {
      Alert.alert('Registration Failed', error?.data?.message || 'Something went wrong');
    }
  };

  return (
    <BaseScreenComponent>
      <Box flex={1} backgroundColor="background">
        <Box flex={1} justifyContent="center" alignItems="center" paddingHorizontal="l" gap="xl">
          {/* Success Icon */}
          <Box alignItems="center" gap="m">
            <Text fontSize={60}>✅</Text>
            <Text variant="bold" fontSize={28} textAlign="center">
              Email Verified!
            </Text>
          </Box>
          
          {/* Description */}
          <Box gap="m">
            <Text variant="regular" fontSize={16} textAlign="center" color="label">
              Welcome {fullName}! Your email has been successfully verified.
            </Text>
            <Text variant="regular" fontSize={16} textAlign="center" color="label">
              Let's complete your account setup.
            </Text>
          </Box>
          
          {/* Action Button */}
          <Box width="100%">
            <Button 
              displayText="Complete Registration" 
              onPress={handleFinishRegistration}
              loading={isLoading}
            />
          </Box>
        </Box>
      </Box>
    </BaseScreenComponent>
  );
};

export default FinishRegistrationScreen;