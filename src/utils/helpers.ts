import Constants from 'expo-constants';
import { withAlphaHex } from 'with-alpha-hex';

// Environment variables from Expo Constants
export const {
  BASE_URL = 'https://api.mangerine.com',
  ENV = 'development',
  APP_ID = 'com.mangerine.app',
  REDUX_KEY = 'mangerine_redux_persist',
  AGORA_APP_ID,
  AGORA_MESSAGE_KEY,
  AGORA_APP_CERTIFICATE,
  STRIPE_PUBLIC_KEY,
} = Constants.expoConfig?.extra || {};

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const addAlpha = (color: string, opacity: number) => {
  return withAlphaHex(color, opacity);
};

export const getUrl = () => {
  return BASE_URL;
};

export const getReduxKey = () => REDUX_KEY;

export const validateEmail = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
};