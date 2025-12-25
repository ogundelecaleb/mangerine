import React, { useState } from 'react';
import { TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Box from './Box';
import Text from './Text';
import { useThemeColors } from '../hooks/useTheme';

interface Option {
  label: string;
  value: string;
}

interface Props {
  label?: string;
  placeholder?: string;
  options: Option[];
  value?: string;
  onSelect: (value: string) => void;
  error?: string;
}

const Select = ({ label, placeholder, options, value, onSelect, error }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { foreground, primary_background, faded_border, danger, label: labelColor } = useThemeColors();

  const selectedOption = options.find(option => option.value === value);

  return (
    <Box marginBottom="m">
      {label && (
        <Box marginBottom="s">
          <Text variant="medium" fontSize={14}>
            {label}
          </Text>
        </Box>
      )}
      
      <TouchableOpacity onPress={() => setIsOpen(true)}>
        <Box
          backgroundColor="primary_background"
          borderWidth={1}
          borderColor={error ? "danger" : "faded_border"}
          borderRadius={8}
          paddingHorizontal="m"
          height={50}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text
            variant="regular"
            fontSize={14}
            color={selectedOption ? "foreground" : "label"}
          >
            {selectedOption?.label || placeholder || 'Select an option'}
          </Text>
          
          <Ionicons 
            name={isOpen ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={labelColor} 
          />
        </Box>
      </TouchableOpacity>
      
      {error && (
        <Box marginTop="s">
          <Text variant="regular" fontSize={12} color="danger">
            {error}
          </Text>
        </Box>
      )}

      <Modal visible={isOpen} transparent animationType="fade">
        <TouchableOpacity 
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={() => setIsOpen(false)}
        >
          <Box flex={1} justifyContent="center" paddingHorizontal="l">
            <Box
              backgroundColor="primary_background"
              borderRadius={12}
              maxHeight={300}
              overflow="hidden"
            >
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      onSelect(item.value);
                      setIsOpen(false);
                    }}
                  >
                    <Box
                      paddingHorizontal="m"
                      paddingVertical="m"
                      borderBottomWidth={1}
                      borderBottomColor="faded_border"
                    >
                      <Text variant="regular" fontSize={14}>
                        {item.label}
                      </Text>
                    </Box>
                  </TouchableOpacity>
                )}
              />
            </Box>
          </Box>
        </TouchableOpacity>
      </Modal>
    </Box>
  );
};

export default Select;