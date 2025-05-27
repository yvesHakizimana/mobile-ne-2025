import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from './Card';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  variant?: 'inline' | 'fullScreen' | 'card';
  type?: 'network' | 'server' | 'general';
}

export function ErrorMessage({ 
  title,
  message, 
  onRetry, 
  variant = 'card',
  type = 'general'
}: ErrorMessageProps) {
  const getErrorConfig = () => {
    switch (type) {
      case 'network':
        return {
          icon: 'wifi-off' as keyof typeof Ionicons.glyphMap,
          colors: ['#f97316', '#ea580c'],
          defaultTitle: 'Connection Problem',
          illustration: '📡',
        };
      case 'server':
        return {
          icon: 'server-outline' as keyof typeof Ionicons.glyphMap,
          colors: ['#ef4444', '#dc2626'],
          defaultTitle: 'Server Error',
          illustration: '🔧',
        };
      default:
        return {
          icon: 'alert-circle' as keyof typeof Ionicons.glyphMap,
          colors: ['#6b7280', '#374151'],
          defaultTitle: 'Something went wrong',
          illustration: '🤔',
        };
    }
  };

  const config = getErrorConfig();
  const displayTitle = title || config.defaultTitle;

  if (variant === 'fullScreen') {
    return (
      <View className="flex-1 justify-center items-center p-8 bg-gray-50">
        {/* Animated Illustration */}
        <View className="mb-8">
          <Text className="text-6xl text-center mb-4">{config.illustration}</Text>
          <LinearGradient
            colors={[...config.colors, 'transparent']}
            className="w-32 h-32 rounded-full items-center justify-center"
          >
            <View className="bg-white w-24 h-24 rounded-full items-center justify-center shadow-lg">
              <Ionicons name={config.icon} size={40} color={config.colors[0]} />
            </View>
          </LinearGradient>
        </View>

        <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
          {displayTitle}
        </Text>
        
        <Text className="text-gray-600 text-center text-base leading-6 mb-8 max-w-sm">
          {message}
        </Text>
        
        {onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            className="bg-primary-600 px-8 py-4 rounded-2xl shadow-lg active:bg-primary-700"
          >
            <View className="flex-row items-center">
              <Ionicons name="refresh" size={20} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">
                Try Again
              </Text>
            </View>
          </TouchableOpacity>
        )}
        
        <Text className="text-gray-400 text-sm text-center mt-6">
          Pull down to refresh or check your connection
        </Text>
      </View>
    );
  }

  if (variant === 'inline') {
    return (
      <View className="bg-red-50 border border-red-200 rounded-xl p-4 m-4">
        <View className="flex-row items-start">
          <View className="bg-red-100 p-2 rounded-full mr-3">
            <Ionicons name={config.icon} size={20} color={config.colors[0]} />
          </View>
          
          <View className="flex-1">
            <Text className="text-red-800 font-semibold mb-1">
              {displayTitle}
            </Text>
            <Text className="text-red-700 text-sm leading-5">
              {message}
            </Text>
            
            {onRetry && (
              <TouchableOpacity
                onPress={onRetry}
                className="bg-red-600 px-4 py-2 rounded-lg mt-3 self-start active:bg-red-700"
              >
                <Text className="text-white font-medium text-sm">Retry</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }

  // Card variant (default) - Fixed the JSX structure
  return (
    <Card className="m-4">
      <View className="items-center py-6">
        <View className="mb-4">
          <LinearGradient
            colors={[...config.colors, 'transparent']}
            className="w-20 h-20 rounded-full items-center justify-center"
          >
            <View className="bg-white w-16 h-16 rounded-full items-center justify-center shadow-sm">
              <Ionicons name={config.icon} size={32} color={config.colors[0]} />
            </View>
          </LinearGradient>
        </View>

        <Text className="text-xl font-bold text-gray-900 text-center mb-2">
          {displayTitle}
        </Text>
        
        <Text className="text-gray-600 text-center mb-6 max-w-xs">
          {message}
        </Text>
        
        {onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            className="bg-primary-600 px-6 py-3 rounded-xl active:bg-primary-700"
          >
            <View className="flex-row items-center">
              <Ionicons name="refresh" size={18} color="white" />
              <Text className="text-white font-semibold ml-2">
                Try Again
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
}