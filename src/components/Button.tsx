import { Theme } from '../utils/theme';
import { BoxProps, TextProps, useTheme } from '@shopify/restyle';
import React, { ReactNode } from 'react';
import { TouchableOpacity, ViewStyle, ActivityIndicator } from 'react-native';
import Box from './Box';
import Text from './Text';

interface Props {
  // Container styling props
  containerProps?: BoxProps<Theme>;
  // Button press handler
  onPress?: () => void;
  // Button styling props
  buttonProps?: BoxProps<Theme>;
  // Text to display on button
  displayText?: string;
  // Custom children instead of text
  children?: ReactNode;
  // Loading state
  loading?: boolean;
  // Custom style
  style?: ViewStyle;
  // Text styling props
  textProps?: TextProps<Theme>;
  // Disabled state
  disabled?: boolean;
  // Test ID for testing
  testID?: string;
}

const Button = ({
  containerProps,
  onPress,
  buttonProps,
  displayText,
  children,
  loading,
  style,
  textProps,
  disabled,
  testID,
}: Props) => {
  const theme = useTheme<Theme>();

  return (
    <Box width="100%" {...containerProps}>
      <TouchableOpacity
        activeOpacity={0.91}
        testID={testID || 'app-button'}
        disabled={disabled || loading}
        onPress={onPress}>
        <Box
          height={52}
          opacity={disabled ? 0.4 : undefined}
          backgroundColor="button_primary"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          borderRadius={8}
          {...buttonProps}
          style={{ ...style }}>
          
          {/* Loading spinner */}
          {loading && (
            <ActivityIndicator
              color={
                theme.colors[textProps?.color || 'background'] ||
                theme.colors.background
              }
              style={{ marginRight: 8 }}
              size="small"
            />
          )}
          
          {/* Button text */}
          {displayText && (
            <Text
              variant="semibold"
              color="background"
              fontSize={16}
              {...textProps}>
              {displayText}
            </Text>
          )}
          
          {/* Custom children */}
          {children}
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default Button;