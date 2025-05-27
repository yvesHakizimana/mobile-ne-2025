import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ExpenseForm } from '../../../components/expenses/ExpenseForm';
import { useAuthStore } from '../../../store/authStore';
import { useExpenseStore } from '../../../store/expenseStore';
import { ExpenseFormData } from '../../../types/expense.types';

export default function NewExpenseScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { createExpense, isLoading } = useExpenseStore();

  const handleSubmit = async (formData: ExpenseFormData) => {
    if (!user) {
      Alert.alert('Error', 'User not found. Please login again.');
      return;
    }

    const expenseData = {
      amount: parseFloat(formData.amount),
      description: formData.description,
      category: formData.category,
      date: formData.date,
      userId: user.id,
      name: formData.description, // Use description as name
    };

    const success = await createExpense(expenseData);
    
    if (success) {
      Alert.alert(
        'Success',
        'Expense added successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row items-center px-6 py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 p-2 -ml-2 rounded-full"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900">Add Expense</Text>
            <Text className="text-gray-500 text-sm">Track your spending</Text>
          </View>
        </View>
      </View>

      {/* Form */}
      <ExpenseForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitButtonText="Add Expense"
      />
    </SafeAreaView>
  );
}