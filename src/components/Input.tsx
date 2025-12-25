import React, { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { useThemeColors } from '../hooks/useTheme';
import Box from './Box';
import Text from './Text';

interface Props extends TextInputProps {
  // Input label
  label?: string;
  // Error message to display
  error?: string;
  // Whether field is required
  required?: boolean;
  // Container height
  height?: number;
}

const Input = forwardRef<TextInput, Props>(({
  label,
  error,
  required,
  height = 50,
  style,
  ...props
}, ref) => {
  const { foreground, border, placeholder, danger, primary_background } = useThemeColors();

  return (
    <Box marginBottom="m">
      {/* Label */}
      {label && (
        <Box marginBottom="s">
          <Text variant="medium" fontSize={14}>
            {label}
            {required && <Text color="danger"> *</Text>}
          </Text>
        </Box>
      )}
      
      {/* Input field */}
      <Box
        backgroundColor="primary_background"
        borderWidth={1}
        borderColor={error ? "danger" : "faded_border"}
        borderRadius={8}
        paddingHorizontal="m"
        height={height}>
        <TextInput
          ref={ref}
          style={[
            {
              flex: 1,
              color: foreground,
              fontSize: 14,
              fontFamily: 'Outfit-Regular',
            },
            style,
          ]}
          placeholderTextColor={placeholder}
          {...props}
        />
      </Box>
      
      {/* Error message */}
      {error && (
        <Box marginTop="s">
          <Text variant="regular" fontSize={12} color="danger">
            {error}
          </Text>
        </Box>
      )}
    </Box>
  );
});

Input.displayName = 'Input';

export default Input;