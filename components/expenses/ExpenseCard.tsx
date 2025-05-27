import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { formatPrice, formatRelativeTime } from '../../lib/utils';
import { Expense } from '../../types/expense.types';
import { Card } from '../common/Card';

interface ExpenseCardProps {
  expense: Expense;
  onPress?: () => void;
  onDelete?: () => void;
  showDeleteButton?: boolean;
}

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

const getCategoryColor = (category?: string): string => {
  const categoryColors: Record<string, string> = {
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
  
  return categoryColors[category || 'Other'] || '#6b7280';
};

export function ExpenseCard({ 
  expense, 
  onPress, 
  onDelete, 
  showDeleteButton = true 
}: ExpenseCardProps) {
  const categoryIcon = getCategoryIcon(expense.category);
  const categoryColor = getCategoryColor(expense.category);
  const amount = typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount;
  
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <Card className="mb-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View 
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: categoryColor + '20' }}
            >
              <Ionicons 
                name={categoryIcon} 
                size={24} 
                color={categoryColor} 
              />
            </View>
            
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold text-base mb-1">
                {expense.name || expense.description || 'Expense'}
              </Text>
              
              <Text className="text-gray-500 text-sm mb-1">
                {expense.category || 'Other'}
              </Text>
              
              {expense.date && (
                <Text className="text-gray-400 text-xs">
                  {formatRelativeTime(expense.date)}
                </Text>
              )}
            </View>
          </View>
          
          <View className="items-end">
            <Text className="text-gray-900 font-bold text-lg">
              {formatPrice(amount || 0)}
            </Text>
            
            {showDeleteButton && onDelete && (
              <TouchableOpacity
                onPress={onDelete}
                className="mt-2 p-1"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="trash" size={16} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}