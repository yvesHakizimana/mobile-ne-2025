import api from '../config/axios.config';
import { API_ENDPOINTS } from '../config/constants';
import { CreateExpenseData, Expense } from '../types/expense.types';
import apiService, { ApiError, ApiErrorType } from './apiService';

class ExpenseService {
  async getAllExpenses(): Promise<Expense[]> {
    try {
      // Use the enhanced API service instead of direct axios
      const expenses = await apiService.getExpenses();
      return expenses || [];
    } catch (error: any) {
      const apiError = error as ApiError;
      
      // Log for debugging but let the enhanced error bubble up
      console.error('Get expenses error:', {
        type: apiError.type,
        message: apiError.message,
        status: apiError.status
      });
      
      // Rethrow the enhanced error for the store to handle
      throw apiError;
    }
  }
  
  async getExpenseById(id: string): Promise<Expense> {
    try {
      // Use enhanced API service with fallback to cached data
      const response = await apiService.makeRequestWithRetry(
        () => api.get(API_ENDPOINTS.EXPENSE_BY_ID(id), { timeout: 10000 }),
        `expense_${id}` // Cache individual expenses
      );
      return response;
    } catch (error: any) {
      const apiError = error as ApiError;
      console.error('Get expense by ID error:', apiError);
      throw apiError;
    }
  }
  
  async createExpense(data: CreateExpenseData): Promise<Expense> {
    try {
      const expenseData = {
        ...data,
        createdAt: new Date().toISOString(),
      };
      
      const newExpense = await apiService.createExpense(expenseData);
      return newExpense;
    } catch (error: any) {
      const apiError = error as ApiError;
      console.error('Create expense error:', apiError);
      throw apiError;
    }
  }
  
  async deleteExpense(id: string): Promise<void> {
    try {
      await apiService.deleteExpense(id);
    } catch (error: any) {
      const apiError = error as ApiError;
      console.error('Delete expense error:', apiError);
      throw apiError;
    }
  }
  
  async getExpensesByUserId(userId: string): Promise<Expense[]> {
    try {
      const allExpenses = await this.getAllExpenses();
      return allExpenses.filter(expense => expense.userId === userId);
    } catch (error: any) {
      const apiError = error as ApiError;
      console.error('Get user expenses error:', apiError);
      throw apiError;
    }
  }
}

export default new ExpenseService();