import React from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { Expense } from '../../types/expense.types';
import { ErrorMessage } from '../common/ErrorMessage';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ExpenseCard } from './ExpenseCard';

interface ExpenseListProps {
  expenses: Expense[];
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onExpensePress?: (expense: Expense) => void;
  onExpenseDelete?: (expenseId: string) => void;
  emptyMessage?: string;
  showDeleteButton?: boolean;
}

export function ExpenseList({
  expenses,
  isLoading = false,
  error,
  onRefresh,
  onExpensePress,
  onExpenseDelete,
  emptyMessage = 'No expenses found',
  showDeleteButton = true
}: ExpenseListProps) {
  if (isLoading && expenses.length === 0) {
    return <LoadingSpinner message="Loading expenses..." />;
  }
  
  if (error && expenses.length === 0) {
    return (
      <ErrorMessage
        message={error}
        onRetry={onRefresh}
        variant="fullScreen"
      />
    );
  }
  
  const renderExpenseCard = ({ item }: { item: Expense }) => (
    <ExpenseCard
      expense={item}
      onPress={() => onExpensePress?.(item)}
      onDelete={() => onExpenseDelete?.(item.id)}
      showDeleteButton={showDeleteButton}
    />
  );
  
  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center p-8">
      <Text className="text-gray-500 text-lg text-center">
        {emptyMessage}
      </Text>
    </View>
  );
  
  return (
    <FlatList
      data={expenses}
      renderItem={renderExpenseCard}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        ) : undefined
      }
      ListEmptyComponent={renderEmptyState}
    />
  );
}