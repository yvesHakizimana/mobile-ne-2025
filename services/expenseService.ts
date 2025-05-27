import api from '../config/axios.config';
import { API_ENDPOINTS } from '../config/constants';
import { CreateExpenseData, Expense } from '../types/expense.types';

class ExpenseService {
  async getAllExpenses(): Promise<Expense[]> {
    try {
      const response = await api.get(API_ENDPOINTS.EXPENSES);
      return response.data || [];
    } catch (error: any) {
      console.error('Get expenses error:', error);
      throw new Error('Failed to fetch expenses');
    }
  }
  
  async getExpenseById(id: string): Promise<Expense> {
    try {
      const response = await api.get(API_ENDPOINTS.EXPENSE_BY_ID(id));
      return response.data;
    } catch (error: any) {
      console.error('Get expense by ID error:', error);
      throw new Error('Failed to fetch expense details');
    }
  }
  
  async createExpense(data: CreateExpenseData): Promise<Expense> {
    try {
      const response = await api.post(API_ENDPOINTS.EXPENSES, {
        ...data,
        createdAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error: any) {
      console.error('Create expense error:', error);
      throw new Error('Failed to create expense');
    }
  }
  
  async deleteExpense(id: string): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.EXPENSE_BY_ID(id));
    } catch (error: any) {
      console.error('Delete expense error:', error);
      throw new Error('Failed to delete expense');
    }
  }
  
  async getExpensesByUserId(userId: string): Promise<Expense[]> {
    try {
      const allExpenses = await this.getAllExpenses();
      return allExpenses.filter(expense => expense.userId === userId);
    } catch (error: any) {
      console.error('Get user expenses error:', error);
      throw new Error('Failed to fetch user expenses');
    }
  }
}

export default new ExpenseService();