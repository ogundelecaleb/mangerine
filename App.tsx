import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text as RNText } from 'react-native';
import { ThemeProvider } from '@shopify/restyle';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import theme from './src/utils/theme';
import MainNavigator from './src/navigators/MainNavigator';
import { store, persistor } from './src/state/store';

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <RNText>Loading...</RNText>
  </View>
);

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <SafeAreaProvider>
          <ThemeProvider theme={theme}>
            <StatusBar style="auto" />
            <MainNavigator />
          </ThemeProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
