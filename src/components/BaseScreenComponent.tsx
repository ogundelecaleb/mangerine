import { SafeAreaView } from 'react-native-safe-area-context';
import React, { ReactNode, useState } from 'react';
import Box from './Box';
import { useNavigation } from '@react-navigation/native';
import Text from './Text';
import Button from './Button';
import { useThemeColors } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

// Error fallback screen when something goes wrong
const FallBackScreen = ({
  error,
  resetError,
}: {
  error?: Error;
  resetError?: () => void;
}) => {
  const navigation = useNavigation();
  const { pending } = useThemeColors();
  const [loading] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1}>
        <Box flex={1} justifyContent="center" paddingHorizontal="l" gap="l">
          {/* Warning icon */}
          <Box alignItems="center">
            <Ionicons name="warning" size={42} color={pending} />
          </Box>
          
          {/* Error message */}
          <Text fontSize={20} textAlign="center" variant="semibold">
            Something went wrong while loading this page
          </Text>
          <Text textAlign="center">Error: {error?.message}</Text>
          
          {/* Action buttons */}
          <Button displayText="Try Again" onPress={resetError} />
          
          {navigation?.canGoBack() && (
            <Button 
              displayText="Go Back" 
              onPress={navigation.goBack}
              buttonProps={{ backgroundColor: 'faded' }}
              textProps={{ color: 'foreground' }}
            />
          )}
        </Box>
      </Box>
    </SafeAreaView>
  );
};

// Error fallback without navigation
const FallBackScreenNoNav = ({
  error,
  resetError,
}: {
  error?: Error;
  resetError?: () => void;
}) => {
  const { pending } = useThemeColors();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1}>
        <Box flex={1} justifyContent="center" paddingHorizontal="l" gap="l">
          <Box alignItems="center">
            <Ionicons name="warning" size={42} color={pending} />
          </Box>
          <Text fontSize={20} textAlign="center" variant="semibold">
            Something went wrong while loading this page
          </Text>
          <Text textAlign="center">Error: {error?.message}</Text>
          <Button displayText="Try Again" onPress={resetError} />
        </Box>
      </Box>
    </SafeAreaView>
  );
};

interface Props {
  children: ReactNode;
  err?: boolean;
  noNav?: boolean;
}

// Base screen wrapper with error boundary
const BaseScreenComponent = ({ children, err, noNav }: Props) => {
  // In development, show errors directly
  if (__DEV__) {
    return <Box flex={1}>{children}</Box>;
  }

  // In production, wrap with error boundary
  // Note: For now, we'll use a simple wrapper
  // In a real app, you'd use react-native-error-boundary or similar
  if (err) {
    return noNav ? <FallBackScreenNoNav /> : <FallBackScreen />;
  }

  return <Box flex={1}>{children}</Box>;
};

export default BaseScreenComponent;