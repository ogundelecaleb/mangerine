import React from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@shopify/restyle';
import Box from './Box';
import { Theme } from '../utils/theme';

interface CheckBoxProps {
  checked: boolean;
  onPress: () => void;
  size?: number;
  disabled?: boolean;
}

const CheckBox = ({ checked, onPress, size = 20, disabled = false }: CheckBoxProps) => {
  const theme = useTheme<Theme>();

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Box
        width={size}
        height={size}
        borderRadius={4}
        borderWidth={2}
        borderColor={checked ? 'primary' : 'border'}
        backgroundColor={checked ? 'primary' : 'background'}
        justifyContent="center"
        alignItems="center"
        opacity={disabled ? 0.5 : 1}>
        {checked && (
          <MaterialCommunityIcons
            name="check"
            size={size * 0.7}
            color="white"
          />
        )}
      </Box>
    </TouchableOpacity>
  );
};

export default CheckBox;