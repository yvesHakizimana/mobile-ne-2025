export interface Expense {
  id: string;
  createdAt: string;
  name?: string;
  amount: number | string;
  description: string;
  category?: string;
  date?: string;
  userId?: string;
  title?: string;
  note?: string;
}

export interface CreateExpenseData {
  amount: number | string;
  description: string;
  category: string;
  date: string;
  userId: string;
  name?: string;
}

export interface ExpenseFormData {
  amount: string;
  description: string;
  category: string;
  date: string;
}