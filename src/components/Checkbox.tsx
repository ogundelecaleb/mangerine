import React from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../utils/theme';
import Box from './Box';

interface Props {
  color?: string;
  checkColor?: string;
  size?: number;
  onPress?: () => void;
  checked?: boolean;
}

const CheckBox = ({ checked, onPress, size = 20, color, checkColor }: Props) => {
  const theme = useTheme<Theme>();

  return (
    <Box>
      <TouchableOpacity
        activeOpacity={0.91}
        testID="checkbox"
        onPress={onPress}>
        <Box
          borderRadius={5}
          borderWidth={1}
          justifyContent="center"
          alignItems="center"
          style={{
            borderColor: color || theme.colors.primary,
            backgroundColor: checked ? color || theme.colors.primary : undefined,
            width: size,
            height: size,
          }}>
          {checked && (
            <Ionicons
              name={'checkmark'}
              size={size - 6}
              color={checked ? checkColor || theme.colors.background : theme.colors.primary}
            />
          )}
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default CheckBox;