import { Theme } from '@/utils/theme';
import { BoxProps, ColorProps } from '@shopify/restyle';
import React, { ReactNode } from 'react';
import Box from './Box';
import Text from './Text';
import Input from './Input';

interface Props {
  label?: string;
  containerProps?: BoxProps<Theme>;
  rightComponent?: ReactNode;
  leftComponent?: ReactNode;
  error?: string;
  badge?: string;
  backgroundColor?: string;
  disabled?: boolean;
  required?: boolean;
  noPadding?: boolean;
  noMargin?: boolean;
  labelColor?: ColorProps<Theme>['color'];
  borderColor?: ColorProps<Theme>['color'];
  subtext?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  maximumDate?: Date;
  borderRadius?: number | string;
  borderWidth?: number | string;
  height?: any;
}

const DatePicker = ({
  label,
  noMargin,
  containerProps,
  labelColor,
  disabled,
  error,
  borderColor,
  noPadding,
  placeholder: placeholderText,
  value,
  backgroundColor,
  onChange,
  required,
  borderRadius,
  borderWidth,
  height,
}: Props) => {
  return (
    <Input
      label={label}
      placeholder={placeholderText || 'YYYY-MM-DD'}
      value={value}
      onChangeText={onChange}
      error={error}
      required={required}
      keyboardType="numeric"
    />
  );
};

export default DatePicker;
