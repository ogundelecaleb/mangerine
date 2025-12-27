import React, { forwardRef, ReactNode } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../utils/theme';
import Box from './Box';
import Text from './Text';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  height?: number;
  rightComponent?: ReactNode;
  leftComponent?: ReactNode;
  noMargin?: boolean;
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  subtext?: string;
}

const Input = forwardRef<TextInput, Props>(({ 
  label,
  error,
  required,
  height = 50,
  rightComponent,
  leftComponent,
  noMargin,
  backgroundColor,
  borderWidth,
  borderColor,
  subtext,
  style,
  ...props
}, ref) => {
  const theme = useTheme<Theme>();

  return (
    <Box marginBottom={noMargin ? undefined : "m"}>
      {label && (
        <Box marginBottom="s">
          <Text variant="medium" fontSize={14}>
            {label}
            {required && <Text color="danger"> *</Text>}
          </Text>
        </Box>
      )}
      
      <Box
        backgroundColor={backgroundColor || "primary_background"}
        borderWidth={borderWidth ?? 1}
        borderColor={error ? "danger" : borderColor || "faded_border"}
        borderRadius={8}
        paddingHorizontal="m"
        height={height}
        flexDirection="row"
        alignItems="center">
        {leftComponent}
        <TextInput
          ref={ref}
          style={[
            {
              flex: 1,
              color: theme.colors.foreground,
              fontSize: 14,
              fontFamily: 'Outfit-Regular',
            },
            style,
          ]}
          placeholderTextColor={theme.colors.placeholder}
          {...props}
        />
        {rightComponent}
      </Box>
      
      {error && (
        <Box marginTop="s">
          <Text variant="regular" fontSize={12} color="danger">
            {error}
          </Text>
        </Box>
      )}
      
      {subtext && !error && (
        <Box marginTop="s">
          <Text variant="regular" fontSize={12} color="label">
            {subtext}
          </Text>
        </Box>
      )}
    </Box>
  );
});

Input.displayName = 'Input';

export default Input;