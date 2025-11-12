// Auth slice with Redux Toolkit

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { mockAuthAPI } from '../../services/mockApi';

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  tokenType: 'Bearer';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

// Async thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await mockAuthAPI.login(credentials);
      
      if (!response.success || !response.data) {
        return rejectWithValue(response.message || 'Login failed');
      }
      
      // Save tokens to localStorage
      localStorage.setItem('tokens', JSON.stringify(response.data.tokens));
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An unexpected error occurred');
    }
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await mockAuthAPI.register(data);
      
      if (!response.success || !response.data) {
        return rejectWithValue(response.message || 'Registration failed');
      }
      
      // Save tokens to localStorage
      localStorage.setItem('tokens', JSON.stringify(response.data.tokens));
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An unexpected error occurred');
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await mockAuthAPI.logout();
      
      // Remove tokens and user from localStorage
      localStorage.removeItem('tokens');
      localStorage.removeItem('user');
      
      return true;
    } catch (error: any) {
      // Still clear local storage even if API call fails
      localStorage.removeItem('tokens');
      localStorage.removeItem('user');
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const validateTokenAsync = createAsyncThunk(
  'auth/validateToken',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await mockAuthAPI.validateToken(token);
      
      if (!response.success || !response.data) {
        return rejectWithValue(response.message || 'Token validation failed');
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Token validation failed');
    }
  }
);

// Initial state
const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    
    clearAuth: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('tokens');
      localStorage.removeItem('user');
    },
    
    initializeAuth: (state) => {
      state.isLoading = true;
      
      try {
        // Try to restore auth from localStorage
        const tokensString = localStorage.getItem('tokens');
        const userString = localStorage.getItem('user');
        
        if (tokensString && userString) {
          const tokens = JSON.parse(tokensString);
          const user = JSON.parse(userString);
          const expiresAt = new Date(tokens.expiresAt);
          
          if (expiresAt > new Date()) {
            state.tokens = tokens;
            state.user = user;
            state.isAuthenticated = true;
          } else {
            // Token expired
            localStorage.removeItem('tokens');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        // Clear corrupted data
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
      }
      
      state.isLoading = false;
      state.isInitialized = true;
    },
    
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    }
  },
  
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Still clear auth state even if logout fails
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
      });

    // Token validation
    builder
      .addCase(validateTokenAsync.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(validateTokenAsync.rejected, (state) => {
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
      });
  },
});

export const { clearError, clearAuth, initializeAuth, updateUser } = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectIsInitialized = (state: { auth: AuthState }) => state.auth.isInitialized;
export const selectUserPermissions = (state: { auth: AuthState }) => state.auth.user?.permissions || [];
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role;

export default authSlice.reducer;