import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Card } from '../../../components/common/Card';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { formatPrice, formatRelativeTime } from '../../../lib/utils';
import { useExpenseStore } from '../../../store/expenseStore';

export default function ExpenseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { 
    currentExpense, 
    fetchExpenseById, 
    deleteExpense, 
    isLoading, 
    error,
    clearCurrentExpense 
  } = useExpenseStore();

  useEffect(() => {
    if (id) {
      fetchExpenseById(id);
    }

    return () => {
      clearCurrentExpense();
    };
  }, [id, fetchExpenseById, clearCurrentExpense]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (id) {
              const success = await deleteExpense(id);
              if (success) {
                Alert.alert(
                  'Success',
                  'Expense deleted successfully',
                  [
                    {
                      text: 'OK',
                      onPress: () => router.back(),
                    },
                  ]
                );
              }
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading expense details..." />;
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="bg-white border-b border-gray-200">
          <View className="flex-row items-center px-6 py-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-4 p-2 -ml-2 rounded-full"
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900">Expense Details</Text>
          </View>
        </View>
        <ErrorMessage
          message={error}
          onRetry={() => id && fetchExpenseById(id)}
          variant="fullScreen"
        />
      </SafeAreaView>
    );
  }

  if (!currentExpense) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="bg-white border-b border-gray-200">
          <View className="flex-row items-center px-6 py-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-4 p-2 -ml-2 rounded-full"
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900">Expense Details</Text>
          </View>
        </View>
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">Expense not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const amount = typeof currentExpense.amount === 'string' 
    ? parseFloat(currentExpense.amount) 
    : currentExpense.amount || 0;

  const getCategoryIcon = (category?: string): keyof typeof Ionicons.glyphMap => {
    const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
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
    return categoryIcons[category || 'Other'] || 'ellipsis-horizontal';
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between px-6 py-4">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-4 p-2 -ml-2 rounded-full"
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900">Expense Details</Text>
              <Text className="text-gray-500 text-sm">View and manage</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleDelete}
            className="bg-red-100 p-3 rounded-full"
          >
            <Ionicons name="trash" size={20} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Amount Card */}
        <View className="p-6">
          <Card className="items-center py-8">
            <View className="bg-primary-100 w-20 h-20 rounded-full items-center justify-center mb-4">
              <Ionicons 
                name={getCategoryIcon(currentExpense.category)} 
                size={32} 
                color="#2563eb" 
              />
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              {formatPrice(amount)}
            </Text>
            <Text className="text-gray-500 text-lg">
              {currentExpense.category || 'Other'}
            </Text>
          </Card>
        </View>

        {/* Details */}
        <View className="px-6">
          <Card>
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Expense Information
            </Text>

            <View className="space-y-4">
              <View className="flex-row items-center">
                <View className="bg-gray-100 w-10 h-10 rounded-full items-center justify-center mr-3">
                  <Ionicons name="document-text" size={20} color="#374151" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-sm">Description</Text>
                  <Text className="text-gray-900 font-medium">
                    {currentExpense.description || currentExpense.name || 'No description'}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="bg-gray-100 w-10 h-10 rounded-full items-center justify-center mr-3">
                  <Ionicons name="pricetag" size={20} color="#374151" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-sm">Category</Text>
                  <Text className="text-gray-900 font-medium">
                    {currentExpense.category || 'Other'}
                  </Text>
                </View>
              </View>

              {currentExpense.date && (
                <View className="flex-row items-center">
                  <View className="bg-gray-100 w-10 h-10 rounded-full items-center justify-center mr-3">
                    <Ionicons name="calendar" size={20} color="#374151" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-500 text-sm">Date</Text>
                    <Text className="text-gray-900 font-medium">
                      {new Date(currentExpense.date).toLocaleDateString()}
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      {formatRelativeTime(currentExpense.date)}
                    </Text>
                  </View>
                </View>
              )}

              <View className="flex-row items-center">
                <View className="bg-gray-100 w-10 h-10 rounded-full items-center justify-center mr-3">
                  <Ionicons name="time" size={20} color="#374151" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-sm">Created</Text>
                  <Text className="text-gray-900 font-medium">
                    {new Date(currentExpense.createdAt).toLocaleDateString()}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    {formatRelativeTime(currentExpense.createdAt)}
                  </Text>
                </View>
              </View>

              {currentExpense.note && (
                <View className="flex-row items-start">
                  <View className="bg-gray-100 w-10 h-10 rounded-full items-center justify-center mr-3 mt-1">
                    <Ionicons name="chatbubble" size={20} color="#374151" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-500 text-sm">Note</Text>
                    <Text className="text-gray-900 font-medium">
                      {currentExpense.note}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </Card>
        </View>

        {/* Action Button */}
        <View className="p-6">
          <TouchableOpacity
            onPress={handleDelete}
            className="bg-red-600 py-4 rounded-xl active:bg-red-700"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Delete Expense
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}