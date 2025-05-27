import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { EXPENSE_CATEGORIES } from '../../config/constants';
import { ExpenseFormData } from '../../types/expense.types';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Input } from '../common/Input';

interface ExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  isLoading?: boolean;
  submitButtonText?: string;
}

export function ExpenseForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitButtonText = 'Save Expense'
}: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: initialData?.amount || '',
    description: initialData?.description || '',
    category: initialData?.category || EXPENSE_CATEGORIES[0],
    date: initialData?.date || new Date().toISOString().split('T')[0],
  });
  
  const [errors, setErrors] = useState<Partial<ExpenseFormData>>({});
  
  const validateForm = (): boolean => {
    const newErrors: Partial<ExpenseFormData> = {};
    
    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors and try again.');
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error) {
      Alert.alert('Error', 'Failed to save expense. Please try again.');
    }
  };
  
  const updateField = (field: keyof ExpenseFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };
  
  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      <Card className="m-4">
        <Text className="text-xl font-bold text-gray-900 mb-6">
          Expense Details
        </Text>
        
        <View className="space-y-4">
          <Input
            label="Amount"
            placeholder="0.00"
            value={formData.amount}
            onChangeText={(value) => updateField('amount', value)}
            keyboardType="numeric"
            leftIcon="cash"
            error={errors.amount}
            required
          />
          
          <Input
            label="Description"
            placeholder="What was this expense for?"
            value={formData.description}
            onChangeText={(value) => updateField('description', value)}
            leftIcon="document-text"
            error={errors.description}
            required
            multiline
            numberOfLines={3}
          />
          
          <View>
            <Text className="text-gray-700 text-sm font-medium mb-2">
              Category <Text className="text-red-500">*</Text>
            </Text>
            <View className="border border-gray-300 rounded-lg bg-white">
              <Picker
                selectedValue={formData.category}
                onValueChange={(value) => updateField('category', value)}
                style={{ height: 50 }}
              >
                {EXPENSE_CATEGORIES.map((category) => (
                  <Picker.Item 
                    key={category} 
                    label={category} 
                    value={category} 
                  />
                ))}
              </Picker>
            </View>
            {errors.category && (
              <Text className="text-red-500 text-sm mt-1">{errors.category}</Text>
            )}
          </View>
          
          <Input
            label="Date"
            placeholder="YYYY-MM-DD"
            value={formData.date}
            onChangeText={(value) => updateField('date', value)}
            leftIcon="calendar"
            error={errors.date}
            required
          />
        </View>
        
        <Button
          title={submitButtonText}
          onPress={handleSubmit}
          isLoading={isLoading}
          className="mt-6"
        />
      </Card>
    </ScrollView>
  );
}