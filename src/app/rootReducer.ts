// Root reducer combining all feature slices

import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  // Add other feature reducers here as they're created
  // e.g.:
  // jobs: jobsReducer,
  // candidates: candidatesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;