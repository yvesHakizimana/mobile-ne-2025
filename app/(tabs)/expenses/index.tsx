import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    Alert,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ExpenseList } from '../../../components/expenses/ExpenseList';
import { useAuthStore } from '../../../store/authStore';
import { useExpenseStore } from '../../../store/expenseStore';

export default function ExpensesScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    expenses, 
    fetchExpenses, 
    deleteExpense, 
    isLoading, 
    error 
  } = useExpenseStore();

  useEffect(() => {
    if (user) {
      fetchExpenses(user.id);
    }
  }, [user, fetchExpenses]);

  const handleRefresh = async () => {
    if (user) {
      await fetchExpenses(user.id);
    }
  };

  const handleExpensePress = (expense: any) => {
    router.push(`/expenses/${expense.id}`);
  };

  const handleExpenseDelete = async (expenseId: string) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteExpense(expenseId);
            if (success) {
              Alert.alert('Success', 'Expense deleted successfully');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row justify-between items-center px-6 py-4">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Expenses</Text>
            <Text className="text-gray-500 text-sm">
              {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'} total
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/expenses/new')}
            className="bg-primary-600 p-3 rounded-full shadow-sm"
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Expenses List */}
      <ExpenseList
        expenses={expenses}
        isLoading={isLoading}
        error={error}
        onRefresh={handleRefresh}
        onExpensePress={handleExpensePress}
        onExpenseDelete={handleExpenseDelete}
        emptyMessage="No expenses found. Start by adding your first expense!"
      />
    </SafeAreaView>
  );
}