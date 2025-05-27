export const API_ENDPOINTS = {
  USERS: '/users',
  USER_BY_USERNAME: (username: string) => `/users?username=${username}`,
  EXPENSES: '/expenses',
  EXPENSE_BY_ID: (id: string) => `/expenses/${id}`,
};

export const EXPENSE_CATEGORIES = [
  'Food',
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Housing',
  'Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Clothes',
  'Other',
];

export const STORAGE_KEYS = {
  USER: 'user_data',
  AUTH_TOKEN: 'auth_token',
  EXPENSES_CACHE: 'expenses_cache',
};