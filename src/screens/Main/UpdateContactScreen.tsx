import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { showMessage } from 'react-native-flash-message';

import Box from '../../components/Box';
import Text from '../../components/Text';
import Input from '../../components/Input';
import Button from '../../components/Button';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import { MainStack, ErrorData } from '../../utils/ParamList';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../utils/theme';
import { useUpdateProfileContactMutation } from '../../state/services/users.service';
import { useAuth } from '../../state/hooks/user.hook';
import { useLoadAuth } from '../../state/hooks/loadauth.hook';
import CheckBox from '../../components/CheckBox';

const schema = yup
  .object({
    phone: yup.string().max(255).required('Phone is required'),
    link: yup.string().max(255).url('Enter a valid url'),
  })
  .required();

const UpdateContactScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'UpdateContact'>) => {
  const { user } = useAuth();
  const theme = useTheme<Theme>();
  const [phoneVisible, setPhoneVisible] = useState<boolean>(
    user?.phoneVisible || true,
  );
  const [linkVisible, setLinkVisible] = useState<boolean>(
    user?.websiteVisible || true,
  );
  const [updateContact, { isLoading }] = useUpdateProfileContactMutation();
  const { loadAuth } = useLoadAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: user?.mobileNumber || '',
      link: user?.websiteAddress || '',
    },
    resolver: yupResolver(schema),
  });

  const proceed = useCallback(
    async (cred: { [key: string]: string }) => {
      try {
        const { phone, link } = cred;

        if (!phone || !link) {
          showMessage({
            message: 'Kindly fill all fields to proceed',
            type: 'danger',
          });
          return;
        }

        const response = await updateContact({
          body: {
            mobileNumber: phone,
            websiteAddress: link,
            webVisible: linkVisible,
            phoneVisible,
          },
        });

        if (response?.error) {
          const err = response as ErrorData;
          showMessage({
            message:
              err?.error?.data?.message ||
              err?.error?.data?.error ||
              'Something went wrong',
            type: 'danger',
          });
          return;
        }
        showMessage({
          message: 'Profile updated',
          type: 'success',
        });
        loadAuth();
        navigation?.goBack();
      } catch (error) {
        console.log('update contact error:', error);
      }
    },
    [updateContact, linkVisible, phoneVisible, loadAuth, navigation],
  );

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <Box flex={1} backgroundColor="background">
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              keyboardVerticalOffset={15}
              behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
              style={{ flex: 1 }}
              contentContainerStyle={{ flex: 1 }}>
              <Box flex={1}>
                <Box
                  flexDirection="row"
                  alignItems="center"
                  paddingHorizontal="l"
                  gap="m"
                  paddingVertical="m">
                  <Box>
                    <TouchableOpacity
                      onPress={navigation.goBack}
                      style={{ padding: 8, paddingLeft: 0 }}>
                      <MaterialCommunityIcons
                        name="chevron-left"
                        size={24}
                        color={theme.colors.foreground}
                      />
                    </TouchableOpacity>
                  </Box>
                  <Box flex={1} alignItems="center">
                    <Text
                      variant="semibold"
                      fontSize={20}
                      textTransform="capitalize">
                      Contact Me
                    </Text>
                  </Box>
                  <Box padding="s" opacity={0}>
                    <MaterialCommunityIcons
                      name="chevron-left"
                      size={24}
                      color={theme.colors.foreground}
                    />
                  </Box>
                </Box>
                <Box flex={1}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Box paddingHorizontal="l">
                      <Box>
                        <Controller
                          control={control}
                          rules={{
                            required: true,
                          }}
                          name="phone"
                          render={({ field: { onChange, value } }) => (
                            <Input
                              error={errors.phone?.message}
                              label="Phone Number"
                              value={value}
                              required
                              onChangeText={onChange}
                              placeholder="Input phone number"
                            />
                          )}
                        />
                        <Box
                          marginTop="m"
                          marginBottom="l"
                          flexDirection="row"
                          alignItems="center"
                          gap="m">
                          <CheckBox
                            checked={phoneVisible}
                            onPress={() => setPhoneVisible(!phoneVisible)}
                            size={24}
                          />
                          <Text>Make visible to public</Text>
                        </Box>
                      </Box>
                      <Box>
                        <Controller
                          control={control}
                          rules={{
                            required: true,
                          }}
                          name="link"
                          render={({ field: { onChange, value } }) => (
                            <Input
                              error={errors.link?.message}
                              label="Personal Website Link"
                              value={value}
                              onChangeText={onChange}
                              placeholder="Website Link Here"
                            />
                          )}
                        />

                        <Box
                          marginTop="m"
                          marginBottom="l"
                          flexDirection="row"
                          alignItems="center"
                          gap="m">
                          <CheckBox
                            checked={linkVisible}
                            onPress={() => setLinkVisible(!linkVisible)}
                            size={24}
                          />
                          <Text>Make visible to public</Text>
                        </Box>
                      </Box>
                      <Box>
                        <Button
                          loading={isLoading}
                          onPress={handleSubmit(proceed)}
                          displayText="Save"
                        />
                      </Box>
                    </Box>
                  </ScrollView>
                </Box>
              </Box>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Box>
      </TouchableWithoutFeedback>
    </BaseScreenComponent>
  );
};

export default UpdateContactScreen;
