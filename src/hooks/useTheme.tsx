import { Theme } from '../utils/theme';
import { useTheme } from '@shopify/restyle';
import { useMemo } from 'react';

// Hook to get theme colors easily in components
export const useThemeColors = () => {
  const theme = useTheme<Theme>();

  return useMemo(
    () => ({
      ...theme.colors,
    }),
    [theme],
  );
};

// Hook to get theme spacing values
export const useThemeSpacing = () => {
  const theme = useTheme<Theme>();

  return useMemo(
    () => ({
      ...theme.spacing,
    }),
    [theme],
  );
};

// Hook to get text variants
export const useThemeText = () => {
  const theme = useTheme<Theme>();

  return useMemo(
    () => ({
      ...theme.textVariants,
    }),
    [theme],
  );
};