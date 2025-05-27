import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { NetworkStatus } from '../components/common/NetworkStatus';
import '../global.css';
import { useAuthStore } from '../store/authStore';

export default function RootLayout() {
  const { initializeAuth, isLoading, isAuthenticated } = useAuthStore();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeAuth();
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsAppReady(true);
      }
    };

    initializeApp();
  }, [initializeAuth]);

  if (!isAppReady || isLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return (
    <ErrorBoundary>
      <View className="flex-1">
        <NetworkStatus />
        <Stack screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
            </>
          ) : (
            <Stack.Screen name="(tabs)" />
          )}
        </Stack>
      </View>
    </ErrorBoundary>
  );
}
