import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import expenseService from '../services/expenseService';
import { ApiError, ApiErrorType } from '../services/apiService';
import { Expense, CreateExpenseData } from '../types/expense.types';

interface ExpenseState {
  expenses: Expense[];
  currentExpense: Expense | null;
  isLoading: boolean;
  error: string | null;
  errorType: ApiErrorType | null;
  isOffline: boolean;
  pendingOperations: PendingOperation[];
  lastSyncTime: string | null;
  
  // Actions
  fetchExpenses: (userId?: string) => Promise<void>;
  fetchExpenseById: (id: string) => Promise<void>;
  createExpense: (expense: CreateExpenseData) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;
  syncPendingOperations: () => Promise<void>;
  setOfflineMode: (offline: boolean) => void;
  clearError: () => void;
  clearCurrentExpense: () => void;
  retryFailedOperation: () => Promise<void>;
  loadPendingOperations: () => Promise<void>;
  retryLastOperation: () => Promise<void>;
}

interface PendingOperation {
  id: string;
  type: 'CREATE' | 'DELETE' | 'UPDATE';
  data: any;
  timestamp: number;
  retryCount?: number;
}

const PENDING_OPERATIONS_KEY = 'pending_operations';
const LAST_SYNC_KEY = 'last_sync_time';
const EXPENSES_CACHE_KEY = 'cached_expenses';

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  currentExpense: null,
  isLoading: false,
  error: null,
  errorType: null,
  isOffline: false,
  pendingOperations: [],
  lastSyncTime: null,

  setOfflineMode: (offline: boolean) => {
    set({ isOffline: offline });
    
    // Load pending operations when going offline
    if (offline) {
      get().loadPendingOperations();
    }
  },

  clearError: () => {
    set({ error: null, errorType: null });
  },

  clearCurrentExpense: () => {
    set({ currentExpense: null });
  },

  loadPendingOperations: async () => {
    try {
      const pendingOpsJson = await AsyncStorage.getItem(PENDING_OPERATIONS_KEY);
      const lastSyncJson = await AsyncStorage.getItem(LAST_SYNC_KEY);
      
      if (pendingOpsJson) {
        const pendingOps = JSON.parse(pendingOpsJson);
        set({ pendingOperations: pendingOps });
      }
      
      if (lastSyncJson) {
        set({ lastSyncTime: lastSyncJson });
      }
    } catch (error) {
      console.warn('Failed to load pending operations:', error);
    }
  },

  fetchExpenses: async (userId?: string) => {
    const { expenses: currentExpenses } = get();
    
    // Only show loading if we don't have cached data
    if (currentExpenses.length === 0) {
      set({ isLoading: true, error: null, errorType: null });
    } else {
      set({ error: null, errorType: null });
    }
    
    try {
      let expenses: Expense[];
      
      if (userId) {
        expenses = await expenseService.getExpensesByUserId(userId);
      } else {
        expenses = await expenseService.getAllExpenses();
      }
      
      // Cache the successful response
      await AsyncStorage.setItem(EXPENSES_CACHE_KEY, JSON.stringify(expenses));
      
      set({ 
        expenses, 
        isLoading: false,
        lastSyncTime: new Date().toISOString(),
        error: null,
        errorType: null
      });
      
      // Save sync time
      await AsyncStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
      
    } catch (error: any) {
      const apiError = error as ApiError;
      
      // Try to load cached data first
      try {
        const cachedExpenses = await AsyncStorage.getItem(EXPENSES_CACHE_KEY);
        if (cachedExpenses && currentExpenses.length === 0) {
          const parsedExpenses = JSON.parse(cachedExpenses);
          set({ expenses: parsedExpenses });
        }
      } catch (cacheError) {
        console.warn('Failed to load cached expenses:', cacheError);
      }
      
      let errorMessage = apiError.message;
      let showError = true;
      
      switch (apiError.type) {
        case ApiErrorType.NETWORK_ERROR:
          if (currentExpenses.length > 0) {
            errorMessage = 'Unable to refresh. Showing cached data.';
          } else {
            errorMessage = 'No internet connection. Please check your network.';
          }
          set({ isOffline: true });
          break;
          
        case ApiErrorType.SERVER_ERROR:
          errorMessage = 'Server temporarily unavailable. Please try again.';
          break;
          
        case ApiErrorType.TIMEOUT:
          errorMessage = 'Request timed out. Please check your connection.';
          break;
          
        case ApiErrorType.UNAUTHORIZED:
          errorMessage = 'Session expired. Please log in again.';
          break;
          
        default:
          errorMessage = apiError.message || 'Failed to load expenses.';
      }
      
      set({ 
        error: errorMessage,
        errorType: apiError.type,
        isLoading: false
      });
    }
  },

  fetchExpenseById: async (id: string) => {
    set({ isLoading: true, error: null, errorType: null });
    
    try {
      const expense = await expenseService.getExpenseById(id);
      set({ currentExpense: expense, isLoading: false });
    } catch (error: any) {
      const apiError = error as ApiError;
      
      // Try to find the expense in local state if API fails
      const { expenses } = get();
      const localExpense = expenses.find(exp => exp.id === id);
      
      if (localExpense) {
        set({ 
          currentExpense: localExpense, 
          isLoading: false,
          error: 'Showing cached data (offline)',
          errorType: ApiErrorType.NETWORK_ERROR
        });
      } else {
        let errorMessage = 'Failed to load expense details.';
        
        switch (apiError.type) {
          case ApiErrorType.NETWORK_ERROR:
            errorMessage = 'No internet connection. Unable to load expense.';
            break;
          case ApiErrorType.NOT_FOUND:
            errorMessage = 'Expense not found.';
            break;
          case ApiErrorType.SERVER_ERROR:
            errorMessage = 'Server error. Please try again.';
            break;
        }
        
        set({ 
          error: errorMessage,
          errorType: apiError.type,
          isLoading: false 
        });
      }
    }
  },

  createExpense: async (expenseData: CreateExpenseData) => {
    const { isOffline, pendingOperations } = get();
    
    // Clear any previous errors
    set({ error: null, errorType: null });
    
    if (isOffline) {
      // Store operation for later sync
      const pendingOp: PendingOperation = {
        id: Date.now().toString(),
        type: 'CREATE',
        data: expenseData,
        timestamp: Date.now(),
        retryCount: 0,
      };
      
      const newPendingOps = [...pendingOperations, pendingOp];
      set({ pendingOperations: newPendingOps });
      
      // Save to local storage
      await AsyncStorage.setItem(PENDING_OPERATIONS_KEY, JSON.stringify(newPendingOps));
      
      // Add optimistically to local state
      const tempExpense: Expense = {
        ...expenseData,
        id: pendingOp.id,
        createdAt: new Date().toISOString(),
      };
      
      set(state => ({
        expenses: [tempExpense, ...state.expenses]
      }));
      
      return true;
    }

    set({ isLoading: true });
    
    try {
      const newExpense = await expenseService.createExpense(expenseData);
      
      set(state => ({
        expenses: [newExpense, ...state.expenses],
        isLoading: false
      }));
      
      // Update cache
      const { expenses } = get();
      await AsyncStorage.setItem(EXPENSES_CACHE_KEY, JSON.stringify(expenses));
      
      return true;
    } catch (error: any) {
      const apiError = error as ApiError;
      
      // If it's a network error, store for offline sync
      if (apiError.type === ApiErrorType.NETWORK_ERROR) {
        set({ isOffline: true, isLoading: false });
        return await get().createExpense(expenseData); // Retry as offline operation
      }
      
      let errorMessage = 'Failed to create expense.';
      
      switch (apiError.type) {
        case ApiErrorType.VALIDATION_ERROR:
          errorMessage = 'Invalid expense data. Please check your input.';
          break;
        case ApiErrorType.SERVER_ERROR:
          errorMessage = 'Server error. Please try again.';
          break;
        case ApiErrorType.UNAUTHORIZED:
          errorMessage = 'Session expired. Please log in again.';
          break;
      }
      
      set({ 
        error: errorMessage,
        errorType: apiError.type,
        isLoading: false 
      });
      return false;
    }
  },

  deleteExpense: async (id: string) => {
    const { isOffline, pendingOperations } = get();
    
    // Clear any previous errors
    set({ error: null, errorType: null });
    
    if (isOffline) {
      // Store operation for later sync
      const pendingOp: PendingOperation = {
        id: Date.now().toString(),
        type: 'DELETE',
        data: { id },
        timestamp: Date.now(),
        retryCount: 0,
      };
      
      const newPendingOps = [...pendingOperations, pendingOp];
      set({ pendingOperations: newPendingOps });
      
      await AsyncStorage.setItem(PENDING_OPERATIONS_KEY, JSON.stringify(newPendingOps));
      
      // Remove optimistically from local state
      set(state => ({
        expenses: state.expenses.filter(expense => expense.id !== id)
      }));
      
      return true;
    }

    set({ isLoading: true });
    
    try {
      await expenseService.deleteExpense(id);
      
      set(state => ({
        expenses: state.expenses.filter(expense => expense.id !== id),
        isLoading: false
      }));
      
      // Update cache
      const { expenses } = get();
      await AsyncStorage.setItem(EXPENSES_CACHE_KEY, JSON.stringify(expenses));
      
      return true;
    } catch (error: any) {
      const apiError = error as ApiError;
      
      // If it's a network error, store for offline sync
      if (apiError.type === ApiErrorType.NETWORK_ERROR) {
        set({ isOffline: true, isLoading: false });
        return await get().deleteExpense(id); // Retry as offline operation
      }
      
      let errorMessage = 'Failed to delete expense.';
      
      switch (apiError.type) {
        case ApiErrorType.NOT_FOUND:
          errorMessage = 'Expense not found or already deleted.';
          // Remove from local state even if server says not found
          set(state => ({
            expenses: state.expenses.filter(expense => expense.id !== id)
          }));
          break;
        case ApiErrorType.SERVER_ERROR:
          errorMessage = 'Server error. Please try again.';
          break;
        case ApiErrorType.UNAUTHORIZED:
          errorMessage = 'Session expired. Please log in again.';
          break;
      }
      
      set({ 
        error: errorMessage,
        errorType: apiError.type,
        isLoading: false 
      });
      return false;
    }
  },

  syncPendingOperations: async () => {
    const { pendingOperations } = get();
    if (pendingOperations.length === 0) return;

    set({ isLoading: true, error: null, errorType: null });
    
    const failedOperations: PendingOperation[] = [];
    let successCount = 0;
    
    for (const operation of pendingOperations) {
      try {
        switch (operation.type) {
          case 'CREATE':
            await expenseService.createExpense(operation.data);
            successCount++;
            break;
          case 'DELETE':
            await expenseService.deleteExpense(operation.data.id);
            successCount++;
            break;
        }
      } catch (error: any) {
        console.warn('Failed to sync operation:', operation, error);
        
        const apiError = error as ApiError;
        
        // Don't retry certain types of errors
        if (apiError.type === ApiErrorType.NOT_FOUND || 
            apiError.type === ApiErrorType.VALIDATION_ERROR) {
          continue; // Skip this operation, don't add to failed list
        }
        
        // Retry failed operations up to 3 times
        const retryCount = (operation.retryCount || 0) + 1;
        if (retryCount < 3) {
          failedOperations.push({
            ...operation,
            retryCount
          });
        }
      }
    }
    
    // Update pending operations with only failed ones
    set({ pendingOperations: failedOperations });
    await AsyncStorage.setItem(PENDING_OPERATIONS_KEY, JSON.stringify(failedOperations));
    
    // Refresh data to get latest from server
    await get().fetchExpenses();
    
    // Set appropriate message based on results
    if (failedOperations.length > 0) {
      set({ 
        error: `${successCount} operations synced successfully. ${failedOperations.length} failed and will be retried.`,
        errorType: ApiErrorType.NETWORK_ERROR,
        isLoading: false 
      });
    } else if (successCount > 0) {
      // Clear offline mode if sync was successful
      set({ 
        isLoading: false,
        isOffline: false 
      });
    } else {
      set({ isLoading: false });
    }
  },

  retryFailedOperation: async () => {
    await get().syncPendingOperations();
  },

  retryLastOperation: async () => {
    const { errorType } = get();
    
    // Clear error before retrying
    set({ error: null, errorType: null });
    
    // Retry the appropriate operation based on error context
    if (errorType === ApiErrorType.NETWORK_ERROR) {
      await get().fetchExpenses();
    }
  },
}));