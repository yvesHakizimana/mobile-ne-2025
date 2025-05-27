import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { cn } from '../../lib/utils';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  variant?: 'inline' | 'card' | 'fullScreen';
  className?: string;
}

export function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
  retryText = 'Try Again',
  variant = 'card',
  className
}: ErrorMessageProps) {
  const containerClasses = {
    inline: 'p-3 bg-red-50 border border-red-200 rounded-lg',
    card: 'p-6 bg-red-50 border border-red-200 rounded-lg items-center',
    fullScreen: 'flex-1 justify-center items-center p-6 bg-white',
  };
  
  return (
    <View className={cn(containerClasses[variant], className)}>
      {variant !== 'inline' && (
        <View className="bg-red-100 rounded-full p-3 mb-4">
          <Ionicons name="alert-circle" size={32} color="#dc2626" />
        </View>
      )}
      
      <Text className="text-red-800 font-semibold text-lg mb-2 text-center">
        {title}
      </Text>
      
      <Text className="text-red-600 text-base text-center mb-4">
        {message}
      </Text>
      
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="bg-red-600 px-6 py-3 rounded-lg active:bg-red-700"
        >
          <Text className="text-white font-semibold text-base">
            {retryText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}