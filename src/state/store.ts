import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import API services
import { authApi } from './services/auth.service';
import { usersApi } from './services/users.service';
import { postsApi } from './services/posts.service';
import { consultantsApi } from './services/consultants.service';
import { appointmentApi } from './services/appointment.service';
import { availabilityApi } from './services/availability.service';

// Import reducers
import authReducer from './reducers/authSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // Only persist auth data
  blacklist: [
    authApi.reducerPath, 
    usersApi.reducerPath, 
    postsApi.reducerPath, 
    consultantsApi.reducerPath,
    appointmentApi.reducerPath,
    availabilityApi.reducerPath
  ], // Don't persist API cache
};

// Root reducer combining all slices
const rootReducer = combineReducers({
  // API services
  [authApi.reducerPath]: authApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [postsApi.reducerPath]: postsApi.reducer,
  [consultantsApi.reducerPath]: consultantsApi.reducer,
  [appointmentApi.reducerPath]: appointmentApi.reducer,
  [availabilityApi.reducerPath]: availabilityApi.reducer,
  
  // App state slices
  auth: authReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(authApi.middleware)
      .concat(usersApi.middleware)
      .concat(postsApi.middleware)
      .concat(consultantsApi.middleware)
      .concat(appointmentApi.middleware)
      .concat(availabilityApi.middleware),
  devTools: __DEV__,
});

// Persistor for Redux Persist
export const persistor = persistStore(store);

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;