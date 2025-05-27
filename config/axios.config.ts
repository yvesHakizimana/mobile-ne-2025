import axios from 'axios';
import { Alert } from 'react-native';
import { fallbackData } from '../data/fallbackData';

const BASE_URL = 'https://67ac71475853dfff53dab929.mockapi.io/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with fallback data
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response ${response.status}:`, response.data);
    return response;
  },
  async (error) => {
    console.error('API Error:', error.message);
    
    // Handle network errors with fallback data
    if (error.message === 'Network Error' || !error.response) {
      console.log('🔄 Using fallback data due to network error');
      
      const endpoint = error.config.url.replace(BASE_URL, '').split('?')[0];
      
      // Return appropriate fallback data based on endpoint
      if (endpoint.includes('/users')) {
        if (error.config.url.includes('username=')) {
          const username = error.config.url.split('username=')[1];
          const user = fallbackData.users.find(u => u.username === username);
          return { data: user ? [user] : [] };
        }
        return { data: fallbackData.users };
      }
      
      if (endpoint.includes('/expenses')) {
        const expenseId = endpoint.split('/expenses/')[1];
        if (expenseId) {
          const expense = fallbackData.expenses.find(e => e.id === expenseId);
          return { data: expense || null };
        }
        return { data: fallbackData.expenses };
      }
    }
    
    // Handle specific HTTP errors
    let errorMessage = 'An error occurred. Please try again.';
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = 'Invalid request. Please check your data.';
          break;
        case 401:
          errorMessage = 'Authentication failed. Please login again.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Error: ${error.response.status}`;
      }
    }
    
    Alert.alert('Error', errorMessage);
    return Promise.reject(error);
  }
);

export default api;