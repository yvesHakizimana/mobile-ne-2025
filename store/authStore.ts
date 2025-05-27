import { create } from 'zustand';
import authService from '../services/authService';
import { LoginCredentials, User } from '../types/auth.types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const user = await authService.login(credentials);
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
  
  logout: async () => {
    set({ isLoading: true });
    
    try {
      await authService.logout();
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
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
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },
}));