import { create } from 'zustand';
import expenseService from '../services/expenseService';
import { CreateExpenseData, Expense } from '../types/expense.types';

interface ExpenseStore {
  expenses: Expense[];
  currentExpense: Expense | null;
  isLoading: boolean;
  error: string | null;
  fetchExpenses: (userId?: string) => Promise<void>;
  fetchExpenseById: (id: string) => Promise<void>;
  createExpense: (data: CreateExpenseData) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearCurrentExpense: () => void;
}

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  expenses: [],
  currentExpense: null,
  isLoading: false,
  error: null,
  
  fetchExpenses: async (userId?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const expenses = userId 
        ? await expenseService.getExpensesByUserId(userId)
        : await expenseService.getAllExpenses();
      
      set({ expenses, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchExpenseById: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const expense = await expenseService.getExpenseById(id);
      set({ currentExpense: expense, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  createExpense: async (data: CreateExpenseData) => {
    set({ isLoading: true, error: null });
    
    try {
      const newExpense = await expenseService.createExpense(data);
      set(state => ({ 
        expenses: [newExpense, ...state.expenses], 
        isLoading: false 
      }));
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
  
  deleteExpense: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await expenseService.deleteExpense(id);
      set(state => ({ 
        expenses: state.expenses.filter(expense => expense.id !== id),
        isLoading: false 
      }));
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
  
  clearError: () => set({ error: null }),
  clearCurrentExpense: () => set({ currentExpense: null }),
}));