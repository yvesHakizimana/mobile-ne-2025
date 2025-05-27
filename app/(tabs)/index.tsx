import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Card } from '../../components/common/Card';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { SpendingOverview } from '../../components/dashboard/SpendingOverview';
import { formatPrice } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';
import { useExpenseStore } from '../../store/expenseStore';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { expenses, fetchExpenses, isLoading, error } = useExpenseStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      // Fetch all expenses, not just user-specific ones for demo purposes
      fetchExpenses();
    }
  }, [user, fetchExpenses]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (user) {
      await fetchExpenses();
    }
    setRefreshing(false);
  };

  const getThisMonthExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return expenses.filter(expense => {
      if (!expense.date) return false;
      try {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      } catch (error) {
        console.warn('Invalid date format:', expense.date);
        return false;
      }
    });
  };

  const calculateMonthlyTotal = (expensesList: any[]) => {
    return expensesList.reduce((total, expense) => {
      const amount = typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount;
      if (isNaN(amount)) return total;
      return total + (amount || 0);
    }, 0);
  };

  const thisMonthExpenses = getThisMonthExpenses();
  const thisMonthTotal = calculateMonthlyTotal(thisMonthExpenses);
  const recentExpenses = expenses.slice(0, 5);

  // Debug logging
  console.log('Dashboard Debug:', {
    totalExpenses: expenses.length,
    thisMonthExpenses: thisMonthExpenses.length,
    sampleExpense: expenses[0],
    thisMonthTotal
  });

  if (isLoading && expenses.length === 0) {
    return <LoadingSpinner fullScreen message="Loading dashboard..." />;
  }

  if (error && expenses.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <ErrorMessage
          message={error}
          onRetry={onRefresh}
          variant="fullScreen"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="px-6 py-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-gray-600 text-sm">Welcome back,</Text>
              <Text className="text-gray-900 text-xl font-bold">
                {user?.username?.split('@')[0] || 'User'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={logout}
              className="bg-gray-100 p-3 rounded-full"
            >
              <Ionicons name="log-out" size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Debug Info - Remove this in production */}
        <View className="px-6 mb-4">
          <Card>
            <Text className="text-sm text-gray-600">
              Debug: {expenses.length} total expenses, {thisMonthExpenses.length} this month
            </Text>
          </Card>
        </View>

        {/* Total Balance Card */}
        <View className="px-6 mb-6">
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            className="rounded-2xl p-6"
          >
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-white/80 text-sm mb-2">This Month's Spending</Text>
                <Text className="text-white text-3xl font-bold">
                  {formatPrice(thisMonthTotal)}
                </Text>
                <Text className="text-white/80 text-sm mt-1">
                  {thisMonthExpenses.length} transactions
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/expenses/new')}
                className="bg-white/20 p-3 rounded-full"
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <Text className="text-gray-900 text-lg font-semibold mb-4">
            Quick Actions
          </Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity
              onPress={() => router.push('/expenses/new')}
              className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            >
              <View className="bg-primary-100 w-12 h-12 rounded-full items-center justify-center mb-3">
                <Ionicons name="add" size={24} color="#2563eb" />
              </View>
              <Text className="text-gray-900 font-semibold">Add Expense</Text>
              <Text className="text-gray-500 text-sm">Track new spending</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/expenses')}
              className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            >
              <View className="bg-success-100 w-12 h-12 rounded-full items-center justify-center mb-3">
                <Ionicons name="list" size={24} color="#16a34a" />
              </View>
              <Text className="text-gray-900 font-semibold">View All</Text>
              <Text className="text-gray-500 text-sm">See all expenses</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Expenses */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-900 text-lg font-semibold">
              Recent Expenses
            </Text>
            <TouchableOpacity onPress={() => router.push('/expenses')}>
              <Text className="text-primary-600 font-medium">See All</Text>
            </TouchableOpacity>
          </View>

          {recentExpenses.length > 0 ? (
            <Card padding="none">
              {recentExpenses.map((expense, index) => {
                const amount = typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount;
                const displayAmount = isNaN(amount) ? 0 : amount;
                
                return (
                  <TouchableOpacity
                    key={expense.id}
                    onPress={() => router.push(`/expenses/${expense.id}`)}
                    className={`p-4 ${
                      index !== recentExpenses.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <View className="flex-row justify-between items-center">
                      <View className="flex-1">
                        <Text className="text-gray-900 font-medium mb-1">
                          {expense.description || expense.name || 'Expense'}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                          {expense.category || 'Other'}
                        </Text>
                      </View>
                      <Text className="text-gray-900 font-semibold">
                        {formatPrice(displayAmount)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </Card>
          ) : (
            <Card>
              <View className="items-center py-8">
                <Ionicons name="receipt-outline" size={48} color="#9ca3af" />
                <Text className="text-gray-500 text-center mt-4">
                  No expenses yet. Start by adding your first expense!
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/expenses/new')}
                  className="mt-4 bg-primary-600 px-6 py-3 rounded-lg"
                >
                  <Text className="text-white font-semibold">Add Expense</Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
        </View>

        {/* Spending Overview - Always show if we have ANY expenses */}
        <View className="px-6 mb-6">
          <Text className="text-gray-900 text-lg font-semibold mb-4">
            Spending Overview
          </Text>
          <SpendingOverview expenses={expenses} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}