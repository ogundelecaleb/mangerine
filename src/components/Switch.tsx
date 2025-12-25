import React from 'react';
import { Switch as RNSwitch } from 'react-native';
import Box from './Box';
import Text from './Text';
import { useThemeColors } from '../hooks/useTheme';

interface Props {
  label?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const Switch = ({ label, value, onValueChange, disabled }: Props) => {
  const { primary, faded } = useThemeColors();

  return (
    <Box flexDirection="row" alignItems="center" justifyContent="space-between">
      {label && (
        <Text variant="regular" fontSize={14} opacity={disabled ? 0.5 : 1}>
          {label}
        </Text>
      )}
      
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: faded, true: primary }}
        thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
      />
    </Box>
  );
};

export default Switch;