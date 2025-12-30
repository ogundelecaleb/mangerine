import {
  Image,
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message';

import { MainStack } from '../../utils/ParamList';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import Box from '../../components/Box';
import Text from '../../components/Text';
import Button from '../../components/Button';
import ImagePicker from '../../components/ImagePicker';
import { useAppSelector } from '../../state/hooks/redux';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../utils/theme';

type Props = NativeStackScreenProps<MainStack, 'SignupAvatar'>;

const SignupAvatarScreen = ({ navigation }: Props) => {
  const theme = useTheme<Theme>();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector(state => state.user?.user);

  const handleImageSelected = (imageUri: string) => {
    setAvatar(imageUri);
  };

  const updatePic = useCallback(async () => {
    try {
      if (!avatar) {
        return;
      }
      
      setIsLoading(true);
      
      // Simulate upload - in real app this would upload to server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showMessage({
        message: 'Profile picture updated successfully!',
        type: 'success',
      });
      
      // Navigate to next screen (SignupResume or complete signup)
      // For now, we'll complete the signup flow
      showMessage({
        message: 'Registration completed successfully!',
        type: 'success',
      });
      
    } catch (error) {
      showMessage({
        message: 'Failed to upload profile picture',
        type: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  }, [avatar]);

  const skipStep = () => {
    showMessage({
      message: 'Registration completed successfully!',
      type: 'success',
    });
  };

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <Box flex={1} backgroundColor="background">
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              keyboardVerticalOffset={20}
              behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
              style={{ flex: 1 }}
              contentContainerStyle={{ flex: 1 }}>
              <Box flex={1}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Box onStartShouldSetResponder={() => true}>
                    {/* Header */}
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      padding="l"
                      justifyContent="space-between">
                      <Text variant="bold" fontSize={24} color="foreground_primary">
                        Mangerine
                      </Text>
                      <TouchableOpacity onPress={navigation.goBack}>
                        <Text color="label">Cancel</Text>
                      </TouchableOpacity>
                    </Box>

                    {/* Progress Bar */}
                    <Box paddingHorizontal="l">
                      <Box
                        height={10}
                        borderRadius={10}
                        flexDirection="row"
                        alignItems="stretch"
                        style={{ backgroundColor: '#B5B9C7' }}>
                        <Box
                          backgroundColor="foreground_primary"
                          borderRadius={10}
                          width="75%"
                        />
                        <Box
                          height={20}
                          width={20}
                          borderRadius={20}
                          borderWidth={4}
                          borderColor="foreground_primary"
                          style={{
                            marginTop: -5,
                            backgroundColor: '#B5B9C7',
                            marginLeft: -10,
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Title */}
                    <Box paddingVertical="l" paddingHorizontal="l" gap="s">
                      <Text fontSize={24} variant="semibold">
                        Let's get to know you
                      </Text>
                      <Text color="label" fontSize={16}>
                        Upload a profile picture
                      </Text>
                    </Box>

                    {/* Avatar Section */}
                    <Box paddingHorizontal="l">
                      <Box alignItems="center" marginBottom="m">
                        <ImagePicker
                          onImageSelected={handleImageSelected}
                          currentImage={avatar}>
                          <Box
                            height={100}
                            width={100}
                            borderRadius={100}
                            justifyContent="center"
                            alignItems="center"
                            overflow="hidden"
                            backgroundColor="muted">
                            {avatar ? (
                              <Image
                                source={{ uri: avatar }}
                                style={{
                                  height: '100%',
                                  width: '100%',
                                }}
                                resizeMode="cover"
                              />
                            ) : (
                              <MaterialCommunityIcons
                                name="account"
                                size={64}
                                color={theme.colors.label}
                              />
                            )}
                          </Box>
                        </ImagePicker>
                      </Box>

                      {/* User Info */}
                      <Box>
                        <Text
                          fontSize={24}
                          variant="semibold"
                          textAlign="center">
                          {user?.fullName || 'User'}
                        </Text>
                      </Box>
                      <Box
                        marginTop="m"
                        flexDirection="row"
                        alignItems="center"
                        gap="xs"
                        justifyContent="center">
                        <MaterialCommunityIcons
                          name="map-marker"
                          size={20}
                          color={theme.colors.label}
                        />
                        <Text color="label">{user?.location || 'Location'}</Text>
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box paddingHorizontal="l" marginTop="xl" gap="l">
                      <Button
                        loading={isLoading}
                        disabled={!avatar}
                        displayText="Next"
                        onPress={updatePic}
                      />
                      <TouchableOpacity onPress={skipStep}>
                        <Box alignItems="center">
                          <Text variant="semibold" fontSize={16}>
                            Skip
                          </Text>
                        </Box>
                      </TouchableOpacity>
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

export default SignupAvatarScreen;