import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { cn } from '../../lib/utils';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  isPassword?: boolean;
  required?: boolean;
  helpText?: string;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword = false,
  required = false,
  helpText,
  className,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const hasError = !!error;
  const finalRightIcon = isPassword ? (isPasswordVisible ? 'eye-off' : 'eye') : rightIcon;
  
  const handleRightIconPress = () => {
    if (isPassword) {
      setIsPasswordVisible(!isPasswordVisible);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };
  
  return (
    <View className="w-full">
      {label && (
        <Text className="text-gray-700 text-sm font-medium mb-2">
          {label}
          {required && <Text className="text-red-500 ml-1">*</Text>}
        </Text>
      )}
      
      <View className={cn(
        'flex-row items-center border rounded-lg px-3 py-3',
        isFocused && !hasError && 'border-blue-500',
        hasError && 'border-red-500',
        !isFocused && !hasError && 'border-gray-300',
        'bg-white',
        className
      )}>
        {leftIcon && (
          <Ionicons 
            name={leftIcon} 
            size={20} 
            color={hasError ? '#ef4444' : isFocused ? '#3b82f6' : '#6b7280'} 
            className="mr-3"
          />
        )}
        
        <TextInput
          className="flex-1 text-gray-900 text-base"
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#9ca3af"
          {...props}
        />
        
        {finalRightIcon && (
          <TouchableOpacity onPress={handleRightIconPress}>
            <Ionicons 
              name={finalRightIcon} 
              size={20} 
              color={hasError ? '#ef4444' : isFocused ? '#3b82f6' : '#6b7280'} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
      
      {helpText && !error && (
        <Text className="text-gray-500 text-sm mt-1">{helpText}</Text>
      )}
    </View>
  );
}