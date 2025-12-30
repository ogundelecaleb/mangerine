import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistPartial } from 'redux-persist/es/persistReducer';


import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import API services
import { authApi } from './services/auth.service';
import { usersApi } from './services/users.service';
import { postsApi } from './services/posts.service';
import { consultantsApi } from './services/consultants.service';
import { appointmentApi } from './services/appointment.service';
import { availabilityApi } from './services/availability.service';
import { workApi } from './services/work.service';
import { educationApi } from './services/education.service copy';
import { experienceApi } from './services/experience.service';

// Import reducers
import user from './reducers/user.reducer';
import usersettings from './reducers/usersettings.reducer';
import setting from './reducers/setting.reducer';
import posts from './reducers/posts.reducer';
import groups from './reducers/groups.reducer';
import chat from './reducers/chat.reducer';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['user', 'usersettings', 'chat'],
};

const reducers = combineReducers({
  user,
  usersettings,
  posts,
  groups,
  setting,
  chat,
  [authApi.reducerPath]: authApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [postsApi.reducerPath]: postsApi.reducer,
  [consultantsApi.reducerPath]: consultantsApi.reducer,
  [appointmentApi.reducerPath]: appointmentApi.reducer,
  [availabilityApi.reducerPath]: availabilityApi.reducer,
  [workApi.reducerPath]: workApi.reducer,
  [educationApi.reducerPath]: educationApi.reducer,
  [experienceApi.reducerPath]: experienceApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([
      authApi.middleware,
      usersApi.middleware,
      postsApi.middleware,
      consultantsApi.middleware,
      appointmentApi.middleware,
      availabilityApi.middleware,
      workApi.middleware,
      educationApi.middleware,
      experienceApi.middleware,
    ]),
});

export const persistor = persistStore(store);

export type Root = ReturnType<typeof store.getState>;
export type RootState = Root & PersistPartial;
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);