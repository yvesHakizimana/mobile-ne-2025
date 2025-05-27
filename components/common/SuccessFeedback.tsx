import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

interface SuccessFeedbackProps {
  message: string;
  isVisible: boolean;
  duration?: number;
  onHide?: () => void;
}

export function SuccessFeedback({ 
  message, 
  isVisible, 
  duration = 3000,
  onHide 
}: SuccessFeedbackProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onHide?.();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Animated.View
      className="absolute top-20 left-4 right-4 z-50"
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <LinearGradient
        colors={['#22c55e', '#16a34a']}
        className="rounded-2xl p-4 shadow-2xl"
      >
        <View className="flex-row items-center">
          <View className="bg-white/20 p-2 rounded-full mr-3">
            <Ionicons name="checkmark-circle" size={24} color="white" />
          </View>
          
          <Text className="text-white font-semibold text-base flex-1">
            {message}
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}