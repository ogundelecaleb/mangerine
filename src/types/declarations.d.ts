// TypeScript declarations for the app

declare module '*.png' {
  const value: any;
  export = value;
}

declare module '*.jpg' {
  const value: any;
  export = value;
}

declare module '*.jpeg' {
  const value: any;
  export = value;
}

declare module '*.svg' {
  const value: any;
  export = value;
}

// Environment variables (will be added later)
declare module '@env' {
  export const BASE_URL: string;
  export const ENV: string;
  export const APP_ID: string;
  export const REDUX_KEY: string;
  export const AGORA_APP_ID: string;
  export const AGORA_MESSAGE_KEY: string;
  export const AGORA_APP_CERTIFICATE: string;
  export const STRIPE_PUBLIC_KEY: string;
}