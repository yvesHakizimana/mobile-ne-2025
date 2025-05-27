import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios, { AxiosError, AxiosResponse } from 'axios';

// API Error Types
export enum ApiErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN = 'UNKNOWN',
}

export interface ApiError {
  type: ApiErrorType;
  message: string;
  status?: number;
  originalError?: any;
}

// Cache keys
const CACHE_KEYS = {
  EXPENSES: 'cached_expenses',
  USER: 'cached_user',
} as const;

class ApiService {
  private baseURL = 'https://67ac71475853dfff53dab929.mockapi.io/api/v1';
  private retryCount = 3;
  private retryDelay = 1000; // 1 second

  constructor() {
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    axios.interceptors.request.use(
      async (config) => {
        // Check network connectivity before making request
        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          throw new Error('No internet connection');
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  private handleApiError(error: AxiosError): ApiError {
    if (!error.response) {
      // Network error or no response
      if (error.code === 'ECONNABORTED') {
        return {
          type: ApiErrorType.TIMEOUT,
          message: 'Request timed out. Please try again.',
          originalError: error,
        };
      }
      return {
        type: ApiErrorType.NETWORK_ERROR,
        message: 'Network error. Please check your connection and try again.',
        originalError: error,
      };
    }

    const status = error.response.status;
    
    switch (status) {
      case 401:
        return {
          type: ApiErrorType.UNAUTHORIZED,
          message: 'Unauthorized. Please login again.',
          status,
          originalError: error,
        };
      case 404:
        return {
          type: ApiErrorType.NOT_FOUND,
          message: 'Requested resource not found.',
          status,
          originalError: error,
        };
      case 422:
        return {
          type: ApiErrorType.VALIDATION_ERROR,
          message: 'Invalid data provided.',
          status,
          originalError: error,
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: ApiErrorType.SERVER_ERROR,
          message: 'Server error. Please try again later.',
          status,
          originalError: error,
        };
      default:
        return {
          type: ApiErrorType.UNKNOWN,
          message: 'Something went wrong. Please try again.',
          status,
          originalError: error,
        };
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequestWithRetry<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    cacheKey?: string
  ): Promise<T> {
    let lastError: ApiError | null = null;

    for (let attempt = 1; attempt <= this.retryCount; attempt++) {
      try {
        const response = await requestFn();
        
        // Cache successful response if cache key provided
        if (cacheKey && response.data) {
          await this.cacheData(cacheKey, response.data);
        }
        
        return response.data;
      } catch (error: any) {
        lastError = error as ApiError;
        
        // Don't retry on certain error types
        if (
          lastError.type === ApiErrorType.UNAUTHORIZED ||
          lastError.type === ApiErrorType.NOT_FOUND ||
          lastError.type === ApiErrorType.VALIDATION_ERROR
        ) {
          break;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < this.retryCount) {
          await this.sleep(this.retryDelay * Math.pow(2, attempt - 1));
        }
      }
    }

    // If all retries failed, try to return cached data
    if (cacheKey) {
      const cachedData = await this.getCachedData<T>(cacheKey);
      if (cachedData) {
        console.warn('API failed, returning cached data');
        return cachedData;
      }
    }

    throw lastError;
  }

  private async cacheData<T>(key: string, data: T): Promise<void> {
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheEntry));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }

  private async getCachedData<T>(key: string, maxAge: number = 5 * 60 * 1000): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) return null;

      const cacheEntry = JSON.parse(cached);
      const isExpired = Date.now() - cacheEntry.timestamp > maxAge;
      
      if (isExpired) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return cacheEntry.data;
    } catch (error) {
      console.warn('Failed to get cached data:', error);
      return null;
    }
  }

  // API Methods
  async getExpenses(): Promise<any[]> {
    return this.makeRequestWithRetry(
      () => axios.get(`${this.baseURL}/expenses`, { timeout: 10000 }),
      CACHE_KEYS.EXPENSES
    );
  }

  async createExpense(data: any): Promise<any> {
    return this.makeRequestWithRetry(
      () => axios.post(`${this.baseURL}/expenses`, data, { timeout: 10000 })
    );
  }

  async deleteExpense(id: string): Promise<void> {
    return this.makeRequestWithRetry(
      () => axios.delete(`${this.baseURL}/expenses/${id}`, { timeout: 10000 })
    );
  }

  async getUsers(): Promise<any[]> {
    return this.makeRequestWithRetry(
      () => axios.get(`${this.baseURL}/users`, { timeout: 10000 }),
      CACHE_KEYS.USER
    );
  }
}

export default new ApiService();