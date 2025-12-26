import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MainStack } from '../../utils/ParamList';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import Box from '../../components/Box';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Input from '../../components/Input';
import ImagePickerComponent from '../../components/ImagePicker';
import { useGetInfoQuery, useUpdateProfileInfoMutation, useUpdateProfilePicMutation } from '../../state/services/users.service';
import { useThemeColors } from '../../hooks/useTheme';

type Props = NativeStackScreenProps<MainStack, 'EditProfile'>;

interface ProfileForm {
  fullName: string;
  occupation: string;
  location: string;
  bio: string;
  dateOfBirth: string;
}

const EditProfileScreen = ({ navigation }: Props) => {
  const { label } = useThemeColors();
  const { data: profile } = useGetInfoQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileInfoMutation();
  const [updateProfilePic, { isLoading: isUploadingImage }] = useUpdateProfilePicMutation();

  const user = profile?.data?.user;

  const { control, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    defaultValues: {
      fullName: user?.fullName || '',
      occupation: user?.occupation || '',
      location: user?.location || '',
      bio: user?.bio || '',
      dateOfBirth: user?.dateOfBirth || '',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    try {
      const result = await updateProfile(data).unwrap();
      if (result.success) {
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      }
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to update profile');
    }
  };

  const handleImageSelected = async (uri: string) => {
    if (!uri) return;
    
    try {
      const formData = new FormData();
      formData.append('profilePic', {
        uri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);
      
      const result = await updateProfilePic(formData).unwrap();
      if (result.success) {
        Alert.alert('Success', 'Profile picture updated successfully');
      }
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to update profile picture');
    }
  };

  return (
    <BaseScreenComponent>
      <Box flex={1} backgroundColor="background">
        {/* Header */}
        <Box 
          flexDirection="row" 
          alignItems="center" 
          justifyContent="space-between"
          paddingHorizontal="l"
          paddingVertical="m"
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={label} />
          </TouchableOpacity>
          
          <Text variant="bold" fontSize={18}>
            Edit Profile
          </Text>
          
          <Box width={24} />
        </Box>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Box paddingHorizontal="l" gap="l">
            {/* Profile Picture */}
            <Box alignItems="center" marginVertical="l">
              <ImagePickerComponent
                onImageSelected={handleImageSelected}
                currentImage={user?.avatar}
                placeholder="Update Photo"
                size={120}
              />
              {isUploadingImage && (
                <Text variant="regular" fontSize={12} color="label" marginTop="s">
                  Uploading...
                </Text>
              )}
            </Box>

            {/* Form */}
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.fullName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="occupation"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Occupation"
                  placeholder="Enter your occupation"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.occupation?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Location"
                  placeholder="Enter your location"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.location?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Bio"
                  placeholder="Tell us about yourself"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.bio?.message}
                  height={100}
                  multiline
                />
              )}
            />

            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Date of Birth"
                  placeholder="YYYY-MM-DD"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.dateOfBirth?.message}
                />
              )}
            />

            <Button
              displayText="Save Changes"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
            />
          </Box>
        </ScrollView>
      </Box>
    </BaseScreenComponent>
  );
};

export default EditProfileScreen;