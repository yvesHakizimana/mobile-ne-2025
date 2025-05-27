import { create } from 'zustand';
import { ApiError, ApiErrorType } from '../services/apiService';
import authService from '../services/authService';
import { LoginCredentials, User } from '../types/auth.types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isOffline: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  setOfflineMode: (offline: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isOffline: false,
  
  setOfflineMode: (offline: boolean) => {
    set({ isOffline: offline });
  },
  
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const user = await authService.login(credentials);
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
      return true;
    } catch (error: any) {
      const apiError = error as ApiError;
      
      let errorMessage = apiError.message;
      
      switch (apiError.type) {
        case ApiErrorType.NETWORK_ERROR:
          errorMessage = 'No internet connection. Please check your network and try again.';
          break;
        case ApiErrorType.UNAUTHORIZED:
          errorMessage = 'Invalid email or password. Please try again.';
          break;
        case ApiErrorType.NOT_FOUND:
          errorMessage = 'Account not found. Please check your email address.';
          break;
        case ApiErrorType.SERVER_ERROR:
          errorMessage = 'Server error. Please try again later.';
          break;
        case ApiErrorType.TIMEOUT:
          errorMessage = 'Login timed out. Please try again.';
          break;
        default:
          errorMessage = 'Login failed. Please try again.';
      }
      
      set({ 
        error: errorMessage, 
        isLoading: false,
        isAuthenticated: false,
        user: null
      });
      return false;
    }
  },
  
  logout: async () => {
    set({ isLoading: true });
    
    try {
      await authService.logout();
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: null 
      });
    } catch (error: any) {
      const apiError = error as ApiError;
      set({ 
        error: apiError.message, 
        isLoading: false 
      });
    }
  },
  
  clearError: () => set({ error: null }),
  
  initializeAuth: async () => {
    set({ isLoading: true });
    
    try {
      const user = await authService.getCurrentUser();
      set({ 
        user, 
        isAuthenticated: !!user, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },
  
  refreshUserData: async () => {
    const { user, isOffline } = get();
    
    if (!user || isOffline) return;
    
    try {
      const refreshedUser = await authService.refreshUserData(user.id);
      if (refreshedUser) {
        set({ user: refreshedUser });
      }
    } catch (error) {
      console.warn('Failed to refresh user data:', error);
      // Don't set error state for background refresh failures
    }
  },
}));