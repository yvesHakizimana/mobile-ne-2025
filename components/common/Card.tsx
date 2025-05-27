import React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '../../lib/utils';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ 
  variant = 'default', 
  padding = 'md', 
  className, 
  children, 
  ...props 
}: CardProps) {
  const baseClasses = 'rounded-lg bg-white';
  
  const variantClasses = {
    default: 'shadow-sm',
    elevated: 'shadow-lg elevation-5',
    outlined: 'border border-gray-200',
  };
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };
  
  return (
    <View 
      className={cn(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}