import React from 'react';
import { ActivityIndicator } from 'react-native';
import Box from './Box';
import Text from './Text';
import { useThemeColors } from '../hooks/useTheme';

interface Props {
  size?: 'small' | 'large';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner = ({ size = 'large', text, fullScreen = false }: Props) => {
  const { primary } = useThemeColors();

  const content = (
    <Box alignItems="center" gap="m">
      <ActivityIndicator size={size} color={primary} />
      {text && (
        <Text variant="regular" fontSize={14} color="label" textAlign="center">
          {text}
        </Text>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="background">
        {content}
      </Box>
    );
  }

  return content;
};

export default LoadingSpinner;