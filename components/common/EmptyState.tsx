import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface EmptyStateProps {
  illustration?: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  variant?: 'default' | 'offline' | 'error' | 'search';
}

export function EmptyState({
  illustration,
  title,
  description,
  actionText,
  onAction,
  variant = 'default'
}: EmptyStateProps) {
  const getVariantConfig = () => {
    switch (variant) {
      case 'offline':
        return {
          colors: ['#f97316', '#ea580c'],
          icon: 'cloud-offline' as keyof typeof Ionicons.glyphMap,
          emoji: '📡',
        };
      case 'error':
        return {
          colors: ['#ef4444', '#dc2626'],
          icon: 'alert-circle' as keyof typeof Ionicons.glyphMap,
          emoji: '🚫',
        };
      case 'search':
        return {
          colors: ['#6b7280', '#374151'],
          icon: 'search' as keyof typeof Ionicons.glyphMap,
          emoji: '🔍',
        };
      default:
        return {
          colors: ['#3b82f6', '#1d4ed8'],
          icon: 'documents' as keyof typeof Ionicons.glyphMap,
          emoji: '📋',
        };
    }
  };

  const config = getVariantConfig();
  const displayIllustration = illustration || config.emoji;

  return (
    <View className="flex-1 justify-center items-center p-8">
      {/* Illustration */}
      <View className="mb-8 items-center">
        <Text className="text-6xl mb-4">{displayIllustration}</Text>
        
        <LinearGradient
          colors={config.colors}
          className="w-24 h-24 rounded-full items-center justify-center"
        >
          <View className="bg-white w-20 h-20 rounded-full items-center justify-center shadow-lg">
            <Ionicons name={config.icon} size={32} color={config.colors[0]} />
          </View>
        </LinearGradient>
      </View>

      {/* Content */}
      <Text className="text-2xl font-bold text-gray-900 text-center mb-4">
        {title}
      </Text>
      
      <Text className="text-gray-600 text-center text-base leading-6 mb-8 max-w-sm">
        {description}
      </Text>
      
      {/* Action Button */}
      {actionText && onAction && (
        <TouchableOpacity
          onPress={onAction}
          className="bg-primary-600 px-8 py-4 rounded-2xl shadow-lg active:bg-primary-700"
        >
          <Text className="text-white font-semibold text-lg">
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
      
      {/* Decorative elements */}
      <View className="absolute top-20 left-10 w-2 h-2 bg-primary-200 rounded-full" />
      <View className="absolute top-32 right-16 w-3 h-3 bg-primary-300 rounded-full" />
      <View className="absolute bottom-40 left-8 w-4 h-4 bg-primary-100 rounded-full" />
      <View className="absolute bottom-20 right-12 w-2 h-2 bg-primary-200 rounded-full" />
    </View>
  );
}