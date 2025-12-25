import React from 'react';
import { Modal as RNModal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Box from './Box';
import Text from './Text';
import { useThemeColors } from '../hooks/useTheme';

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

const Modal = ({ visible, onClose, title, children, showCloseButton = true }: Props) => {
  const { label } = useThemeColors();

  return (
    <RNModal visible={visible} transparent animationType="fade">
      <TouchableOpacity 
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
        activeOpacity={1}
        onPress={onClose}
      >
        <Box flex={1} justifyContent="center" paddingHorizontal="l">
          <TouchableOpacity activeOpacity={1}>
            <Box
              backgroundColor="primary_background"
              borderRadius={12}
              padding="l"
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <Box 
                  flexDirection="row" 
                  alignItems="center" 
                  justifyContent="space-between"
                  marginBottom="l"
                >
                  {title && (
                    <Text variant="bold" fontSize={18}>
                      {title}
                    </Text>
                  )}
                  
                  {showCloseButton && (
                    <TouchableOpacity onPress={onClose}>
                      <Ionicons name="close" size={24} color={label} />
                    </TouchableOpacity>
                  )}
                </Box>
              )}
              
              {/* Content */}
              {children}
            </Box>
          </TouchableOpacity>
        </Box>
      </TouchableOpacity>
    </RNModal>
  );
};

export default Modal;