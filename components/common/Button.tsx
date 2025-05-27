import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { cn } from '../../lib/utils';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className,
  ...props
}: ButtonProps) {
  const baseClasses = 'flex-row items-center justify-center rounded-lg font-medium';
  
  const variantClasses = {
    primary: 'bg-blue-600 active:bg-blue-700',
    secondary: 'bg-gray-600 active:bg-gray-700',
    outline: 'border-2 border-blue-600 bg-transparent active:bg-blue-50',
    ghost: 'bg-transparent active:bg-gray-100',
    danger: 'bg-red-600 active:bg-red-700',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 min-h-[36px]',
    md: 'px-4 py-3 min-h-[44px]',
    lg: 'px-6 py-4 min-h-[52px]',
  };
  
  const textVariantClasses = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-blue-600',
    ghost: 'text-gray-700',
    danger: 'text-white',
  };
  
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };
  
  const disabledClasses = disabled || isLoading ? 'opacity-50' : '';
  
  return (
    <TouchableOpacity
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabledClasses,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? '#374151' : '#ffffff'} 
        />
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          <Text className={cn(textVariantClasses[variant], textSizeClasses[size], 'font-semibold')}>
            {title}
          </Text>
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </TouchableOpacity>
  );
}