import React, { useState } from 'react';
import { TouchableOpacity, Modal, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Box from './Box';
import Text from './Text';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../utils/theme';

interface Option {
  title: string;
  value: string;
}

interface Props {
  label?: string;
  placeholder?: string;
  data: Option[];
  value?: string;
  onSelect: (value: string) => void;
  error?: string;
  required?: boolean;
}

const Select = ({ label, placeholder, data, value, onSelect, error, required }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme<Theme>();

  const selectedOption = data.find(option => option.value === value);

  return (
    <Box marginBottom="m">
      {label && (
        <Box marginBottom="s">
          <Text variant="medium" fontSize={14}>
            {label}
            {required && <Text color="danger"> *</Text>}
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
            {selectedOption?.title || placeholder || 'Select an option'}
          </Text>
          
          <MaterialCommunityIcons 
            name={isOpen ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={theme.colors.label} 
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
                data={data}
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
                        {item.title}
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