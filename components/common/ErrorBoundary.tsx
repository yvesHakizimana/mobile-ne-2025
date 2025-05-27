import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<Props, ErrorBoundaryState> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback;
        return <Fallback error={this.state.error} retry={this.retry} />;
      }

      return (
        <View className="flex-1 justify-center items-center p-6 bg-white">
          <View className="bg-red-100 w-20 h-20 rounded-full items-center justify-center mb-6">
            <Ionicons name="alert-circle" size={40} color="#dc2626" />
          </View>
          
          <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
            Something went wrong
          </Text>
          
          <Text className="text-gray-600 text-center mb-6">
            The app encountered an unexpected error. Please try again.
          </Text>
          
          <TouchableOpacity
            onPress={this.retry}
            className="bg-primary-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}