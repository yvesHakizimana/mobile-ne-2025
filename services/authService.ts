import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/axios.config';
import { API_ENDPOINTS, STORAGE_KEYS } from '../config/constants';
import { LoginCredentials, User } from '../types/auth.types';
import apiService, { ApiError, ApiErrorType } from './apiService';

class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      // Use enhanced API service for user lookup
      const users = await apiService.makeRequestWithRetry(
        () => api.get(API_ENDPOINTS.USER_BY_USERNAME(credentials.username), { timeout: 10000 }),
        `user_${credentials.username}`
      );
      
      if (!users || users.length === 0) {
        throw {
          type: ApiErrorType.NOT_FOUND,
          message: 'User not found. Please check your username.',
          status: 404
        } as ApiError;
      }
      
      const user = users[0];
      
      if (user.password !== credentials.password) {
        throw {
          type: ApiErrorType.UNAUTHORIZED,
          message: 'Invalid password. Please try again.',
          status: 401
        } as ApiError;
      }
      
      // Store user data
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // If it's already an ApiError, rethrow it
      if (error.type) {
        throw error;
      }
      
      // Otherwise, wrap it in an ApiError
      throw {
        type: ApiErrorType.UNKNOWN,
        message: error.message || 'Login failed. Please try again.',
        originalError: error
      } as ApiError;
    }
  }
  
  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.EXPENSES_CACHE,
        // Clear cached data from enhanced API service
        'cached_expenses',
        'cached_user',
        'pending_operations',
      ]);
    } catch (error) {
      console.error('Logout error:', error);
      throw {
        type: ApiErrorType.UNKNOWN,
        message: 'Failed to logout completely. Some data may persist.',
        originalError: error
      } as ApiError;
    }
  }
  
  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
  
  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user !== null;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }
  
  // New method to refresh user data with network handling
  async refreshUserData(userId: string): Promise<User | null> {
    try {
      const users = await apiService.getUsers();
      const user = users.find(u => u.id === userId);
      
      if (user) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        return user;
      }
      
      return null;
    } catch (error: any) {
      console.warn('Failed to refresh user data:', error);
      // Return cached user data if refresh fails
      return await this.getCurrentUser();
    }
  }
}

export default new AuthService();