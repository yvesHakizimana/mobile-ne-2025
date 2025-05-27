import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/axios.config';
import { API_ENDPOINTS, STORAGE_KEYS } from '../config/constants';
import { LoginCredentials, User } from '../types/auth.types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await api.get(API_ENDPOINTS.USER_BY_USERNAME(credentials.username));
      const users = response.data;
      
      if (!users || users.length === 0) {
        throw new Error('User not found');
      }
      
      const user = users[0];
      
      if (user.password !== credentials.password) {
        throw new Error('Invalid password');
      }
      
      // Store user data
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  }
  
  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.EXPENSES_CACHE,
      ]);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
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
    const user = await this.getCurrentUser();
    return user !== null;
  }
}

export default new AuthService();