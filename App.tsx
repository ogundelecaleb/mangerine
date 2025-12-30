import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text as RNText } from 'react-native';
import { ThemeProvider } from '@shopify/restyle';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import FlashMessage from 'react-native-flash-message';
import { useFonts, Outfit_300Light, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold } from '@expo-google-fonts/outfit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from './src/utils/theme';
import MainNavigator from './src/navigators/MainNavigator';
import { store, persistor } from './src/state/store';
import logoutUser from './src/utils/logout';

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <RNText>Loading...</RNText>
  </View>
);

export default function App() {
  let [fontsLoaded] = useFonts({
    'Outfit-Light': Outfit_300Light,
    'Outfit-Regular': Outfit_400Regular,
    'Outfit-Medium': Outfit_500Medium,
    'Outfit-SemiBold': Outfit_600SemiBold,
    'Outfit-Bold': Outfit_700Bold,
    'Outfit-ExtraBold': Outfit_800ExtraBold,
  });

  // useEffect(() => {
  //   // Force clear storage on app start
  //   const clearStorage = async () => {
  //     try {
  //       await AsyncStorage.clear();
  //       console.log('Storage cleared');
  //     } catch (error) {
  //       console.log('Error clearing storage:', error);
  //     }
  //   };
  //   clearStorage();
  // }, []);

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <SafeAreaProvider>
          <ThemeProvider theme={theme}>
            <StatusBar style="auto" />
            <MainNavigator />
            <FlashMessage position="top" />
          </ThemeProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
