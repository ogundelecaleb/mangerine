import { ActivityIndicator, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message';
import { useTheme } from '@shopify/restyle';

import Box from '../../components/Box';
import Text from '../../components/Text';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import ConsultationHistoryItem from '../../components/ConsultationHistoryItem';
import PaymentHistoryItem from '../../components/PaymentHistoryItem';
import EmptyState from '../../components/EmptyState';
import { MainStack, Appointment, Transaction, ErrorData } from '../../utils/ParamList';
import { Theme } from '../../utils/theme';
import { useGetMyAppointmentsMutation } from '../../state/services/appointment.service';
import { useGetTransactionsMutation } from '../../state/services/transaction.service';

const MyConsultationScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'MyConsultation'>) => {
  const theme = useTheme<Theme>();
  const mainTabs = [
    'Consultation History',
    'Payment History',
    'Consultation Videos',
  ];
  const [activeTab, setActiveTab] = useState(mainTabs[0]);
  const [maxNameWidth, setMaxNameWidth] = useState<number | undefined>(undefined);
  
  const [getAppointments, { isLoading }] = useGetMyAppointmentsMutation();
  const [getTransactions, { isLoading: transactionsLoading }] = useGetTransactionsMutation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [transactionPage, setTransactionPage] = useState(1);
  const [transactionTotalPages, setTransactionTotalPages] = useState(1);
  const limit = 20;

  const loadTransactions = useCallback(async () => {
    try {
      const response = await getTransactions({
        params: {
          limit,
          page: transactionPage,
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
      setTransactions((response as any)?.data?.data?.data || []);
      setTransactionTotalPages((response as any)?.data?.totalPages || 1);
    } catch (error) {
      console.log('get transactions error', JSON.stringify(error));
    }
  }, [getTransactions, transactionPage]);

  const loadAppointments = useCallback(async () => {
    try {
      const response = await getAppointments({
        params: {
          limit,
          page,
          status: '',
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
      setAppointments((response as any)?.data?.data || []);
      setTotalPages((response as any)?.data?.totalPages || 1);
    } catch (error) {
      console.log('get appointments error', JSON.stringify(error));
    }
  }, [getAppointments, page]);

  useFocusEffect(
    useCallback(() => {
      if (activeTab === mainTabs[0]) {
        if (page === 1) {
          loadAppointments();
        } else {
          setPage(1);
        }
      } else if (activeTab === mainTabs[1]) {
        if (transactionPage === 1) {
          loadTransactions();
        } else {
          setTransactionPage(1);
        }
      }
    }, [loadAppointments, loadTransactions, page, transactionPage, activeTab]),
  );

  useEffect(() => {
    if (page !== 1 && activeTab === mainTabs[0]) {
      loadAppointments();
    }
  }, [loadAppointments, page, activeTab]);

  useEffect(() => {
    if (transactionPage !== 1 && activeTab === mainTabs[1]) {
      loadTransactions();
    }
  }, [loadTransactions, transactionPage, activeTab]);

  return (
    <BaseScreenComponent>
      <Box flex={1} backgroundColor="background">
        <SafeAreaView style={{ flex: 1 }}>
          <Box flex={1}>
            <Box
              flexDirection="row"
              alignItems="center"
              paddingHorizontal="l"
              gap="m"
              paddingVertical="m">
              <Box>
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}
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
                  My Consultation
                </Text>
              </Box>
              <Box padding="s" opacity={0} width={32}></Box>
            </Box>
            
            <Box flex={1}>
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                gap="s"
                paddingHorizontal="l">
                {mainTabs.map(t => (
                  <Box flex={1} key={t}>
                    <TouchableOpacity onPress={() => setActiveTab(t)}>
                      <Box
                        height={48}
                        borderBottomWidth={2}
                        borderBottomColor={
                          activeTab === t ? 'primary' : 'transparent'
                        }
                        justifyContent="center"
                        alignItems="center">
                        <Text
                          textAlign="center"
                          fontSize={12}
                          color={activeTab === t ? 'primary' : 'label'}
                          variant={activeTab === t ? 'semibold' : 'regular'}>
                          {t}
                        </Text>
                      </Box>
                    </TouchableOpacity>
                  </Box>
                ))}
              </Box>
              
              {activeTab === mainTabs[0] && (
                <Box flex={1} marginTop="m">
                  <Box
                    backgroundColor="white"
                    borderRadius={8}
                    marginHorizontal="l"
                    overflow="hidden">
                    <Box
                      paddingVertical="m"
                      borderBottomWidth={1}
                      // borderColor='border'
                      borderBottomColor="border"
                      flexDirection="row"
                      gap="l"
                      paddingHorizontal="l"
                      backgroundColor="white">
                      <Box
                        onLayout={e =>
                          setMaxNameWidth(e.nativeEvent.layout.width)
                        }>
                        <Text
                          variant="semibold"
                          textTransform="uppercase"
                          fontSize={10}
                          color="label">
                          CONSULTANT NAME
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          variant="semibold"
                          textTransform="uppercase"
                          fontSize={10}
                          color="label">
                          DATE & TIME
                        </Text>
                      </Box>
                    </Box>
                    
                    {isLoading && page === 1 ? (
                      <Box padding="l" alignItems="center">
                        <ActivityIndicator size="small" color={theme.colors.primary} />
                      </Box>
                    ) : (
                      <FlatList
                        data={appointments}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                          <ConsultationHistoryItem
                            item={item}
                            maxNameWidth={maxNameWidth}
                          />
                        )}
                        ListEmptyComponent={
                          <Box padding="l" alignItems="center">
                            <EmptyState subtitle="No consultation history yet" />
                          </Box>
                        }
                        refreshControl={
                          <RefreshControl
                            refreshing={isLoading}
                            onRefresh={() => {
                              if (page === 1) {
                                loadAppointments();
                              } else {
                                setPage(1);
                              }
                            }}
                          />
                        }
                        onEndReachedThreshold={0.3}
                        onEndReached={() => {
                          if (!isLoading && page < totalPages) {
                            setPage(page + 1);
                          }
                        }}
                      />
                    )}
                  </Box>
                </Box>
              )}
              
              {activeTab === mainTabs[1] && (
                <Box flex={1} marginTop="m">
                  <Box
                    backgroundColor="white"
                    borderRadius={8}
                    marginHorizontal="l"
                    overflow="hidden">
                    <Box
                      paddingVertical="m"
                      borderBottomWidth={1}
                      // borderColor='border'
                      borderBottomColor="border"
                      flexDirection="row"
                      gap="l"
                      paddingHorizontal="l"
                      backgroundColor="white">
                      <Box
                        onLayout={e =>
                          setMaxNameWidth(e.nativeEvent.layout.width)
                        }>
                        <Text
                          variant="semibold"
                          textTransform="uppercase"
                          fontSize={10}
                          color="label">
                          CONSULTANT NAME
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          variant="semibold"
                          textTransform="uppercase"
                          fontSize={10}
                          color="label">
                          DATE & TIME
                        </Text>
                      </Box>
                    </Box>
                    
                    {transactionsLoading && transactionPage === 1 ? (
                      <Box padding="l" alignItems="center">
                        <ActivityIndicator size="small" color={theme.colors.primary} />
                      </Box>
                    ) : (
                      <FlatList
                        data={transactions}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                          <PaymentHistoryItem
                            item={item}
                            maxNameWidth={maxNameWidth}
                          />
                        )}
                        ListEmptyComponent={
                          <Box padding="l" alignItems="center">
                            <EmptyState subtitle="No payment history yet" />
                          </Box>
                        }
                        refreshControl={
                          <RefreshControl
                            refreshing={transactionsLoading}
                            onRefresh={() => {
                              if (transactionPage === 1) {
                                loadTransactions();
                              } else {
                                setTransactionPage(1);
                              }
                            }}
                          />
                        }
                        onEndReachedThreshold={0.3}
                        onEndReached={() => {
                          if (!transactionsLoading && transactionPage < transactionTotalPages) {
                            setTransactionPage(transactionPage + 1);
                          }
                        }}
                      />
                    )}
                  </Box>
                </Box>
              )}
              
              {activeTab === mainTabs[2] && (
                <Box flex={1} padding="l" alignItems="center" justifyContent="center">
                  <EmptyState subtitle="Consultation videos coming soon" />
                </Box>
              )}
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};

export default MyConsultationScreen;
