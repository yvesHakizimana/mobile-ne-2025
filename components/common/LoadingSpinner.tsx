import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'large', 
  color = '#3b82f6', 
  message, 
  fullScreen = false,
  className 
}: LoadingSpinnerProps) {
  const containerClasses = fullScreen 
    ? 'flex-1 justify-center items-center bg-white' 
    : 'justify-center items-center py-8';
  
  return (
    <View className={cn(containerClasses, className)}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text className="text-gray-600 text-base mt-3 text-center">
          {message}
        </Text>
      )}
    </View>
  );
}