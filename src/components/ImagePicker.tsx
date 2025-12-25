import React, { useState } from 'react';
import { TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import Box from './Box';
import Text from './Text';
import Modal from './Modal';
import Button from './Button';
import { useThemeColors } from '../hooks/useTheme';

interface Props {
  onImageSelected: (uri: string) => void;
  currentImage?: string;
  placeholder?: string;
  size?: number;
  quality?: number;
}

const ImagePickerComponent = ({ 
  onImageSelected, 
  currentImage, 
  placeholder = 'Select Image',
  size = 100,
  quality = 0.8 
}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const { faded_border, label, primary_background } = useThemeColors();

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to select images');
      return false;
    }
    return true;
  };

  const pickImage = async (useCamera: boolean = false) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = useCamera 
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality,
          });

      if (!result.canceled && result.assets[0]) {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 400, height: 400 } }],
          { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
        );
        
        onImageSelected(manipulatedImage.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image');
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={() => setShowModal(true)}>
        <Box
          width={size}
          height={size}
          borderRadius={size / 2}
          borderWidth={2}
          borderColor="faded_border"
          backgroundColor="primary_background"
          justifyContent="center"
          alignItems="center"
          overflow="hidden"
        >
          {currentImage ? (
            <Image 
              source={{ uri: currentImage }} 
              style={{ width: size - 4, height: size - 4, borderRadius: (size - 4) / 2 }}
            />
          ) : (
            <Box alignItems="center" gap="xs">
              <Ionicons name="camera" size={24} color={label} />
              <Text variant="regular" fontSize={10} color="label" textAlign="center">
                {placeholder}
              </Text>
            </Box>
          )}
        </Box>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Select Image"
      >
        <Box gap="m">
          <Button
            displayText="Take Photo"
            onPress={() => pickImage(true)}
            buttonProps={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: 'primary' }}
            textProps={{ color: 'primary' }}
          />
          
          <Button
            displayText="Choose from Gallery"
            onPress={() => pickImage(false)}
          />
          
          {currentImage && (
            <Button
              displayText="Remove Image"
              onPress={() => {
                onImageSelected('');
                setShowModal(false);
              }}
              buttonProps={{ backgroundColor: 'danger' }}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ImagePickerComponent;