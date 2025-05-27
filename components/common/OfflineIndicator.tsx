import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface OfflineIndicatorProps {
  isVisible: boolean;
  pendingCount: number;
  onSync?: () => void;
}

export function OfflineIndicator({ isVisible, pendingCount, onSync }: OfflineIndicatorProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Animated.View
      className="absolute bottom-20 left-4 right-4 z-50"
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <LinearGradient
        colors={['#1f2937', '#111827']}
        className="rounded-2xl p-4 shadow-2xl"
      >
        <View className="flex-row items-center">
          <View className="bg-orange-500 p-3 rounded-full mr-4">
            <Ionicons name="cloud-offline" size={24} color="white" />
          </View>
          
          <View className="flex-1">
            <Text className="text-white font-semibold text-base">
              Working Offline
            </Text>
            <Text className="text-gray-300 text-sm">
              {pendingCount > 0 
                ? `${pendingCount} changes saved locally`
                : 'Changes will sync when online'
              }
            </Text>
          </View>
          
          {pendingCount > 0 && onSync && (
            <TouchableOpacity
              onPress={onSync}
              className="bg-primary-600 px-4 py-2 rounded-xl"
            >
              <Text className="text-white font-medium text-sm">Sync</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}