import AsyncStorage from '@react-native-async-storage/async-storage';
import { store, persistor } from '../state/store';
import { logout } from '../state/reducers/authSlice';

export const logoutUser = async () => {
  // Dispatch logout action
  store.dispatch(logout());
  
  // Clear AsyncStorage
  await AsyncStorage.clear();
  
  // Purge persisted state
  await persistor.purge();
  
  console.log('User logged out and storage cleared');
};

export default logoutUser;