import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import API services
import { authApi } from './services/auth.service';
import { usersApi } from './services/users.service';
import { postsApi } from './services/posts.service';
import { consultantsApi } from './services/consultants.service';
import { appointmentApi } from './services/appointment.service';
import { availabilityApi } from './services/availability.service';
import { workApi } from './services/work.service';

// Import reducers
import authReducer from './reducers/authSlice';
import postsReducer from './reducers/posts.reducer';
import userReducer from './reducers/user.reducer';
import usersettingsReducer from './reducers/usersettings.reducer';
import settingReducer from './reducers/setting.reducer';
import groupsReducer from './reducers/groups.reducer';
import chatReducer from './reducers/chat.reducer';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'user', 'usersettings', 'chat'], // Persist these reducers
  blacklist: [
    authApi.reducerPath, 
    usersApi.reducerPath, 
    postsApi.reducerPath, 
    consultantsApi.reducerPath,
    appointmentApi.reducerPath,
    availabilityApi.reducerPath,
    workApi.reducerPath
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
  [workApi.reducerPath]: workApi.reducer,
  
  // App state slices
  auth: authReducer,
  user: userReducer,
  usersettings: usersettingsReducer,
  posts: postsReducer,
  groups: groupsReducer,
  setting: settingReducer,
  chat: chatReducer,
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
    }).concat([
      authApi.middleware,
      usersApi.middleware,
      postsApi.middleware,
      consultantsApi.middleware,
      appointmentApi.middleware,
      availabilityApi.middleware,
      workApi.middleware,
    ]),
  devTools: __DEV__,
});

// Persistor for Redux Persist
export const persistor = persistStore(store);

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Setup listeners for RTK Query
setupListeners(store.dispatch);