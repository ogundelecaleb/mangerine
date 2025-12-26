import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message';
import * as ImagePicker from 'expo-image-picker';

import Box from '../../components/Box';
import Text from '../../components/Text';
import Input from '../../components/Input';
import Button from '../../components/Button';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import ScaledImage from '../../components/ScaledImage';
import { MainStack } from '../../utils/ParamList';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../utils/theme';
import { useAddConsultancyMutation } from '../../state/services/users.service';

const schema = yup.object({
  title: yup.string().max(255).required('Title is required'),
  description: yup.string().max(255).required('Description is required'),
  hours: yup.string().max(255).required('Hours is required'),
}).required();

type FormData = {
  title: string;
  description: string;
  hours: string;
};

type Props = NativeStackScreenProps<MainStack, 'AddConsultancy'>;

const AddConsultancyScreen = ({ navigation }: Props) => {
  const theme = useTheme<Theme>();
  const [addConsultancy, { isLoading }] = useAddConsultancyMutation();
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      hours: '',
    },
    resolver: yupResolver(schema),
  });

  const selectImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showMessage({
        message: 'Permission to access media library is required',
        type: 'warning',
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0]);
    }
  }, []);

  const onSubmit = useCallback(async (data: FormData) => {
    try {
      if (!selectedImage) {
        showMessage({
          message: 'Please select an image for your service',
          type: 'warning',
        });
        return;
      }

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('hours', data.hours);
      formData.append('file', {
        uri: selectedImage.uri,
        name: 'service-image.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await addConsultancy(formData);

      if (response?.error) {
        const err = response as any;
        showMessage({
          message: err?.error?.data?.message || 'Failed to add service',
          type: 'danger',
        });
        return;
      }

      showMessage({
        message: 'Service added successfully!',
        type: 'success',
      });

      navigation.goBack();
    } catch (error) {
      console.log('add consultancy error:', error);
      showMessage({
        message: 'Failed to add service',
        type: 'danger',
      });
    }
  }, [selectedImage, addConsultancy, navigation]);

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box flex={1}>
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}>
              <Box flex={1}>
                {/* Header */}
                <Box
                  flexDirection="row"
                  alignItems="center"
                  paddingHorizontal="l"
                  paddingVertical="m"
                  gap="m">
                  <TouchableOpacity onPress={navigation.goBack}>
                    <MaterialCommunityIcons
                      name="chevron-left"
                      size={24}
                      color={theme.colors.foreground}
                    />
                  </TouchableOpacity>
                  
                  <Box flex={1} alignItems="center">
                    <Text variant="semibold" fontSize={18}>
                      Add Service
                    </Text>
                  </Box>
                  
                  <Box width={24} />
                </Box>

                {/* Content */}
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Box padding="l" gap="l">
                    {/* Service Title */}
                    <Controller
                      control={control}
                      name="title"
                      render={({ field: { onChange, value } }) => (
                        <Input
                          label="Service Title"
                          placeholder="e.g., Web Development Consultation"
                          value={value}
                          onChangeText={onChange}
                          error={errors.title?.message}
                          required
                        />
                      )}
                    />

                    {/* Hours */}
                    <Controller
                      control={control}
                      name="hours"
                      render={({ field: { onChange, value } }) => (
                        <Input
                          label="Consulting Hours Available"
                          placeholder="e.g., 40 hours per week"
                          value={value}
                          onChangeText={onChange}
                          error={errors.hours?.message}
                          required
                        />
                      )}
                    />

                    {/* Description */}
                    <Controller
                      control={control}
                      name="description"
                      render={({ field: { onChange, value } }) => (
                        <Input
                          label="Service Description"
                          placeholder="Describe your service in detail..."
                          value={value}
                          onChangeText={onChange}
                          error={errors.description?.message}
                          multiline
                          numberOfLines={4}
                          textAlignVertical="top"
                          required
                        />
                      )}
                    />

                    {/* Image Selection */}
                    <Box>
                      <Text variant="semibold" fontSize={14} marginBottom="s">
                        Service Image
                      </Text>
                      <TouchableOpacity onPress={selectImage}>
                        <Box
                          height={200}
                          backgroundColor="faded"
                          borderRadius={8}
                          justifyContent="center"
                          alignItems="center"
                          overflow="hidden">
                          {selectedImage ? (
                            <ScaledImage
                              source={{ uri: selectedImage.uri }}
                              style={{ width: '100%', height: '100%' }}
                            />
                          ) : (
                            <Box alignItems="center" gap="s">
                              <MaterialCommunityIcons
                                name="image-plus"
                                size={48}
                                color={theme.colors.label}
                              />
                              <Text color="label">Tap to select image</Text>
                            </Box>
                          )}
                        </Box>
                      </TouchableOpacity>
                    </Box>

                    {/* Submit Button */}
                    <Box marginTop="l">
                      <Button
                        displayText="Add Service"
                        onPress={handleSubmit(onSubmit)}
                        loading={isLoading}
                      />
                    </Box>
                  </Box>
                </ScrollView>
              </Box>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Box>
      </TouchableWithoutFeedback>
    </BaseScreenComponent>
  );
};

export default AddConsultancyScreen;