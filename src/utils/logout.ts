import AsyncStorage from '@react-native-async-storage/async-storage';
import { store, persistor } from '../state/store';
import { signUserOut } from '../state/reducers/user.reducer';

export const logoutUser = async () => {
  // Dispatch logout action
  store.dispatch(signUserOut());
  
  // Clear AsyncStorage
  await AsyncStorage.clear();
  
  // Purge persisted state
  await persistor.purge();
  
  console.log('User logged out and storage cleared');
};

export default logoutUser;