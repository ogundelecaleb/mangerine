import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message';

import Box from '../../components/Box';
import Text from '../../components/Text';
import Input from '../../components/Input';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import BottomTabHeader from '../../components/BottomTabHeader';
import ConsultantItem from '../../components/ConsultantItem';
import EmptyState from '../../components/EmptyState';
import { BottomTabList, MainStack } from '../../utils/ParamList';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../utils/theme';
import { useGetConsultantsMutation } from '../../state/services/consultants.service';
import { useAuth } from '../../state/hooks/user.hook';

interface Consultant {
  id: string;
  fullName: string;
  title?: string;
  profilePics?: string;
  bio?: string;
  hourlyRate?: number;
  rating?: number;
  specialization?: string;
  isVerified?: boolean;
}

interface Props extends BottomTabScreenProps<BottomTabList, 'Consultant'> {}

const ConsultantScreen = ({}: Props) => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<NativeStackNavigationProp<MainStack>>();
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [getConsultants, { isLoading }] = useGetConsultantsMutation();
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [activeTab, setActiveTab] = useState<'browse' | 'manage'>('browse');
  const { user } = useAuth();

  const searchConsultants = useMemo(
    () =>
      consultants.filter(c =>
        c?.fullName?.toLowerCase()?.includes(search?.toLowerCase()) ||
        c?.specialization?.toLowerCase()?.includes(search?.toLowerCase())
      ),
    [consultants, search]
  );

  const loadConsultants = useCallback(async () => {
    try {
      const response = await getConsultants({});
      
      if (response?.error) {
        const err = response as any;
        showMessage({
          message: err?.error?.data?.message || 'Failed to load consultants',
          type: 'danger',
        });
        return;
      }
      
      setConsultants((response as any)?.data?.data?.consultants || []);
    } catch (error) {
      console.log('consultants error:', error);
      showMessage({
        message: 'Failed to load consultants',
        type: 'danger',
      });
    }
  }, [getConsultants]);

  useEffect(() => {
    loadConsultants();
  }, []);

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box flex={1}>
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}>
              <Box flex={1}>
                <BottomTabHeader onSearch={() => setShowSearch(!showSearch)} />
                
                <Box flex={1}>
                  {showSearch && (
                    <Box
                      flexDirection="row"
                      marginTop="m"
                      gap="s"
                      paddingHorizontal="l">
                      <Box flex={1}>
                        <Input
                          leftComponent={
                            <MaterialCommunityIcons
                              name="magnify"
                              size={24}
                              color={theme.colors.label}
                              style={{ marginRight: 8 }}
                            />
                          }
                          backgroundColor="faded"
                          borderWidth={0}
                          value={search}
                          onChangeText={setSearch}
                          placeholder="Search consultants..."
                        />
                      </Box>
                    </Box>
                  )}

                  {isLoading && (
                    <Box padding="l" alignItems="center">
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                    </Box>
                  )}

                  <Box
                    flexDirection="row"
                    marginBottom="m"
                    paddingHorizontal="l"
                    gap="m">
                    <TouchableOpacity onPress={() => setActiveTab('browse')}>
                      <Box
                        paddingBottom="s"
                        borderBottomWidth={2}
                        borderBottomColor={activeTab === 'browse' ? 'primary' : 'transparent'}>
                        <Text 
                          fontSize={14} 
                          variant="semibold" 
                          color={activeTab === 'browse' ? 'primary' : 'label'}>
                          Browse Consultants
                        </Text>
                      </Box>
                    </TouchableOpacity>
                    {/* {user?.isConsultant && ( */}
                    {user && (
                      <TouchableOpacity onPress={() => setActiveTab('manage')}>
                        <Box
                          paddingBottom="s"
                          borderBottomWidth={2}
                          borderBottomColor={activeTab === 'manage' ? 'primary' : 'transparent'}>
                          <Text 
                            fontSize={14} 
                            variant="semibold" 
                            color={activeTab === 'manage' ? 'primary' : 'label'}>
                            My Business
                          </Text>
                        </Box>
                      </TouchableOpacity>
                    )}
                  </Box>

                  <Box flex={1}>
                    {activeTab === 'browse' ? (
                      <FlatList
                        contentContainerStyle={{
                          paddingHorizontal: 24,
                          gap: 16,
                          paddingBottom: 40,
                        }}
                        refreshControl={
                          <RefreshControl
                            refreshing={isLoading}
                            onRefresh={loadConsultants}
                          />
                        }
                        data={searchConsultants}
                        keyExtractor={({ id }) => id}
                        renderItem={({ item }) => (
                          <ConsultantItem consultant={item} />
                        )}
                        ListEmptyComponent={
                          <Box paddingTop="xl">
                            <EmptyState
                              title="No consultants available"
                              description="Check back later for available consultants"
                            />
                          </Box>
                        }
                      />
                    ) : (
                      <Box paddingHorizontal="l" paddingTop="m">
                        <Box gap="m">
                          <TouchableOpacity
                            onPress={() => navigation.navigate('Pricing')}>
                            <Box
                              flexDirection="row"
                              alignItems="center"
                              padding="m"
                              backgroundColor="background"
                              borderRadius={8}
                              borderWidth={1}
                              borderColor="faded">
                              <Box
                                width={40}
                                height={40}
                                borderRadius={20}
                                backgroundColor="primary"
                                justifyContent="center"
                                alignItems="center"
                                marginRight="m">
                                <MaterialCommunityIcons
                                  name="currency-usd"
                                  size={20}
                                  color="white"
                                />
                              </Box>
                              <Box flex={1}>
                                <Text variant="semibold" fontSize={16}>
                                  Pricing Settings
                                </Text>
                                <Text color="label" fontSize={12}>
                                  Set your hourly rates and discounts
                                </Text>
                              </Box>
                              <MaterialCommunityIcons
                                name="chevron-right"
                                size={20}
                                color={theme.colors.label}
                              />
                            </Box>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => navigation.navigate('AvailabilitySettings')}>
                            <Box
                              flexDirection="row"
                              alignItems="center"
                              padding="m"
                              backgroundColor="background"
                              borderRadius={8}
                              borderWidth={1}
                              borderColor="faded">
                              <Box
                                width={40}
                                height={40}
                                borderRadius={20}
                                backgroundColor="primary"
                                justifyContent="center"
                                alignItems="center"
                                marginRight="m">
                                <MaterialCommunityIcons
                                  name="calendar-clock"
                                  size={20}
                                  color="white"
                                />
                              </Box>
                              <Box flex={1}>
                                <Text variant="semibold" fontSize={16}>
                                  Availability Settings
                                </Text>
                                <Text color="label" fontSize={12}>
                                  Manage your consultation schedule
                                </Text>
                              </Box>
                              <MaterialCommunityIcons
                                name="chevron-right"
                                size={20}
                                color={theme.colors.label}
                              />
                            </Box>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => navigation.navigate('AddConsultancy')}>
                            <Box
                              flexDirection="row"
                              alignItems="center"
                              padding="m"
                              backgroundColor="background"
                              borderRadius={8}
                              borderWidth={1}
                              borderColor="faded">
                              <Box
                                width={40}
                                height={40}
                                borderRadius={20}
                                backgroundColor="primary"
                                justifyContent="center"
                                alignItems="center"
                                marginRight="m">
                                <MaterialCommunityIcons
                                  name="briefcase-plus"
                                  size={20}
                                  color="white"
                                />
                              </Box>
                              <Box flex={1}>
                                <Text variant="semibold" fontSize={16}>
                                  Manage Services
                                </Text>
                                <Text color="label" fontSize={12}>
                                  Add and edit your consulting services
                                </Text>
                              </Box>
                              <MaterialCommunityIcons
                                name="chevron-right"
                                size={20}
                                color={theme.colors.label}
                              />
                            </Box>
                          </TouchableOpacity>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </KeyboardAvoidingView>
          </SafeAreaView>
          
          {/* Floating Add Button - Only show on browse tab */}
          {activeTab === 'browse' && (
            <Box position="absolute" bottom={20} right={20}>
              <TouchableOpacity
                onPress={() => navigation.navigate('AddConsultancy')}>
                <Box
                  width={56}
                  height={56}
                  borderRadius={28}
                  backgroundColor="primary"
                  justifyContent="center"
                  alignItems="center"
                  elevation={4}
                  shadowColor="black"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.25}
                  shadowRadius={4}>
                  <MaterialCommunityIcons
                    name="plus"
                    size={24}
                    color="white"
                  />
                </Box>
              </TouchableOpacity>
            </Box>
          )}
        </Box>
      </TouchableWithoutFeedback>
    </BaseScreenComponent>
  );
};

export default ConsultantScreen;