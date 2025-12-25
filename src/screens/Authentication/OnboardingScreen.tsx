import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '../../utils/ParamList';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import Box from '../../components/Box';
import Text from '../../components/Text';
import Button from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../hooks/useTheme';

type Props = NativeStackScreenProps<MainStack, 'Onboarding'>;

const OnboardingScreen = ({ navigation }: Props) => {
  const { primary } = useThemeColors();

  return (
    <BaseScreenComponent>
      <Box flex={1} backgroundColor="background">
        <Box 
          flex={1} 
          justifyContent="center" 
          alignItems="center" 
          paddingHorizontal="l"
          gap="xl"
        >
          {/* App Icon */}
          <Box alignItems="center" gap="m">
            <Ionicons name="people-circle" size={120} color={primary} />
            <Text variant="bold" fontSize={32} textAlign="center">
              Welcome to Mangerine
            </Text>
          </Box>
          
          {/* Description */}
          <Box gap="m">
            <Text variant="regular" fontSize={16} textAlign="center" color="label">
              Connect with expert consultants and grow your business with personalized guidance
            </Text>
          </Box>
          
          {/* Action Buttons */}
          <Box width="100%" gap="m">
            <Button 
              displayText="Get Started" 
              onPress={() => navigation.navigate('Login')}
            />
            
            <Button 
              displayText="Create Account" 
              onPress={() => navigation.navigate('Signup')}
              buttonProps={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: 'primary' }}
              textProps={{ color: 'primary' }}
            />
          </Box>
        </Box>
      </Box>
    </BaseScreenComponent>
  );
};

export default OnboardingScreen;