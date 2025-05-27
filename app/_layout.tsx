import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
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
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="welcome" />
          <Stack.Screen name="(auth)" />
        </>
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  );
}
