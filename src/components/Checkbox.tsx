import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Box from './Box';
import Text from './Text';
import { useThemeColors } from '../hooks/useTheme';

interface Props {
  label?: string;
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const Checkbox = ({ label, checked, onPress, disabled }: Props) => {
  const { primary, faded_border, background } = useThemeColors();

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Box flexDirection="row" alignItems="center" gap="s">
        <Box
          width={20}
          height={20}
          borderRadius={4}
          borderWidth={2}
          borderColor={checked ? 'primary' : 'faded_border'}
          backgroundColor={checked ? 'primary' : 'background'}
          justifyContent="center"
          alignItems="center"
          opacity={disabled ? 0.5 : 1}
        >
          {checked && (
            <Ionicons name="checkmark" size={12} color={background} />
          )}
        </Box>
        
        {label && (
          <Text variant="regular" fontSize={14} opacity={disabled ? 0.5 : 1}>
            {label}
          </Text>
        )}
      </Box>
    </TouchableOpacity>
  );
};

export default Checkbox;