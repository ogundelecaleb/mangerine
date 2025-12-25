import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Box from './Box';
import Text from './Text';
import Button from './Button';
import { useThemeColors } from '../hooks/useTheme';

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState = ({ icon = 'folder-open-outline', title, description, actionText, onAction }: Props) => {
  const { label } = useThemeColors();

  return (
    <Box flex={1} justifyContent="center" alignItems="center" paddingHorizontal="l" gap="l">
      <Box alignItems="center" gap="m">
        <Ionicons name={icon} size={64} color={label} />
        
        <Text variant="bold" fontSize={20} textAlign="center">
          {title}
        </Text>
        
        {description && (
          <Text variant="regular" fontSize={16} color="label" textAlign="center">
            {description}
          </Text>
        )}
      </Box>
      
      {actionText && onAction && (
        <Button 
          displayText={actionText}
          onPress={onAction}
        />
      )}
    </Box>
  );
};

export default EmptyState;