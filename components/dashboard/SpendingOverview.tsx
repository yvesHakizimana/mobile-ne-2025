import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { formatPrice } from '../../lib/utils';
import { Expense } from '../../types/expense.types';
import { Card } from '../common/Card';

interface SpendingOverviewProps {
  expenses: Expense[];
  period?: 'week' | 'month' | 'year';
}

export function SpendingOverview({ expenses, period = 'month' }: SpendingOverviewProps) {
  console.log('SpendingOverview received expenses:', expenses?.length || 0);
  
  // Early return if no expenses
  if (!expenses || expenses.length === 0) {
    return (
      <Card>
        <View className="items-center py-8">
          <View className="bg-gray-100 w-16 h-16 rounded-full items-center justify-center mb-4">
            <Ionicons name="analytics" size={32} color="#6b7280" />
          </View>
          <Text className="text-gray-500 text-center text-base">
            No spending data available
          </Text>
          <Text className="text-gray-400 text-center text-sm mt-2">
            Add some expenses to see your spending analytics
          </Text>
        </View>
      </Card>
    );
  }

  // Process expenses and validate amounts
  const processedExpenses = expenses.map(expense => {
    let amount = 0;
    if (typeof expense.amount === 'string') {
      amount = parseFloat(expense.amount);
    } else if (typeof expense.amount === 'number') {
      amount = expense.amount;
    }
    
    // Ensure amount is valid
    if (isNaN(amount) || amount < 0) {
      amount = 0;
    }

    return {
      ...expense,
      processedAmount: amount,
      category: expense.category || 'Other'
    };
  }).filter(expense => expense.processedAmount > 0); // Only include expenses with valid amounts

  console.log('Processed expenses:', processedExpenses.length);

  // If no valid expenses after processing
  if (processedExpenses.length === 0) {
    return (
      <Card>
        <View className="items-center py-8">
          <View className="bg-yellow-100 w-16 h-16 rounded-full items-center justify-center mb-4">
            <Ionicons name="warning" size={32} color="#f59e0b" />
          </View>
          <Text className="text-gray-500 text-center text-base">
            Invalid expense data
          </Text>
          <Text className="text-gray-400 text-center text-sm mt-2">
            All expenses have invalid amounts
          </Text>
        </View>
      </Card>
    );
  }

  const calculateTotalSpending = (): number => {
    return processedExpenses.reduce((total, expense) => total + expense.processedAmount, 0);
  };
  
  const getCategoryTotals = () => {
    const categoryMap: Record<string, { amount: number; count: number }> = {};
    
    processedExpenses.forEach(expense => {
      const category = expense.category;
      
      if (!categoryMap[category]) {
        categoryMap[category] = { amount: 0, count: 0 };
      }
      
      categoryMap[category].amount += expense.processedAmount;
      categoryMap[category].count += 1;
    });
    
    const totalSpending = calculateTotalSpending();
    
    return Object.entries(categoryMap)
      .map(([category, data]) => ({
        category,
        ...data,
        percentage: totalSpending > 0 ? (data.amount / totalSpending) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8); // Show top 8 categories
  };
  
  const totalSpending = calculateTotalSpending();
  const categoryTotals = getCategoryTotals();
  const expenseCount = processedExpenses.length;
  
  console.log('Category totals:', categoryTotals);
  console.log('Total spending:', totalSpending);

  const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
    const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
      'Food': 'restaurant',
      'Food & Dining': 'restaurant',
      'Transportation': 'car',
      'Shopping': 'bag',
      'Entertainment': 'game-controller',
      'Housing': 'home',
      'Utilities': 'flash',
      'Healthcare': 'medical',
      'Education': 'school',
      'Travel': 'airplane',
      'Clothes': 'shirt',
      'Other': 'ellipsis-horizontal',
    };
    return icons[category] || 'ellipsis-horizontal';
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Food': '#f59e0b',
      'Food & Dining': '#f59e0b',
      'Transportation': '#3b82f6',
      'Shopping': '#8b5cf6',
      'Entertainment': '#f97316',
      'Housing': '#10b981',
      'Utilities': '#06b6d4',
      'Healthcare': '#ef4444',
      'Education': '#6366f1',
      'Travel': '#14b8a6',
      'Clothes': '#ec4899',
      'Other': '#6b7280',
    };
    return colors[category] || '#6b7280';
  };
  
  return (
    <View>
      {/* Summary Card */}
      <Card className="mb-4">
        <View className="items-center py-4">
          <View className="bg-blue-100 w-16 h-16 rounded-full items-center justify-center mb-4">
            <Ionicons name="analytics" size={32} color="#2563eb" />
          </View>
          <Text className="text-gray-500 text-sm mb-2">
            Total Spending
          </Text>
          <Text className="text-gray-900 text-3xl font-bold">
            {formatPrice(totalSpending)}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            {expenseCount} {expenseCount === 1 ? 'expense' : 'expenses'}
          </Text>
        </View>
      </Card>
      
      {/* Category Breakdown */}
      <Card>
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Spending by Category
        </Text>
        
        <View>
          {categoryTotals.map(({ category, amount, count, percentage }, index) => {
            const categoryColor = getCategoryColor(category);
            
            return (
              <View key={`${category}-${index}`} className="mb-4">
                <View className="flex-row items-center mb-2">
                  <View 
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: categoryColor + '20' }}
                  >
                    <Ionicons 
                      name={getCategoryIcon(category)} 
                      size={20} 
                      color={categoryColor} 
                    />
                  </View>
                  
                  <View className="flex-1">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-gray-900 font-medium">
                        {category}
                      </Text>
                      <Text className="text-gray-900 font-semibold">
                        {formatPrice(amount)}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center mt-1">
                      <Text className="text-gray-500 text-sm">
                        {count} {count === 1 ? 'expense' : 'expenses'}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        {percentage.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                </View>
                
                {/* Progress Bar */}
                <View className="h-2 bg-gray-200 rounded-full">
                  <View 
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${Math.min(Math.max(percentage, 5), 100)}%`, // Minimum 5% width for visibility
                      backgroundColor: categoryColor 
                    }}
                  />
                </View>
              </View>
            );
          })}
        </View>
        
        {/* Show if there are more categories */}
        {processedExpenses.length > categoryTotals.length && (
          <Text className="text-gray-500 text-sm text-center mt-4">
            Showing top {categoryTotals.length} categories
          </Text>
        )}
      </Card>
    </View>
  );
}