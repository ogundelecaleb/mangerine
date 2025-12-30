import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { showMessage } from 'react-native-flash-message';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Box from '../../components/Box';
import Text from '../../components/Text';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import ScaledImage from '../../components/ScaledImage';
import { MainStack } from '../../utils/ParamList';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../utils/theme';
import { useAppSelector } from '../../state/hooks/redux';
import { useCreatePostMutation, useEditPostMutation } from '../../state/services/posts.service';

type Props = NativeStackScreenProps<MainStack, 'CreatePost'>;

const CreatePostScreen = ({ navigation, route }: Props) => {
  const theme = useTheme<Theme>();
  const user = useAppSelector(state => state.user?.user);
  const [create, { isLoading }] = useCreatePostMutation();
  const [edit, { isLoading: editLoading }] = useEditPostMutation();
  const [images, setImages] = useState<any[]>([]);
  const [content, setContent] = useState(route?.params?.post?.content || '');
  
  const loading = useMemo(() => editLoading || isLoading, [isLoading, editLoading]);
  const isEditing = !!route?.params?.post;

  const selectImages = useCallback(async () => {
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
      allowsMultipleSelection: true,
      selectionLimit: 2 - images.length,
      quality: 0.7,
    });

    if (!result.canceled && result.assets) {
      setImages(prev => [...prev, ...result.assets]);
    }
  }, [images.length]);

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const createPost = useCallback(async () => {
    try {
      if (images.length < 1 && !content.trim()) {
        showMessage({
          message: 'Please add content or images',
          type: 'warning',
        });
        return;
      }

      const formData = new FormData();
      formData.append('content', content.trim());
      
      images.forEach((image, index) => {
        formData.append('image[]', {
          uri: image.uri,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        } as any);
      });

      const response = await create({ body: formData });
      
      if (response?.error) {
        const err = response as any;
        showMessage({
          message: err?.error?.data?.message || 'Something went wrong',
          type: 'danger',
        });
        return;
      }

      showMessage({
        message: 'Post created successfully',
        type: 'success',
      });
      navigation.goBack();
    } catch (error) {
      console.log('create post error:', error);
      showMessage({
        message: 'Failed to create post',
        type: 'danger',
      });
    }
  }, [images, content, create, navigation]);

  const editPost = useCallback(async () => {
    try {
      if (!route?.params?.post?.id) return;
      
      if (images.length < 1 && !content.trim()) {
        showMessage({
          message: 'Please add content or images',
          type: 'warning',
        });
        return;
      }

      const formData = new FormData();
      formData.append('content', content.trim());
      
      images.forEach((image, index) => {
        formData.append('image[]', {
          uri: image.uri,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        } as any);
      });

      const response = await edit({ 
        body: formData, 
        id: route.params.post.id 
      });
      
      if (response?.error) {
        const err = response as any;
        showMessage({
          message: err?.error?.data?.message || 'Something went wrong',
          type: 'danger',
        });
        return;
      }

      showMessage({
        message: 'Post updated successfully',
        type: 'success',
      });
      navigation.goBack();
    } catch (error) {
      console.log('edit post error:', error);
      showMessage({
        message: 'Failed to update post',
        type: 'danger',
      });
    }
  }, [images, content, edit, navigation, route]);

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
                  paddingHorizontal="l"
                  paddingVertical="m"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between">
                  <TouchableOpacity onPress={navigation.goBack}>
                    <Text color="label">Cancel</Text>
                  </TouchableOpacity>
                  
                  <Text variant="semibold" fontSize={18}>
                    {isEditing ? 'Edit' : 'Create'} Post
                  </Text>
                  
                  <Box minWidth={60} alignItems="flex-end">
                    {loading ? (
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                    ) : (
                      <TouchableOpacity
                        onPress={isEditing ? editPost : createPost}
                        disabled={!content.trim() && images.length === 0}>
                        <Box
                          paddingVertical="s"
                          paddingHorizontal="m"
                          borderRadius={8}
                          backgroundColor={!content.trim() && images.length === 0 ? 'faded' : 'primary'}>
                          <Text 
                            color={!content.trim() && images.length === 0 ? 'label' : 'white'} 
                            variant="semibold">
                            Post
                          </Text>
                        </Box>
                      </TouchableOpacity>
                    )}
                  </Box>
                </Box>

                {/* Content */}
                <Box flex={1} gap="m">
                  {/* Text Input */}
                  <Box flex={2} paddingHorizontal="l">
                    <TextInput
                      value={content}
                      onChangeText={setContent}
                      textAlignVertical="top"
                      multiline
                      style={{
                        flex: 1,
                        fontSize: 16,
                        lineHeight: 24,
                        color: theme.colors.foreground,
                      }}
                      placeholderTextColor={theme.colors.label}
                      placeholder="What would you like to share?"
                    />
                  </Box>

                  {/* Existing Images (for editing) */}
                  {isEditing && route?.params?.post?.images && route.params.post.images.length > 0 && (
                    <Box flex={1} flexDirection="row" gap="m" paddingHorizontal="l">
                      {route.params.post.images.map((imageUri, index) => (
                        <Box
                          key={imageUri}
                          flex={1}
                          height={200}
                          borderRadius={12}
                          overflow="hidden">
                          <ScaledImage
                            source={{ uri: imageUri }}
                            style={{ height: '100%', width: '100%' }}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* New Images */}
                  {images.length > 0 && (
                    <Box flex={1} flexDirection="row" gap="m" paddingHorizontal="l">
                      {images.map((image, index) => (
                        <Box
                          key={image.uri}
                          flex={1}
                          height={200}
                          borderRadius={12}
                          overflow="hidden"
                          position="relative">
                          <ScaledImage
                            source={{ uri: image.uri }}
                            style={{ height: '100%', width: '100%' }}
                          />
                          <Box
                            position="absolute"
                            top={8}
                            right={8}>
                            <TouchableOpacity onPress={() => removeImage(index)}>
                              <Box
                                backgroundColor="black"
                                opacity={0.7}
                                borderRadius={20}
                                padding="s">
                                <MaterialCommunityIcons
                                  name="close"
                                  size={16}
                                  color="white"
                                />
                              </Box>
                            </TouchableOpacity>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>

                {/* Bottom Actions */}
                <Box
                  paddingVertical="m"
                  paddingHorizontal="l"
                  flexDirection="row"
                  justifyContent="flex-end">
                  <TouchableOpacity
                    onPress={selectImages}
                    disabled={images.length >= 2}>
                    <MaterialCommunityIcons
                      name="image-outline"
                      size={24}
                      color={images.length >= 2 ? theme.colors.faded : theme.colors.primary}
                    />
                  </TouchableOpacity>
                </Box>
              </Box>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Box>
      </TouchableWithoutFeedback>
    </BaseScreenComponent>
  );
};

export default CreatePostScreen;