import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNetwork } from '../../hooks/useNetwork';
import { useExpenseStore } from '../../store/expenseStore';

export function NetworkStatus() {
  const { isConnected, isInternetReachable } = useNetwork();
  const { syncPendingOperations, pendingOperations, setOfflineMode } = useExpenseStore();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setOfflineMode(!isConnected || !isInternetReachable);
    
    if (isConnected && isInternetReachable) {
      // Slide up (hide)
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide down (show)
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    // Auto-sync when connection is restored
    if (isConnected && isInternetReachable && pendingOperations.length > 0) {
      syncPendingOperations();
    }
  }, [isConnected, isInternetReachable, pendingOperations.length]);

  // Pulse animation for pending operations
  useEffect(() => {
    if (pendingOperations.length > 0) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [pendingOperations.length]);

  if (isConnected && isInternetReachable && pendingOperations.length === 0) {
    return null;
  }

  const getStatusInfo = () => {
    if (!isConnected || !isInternetReachable) {
      return {
        colors: ['#f97316', '#ea580c'],
        icon: 'cloud-offline' as keyof typeof Ionicons.glyphMap,
        title: 'You\'re offline',
        subtitle: pendingOperations.length > 0 
          ? `${pendingOperations.length} changes will sync when online`
          : 'Some features may be limited',
      };
    }
    
    if (pendingOperations.length > 0) {
      return {
        colors: ['#3b82f6', '#1d4ed8'],
        icon: 'sync' as keyof typeof Ionicons.glyphMap,
        title: 'Syncing changes...',
        subtitle: `${pendingOperations.length} operations pending`,
      };
    }
    
    return null;
  };

  const statusInfo = getStatusInfo();
  if (!statusInfo) return null;

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <LinearGradient
        colors={statusInfo.colors}
        className="px-4 py-3 shadow-lg"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <View className="bg-white/20 p-2 rounded-full mr-3">
                <Ionicons name={statusInfo.icon} size={20} color="white" />
              </View>
            </Animated.View>
            
            <View className="flex-1">
              <Text className="text-white font-semibold text-base">
                {statusInfo.title}
              </Text>
              <Text className="text-white/90 text-sm">
                {statusInfo.subtitle}
              </Text>
            </View>
          </View>
          
          {pendingOperations.length > 0 && isConnected && (
            <TouchableOpacity
              onPress={syncPendingOperations}
              className="bg-white/20 px-4 py-2 rounded-full active:bg-white/30"
            >
              <Text className="text-white font-medium">Sync Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}