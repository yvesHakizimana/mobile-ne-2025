import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Input } from '../../components/common/Input';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error: authError, clearError, isAuthenticated } = useAuthStore();
  const { errorState, handleError, clearError: clearLocalError } = useErrorHandler();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    username: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);

  // Clear errors when component mounts or when user starts typing
  useEffect(() => {
    clearError();
    clearLocalError();
  }, []);

  // Navigate to dashboard only after successful authentication
  useEffect(() => {
    if (isAuthenticated && loginAttempted) {
      // Small delay to ensure state is updated
      setTimeout(() => {
        router.replace('/(tabs)/');
      }, 100);
    }
  }, [isAuthenticated, loginAttempted]);

  const validateForm = (): boolean => {
    const errors = { username: '', password: '' };
    let isValid = true;

    if (!formData.username.trim()) {
      errors.username = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.username)) {
      errors.username = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleLogin = async () => {
    // Clear all previous errors
    clearError();
    clearLocalError();
    setLoginAttempted(false);
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoginAttempted(true);
      
      const success = await login({
        username: formData.username,
        password: formData.password,
      });

      // If login fails, the error will be in authError
      if (!success) {
        setLoginAttempted(false);
        // Handle the error from auth store
        if (authError) {
          handleError({ message: authError, type: 'UNAUTHORIZED' });
        }
      }
      // Navigation will happen in useEffect when isAuthenticated becomes true
      
    } catch (error: any) {
      setLoginAttempted(false);
      console.error('Login error:', error);
      handleError(error);
    }
  };

  const updateField = (field: 'username' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear general errors when user starts typing
    if (authError || errorState.error) {
      clearError();
      clearLocalError();
    }
  };

  const demoCredentials = [
    { username: 'Rosemary.Auer@gmail.com', password: 'IoqOWrplBc9lqjI' },
    { username: 'Rosalyn59@hotmail.com', password: 'GjFIrSgyliG8tW5' },
    { username: 'Maci94@hotmail.com', password: 'R0ChVUODGqjwaAF' },
  ];

  const fillDemoCredentials = (credentials: { username: string; password: string }) => {
    setFormData(credentials);
    setFormErrors({ username: '', password: '' });
    clearError();
    clearLocalError();
  };

  const retryLogin = () => {
    clearError();
    clearLocalError();
    handleLogin();
  };

  // Determine which error to show (prioritize local error handling)
  const displayError = errorState.error || authError;
  const hasError = !!(errorState.error || authError);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with Gradient */}
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            className="px-8 py-16 rounded-b-3xl"
          >
            <View className="items-center">
              <View className="bg-white/20 p-4 rounded-full mb-6">
                <Ionicons name="wallet" size={48} color="white" />
              </View>
              
              <Text className="text-white text-3xl font-bold mb-2">
                Welcome Back
              </Text>
              
              <Text className="text-white/90 text-base text-center">
                Sign in to continue managing your finances
              </Text>
            </View>
          </LinearGradient>

          {/* Login Form */}
          <View className="px-8 py-8">
            <View className="bg-white rounded-2xl shadow-lg p-6 -mt-8">
              <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Login
              </Text>

              {/* Enhanced Error Display */}
              {hasError && (
                <ErrorMessage
                  message={displayError}
                  variant="inline"
                  type={errorState.type === 'NETWORK_ERROR' ? 'network' : 'general'}
                  onRetry={errorState.isRetryable ? retryLogin : undefined}
                />
              )}

              <View className="space-y-4">
                <Input
                  label="Email Address"
                  placeholder="Enter your email"
                  value={formData.username}
                  onChangeText={(value) => updateField('username', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon="mail"
                  error={formErrors.username}
                  required
                />

                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={(value) => updateField('password', value)}
                  secureTextEntry={!showPassword}
                  leftIcon="lock-closed"
                  rightIcon={showPassword ? "eye-off" : "eye"}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  error={formErrors.password}
                  required
                />

                <Button
                  title={isLoading ? "Signing In..." : "Sign In"}
                  onPress={handleLogin}
                  isLoading={isLoading}
                  disabled={isLoading}
                  className="mt-6"
                />
              </View>
            </View>

            {/* Demo Credentials */}
            <View className="mt-8">
              <Text className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Demo Accounts
              </Text>
              
              <Text className="text-sm text-gray-600 mb-4 text-center">
                Click any demo account below to auto-fill credentials
              </Text>

              <View className="space-y-3">
                {demoCredentials.map((credential, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => fillDemoCredentials(credential)}
                    disabled={isLoading}
                    className={`border border-gray-200 rounded-lg p-4 ${
                      isLoading 
                        ? 'bg-gray-100 opacity-50' 
                        : 'bg-gray-50 active:bg-gray-100'
                    }`}
                  >
                    <View className="flex-row items-center">
                      <View className="bg-primary-100 p-2 rounded-full mr-3">
                        <Ionicons name="person" size={20} color="#2563eb" />
                      </View>
                      
                      <View className="flex-1">
                        <Text className="text-gray-900 font-medium">
                          Demo User {index + 1}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                          {credential.username}
                        </Text>
                      </View>
                      
                      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Footer */}
            <View className="mt-8">
              <TouchableOpacity 
                onPress={() => router.back()}
                disabled={isLoading}
                className="flex-row items-center justify-center py-3"
              >
                <Ionicons name="arrow-back" size={20} color="#6b7280" />
                <Text className="text-gray-500 ml-2">Back to Welcome</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}