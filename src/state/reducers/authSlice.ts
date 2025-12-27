import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../utils/ParamList';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authTrigger?: boolean;
  authBlocked?: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  authTrigger: false,
  authBlocked: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthTrigger: (state, action: PayloadAction<{ trigger: boolean }>) => {
      state.authTrigger = action.payload.trigger;
    },
    setAuthBlocked: (state, action: PayloadAction<{ value: boolean }>) => {
      state.authBlocked = action.payload.value;
    },
  },
});

export const { setCredentials, logout, setLoading, setAuthTrigger, setAuthBlocked } = authSlice.actions;
export default authSlice.reducer;