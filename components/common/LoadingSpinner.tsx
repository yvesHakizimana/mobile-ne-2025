import React, { useRef, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'spinner' | 'pulse' | 'dots';
}

export function LoadingSpinner({ 
  message = 'Loading...', 
  fullScreen = false,
  size = 'medium',
  variant = 'spinner'
}: LoadingSpinnerProps) {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const dotsValue = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    if (variant === 'spinner') {
      const spin = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      spin.start();
      return () => spin.stop();
    }

    if (variant === 'pulse') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }

    if (variant === 'dots') {
      const animateDots = () => {
        const animations = dotsValue.map((dot, index) =>
          Animated.sequence([
            Animated.delay(index * 200),
            Animated.timing(dot, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        );

        Animated.loop(
          Animated.stagger(100, animations)
        ).start();
      };

      animateDots();
    }
  }, [variant]);

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { iconSize: 20, containerSize: 'w-8 h-8', textSize: 'text-sm' };
      case 'large':
        return { iconSize: 40, containerSize: 'w-20 h-20', textSize: 'text-lg' };
      default:
        return { iconSize: 28, containerSize: 'w-14 h-14', textSize: 'text-base' };
    }
  };

  const sizeConfig = getSizeConfig();
  const spinInterpolate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderLoader = () => {
    if (variant === 'dots') {
      return (
        <View className="flex-row items-center space-x-2">
          {dotsValue.map((dot, index) => (
            <Animated.View
              key={index}
              className="w-3 h-3 bg-primary-600 rounded-full"
              style={{
                opacity: dot,
                transform: [{ scale: dot }],
              }}
            />
          ))}
        </View>
      );
    }

    if (variant === 'pulse') {
      return (
        <Animated.View
          style={{ transform: [{ scale: pulseValue }] }}
        >
          <LinearGradient
            colors={['#3b82f6', '#1d4ed8']}
            className={`${sizeConfig.containerSize} rounded-full items-center justify-center`}
          >
            <Ionicons name="sync" size={sizeConfig.iconSize} color="white" />
          </LinearGradient>
        </Animated.View>
      );
    }

    // Default spinner
    return (
      <Animated.View
        style={{
          transform: [{ rotate: spinInterpolate }],
        }}
      >
        <LinearGradient
          colors={['#3b82f6', '#1d4ed8']}
          className={`${sizeConfig.containerSize} rounded-full items-center justify-center`}
        >
          <Ionicons name="sync" size={sizeConfig.iconSize} color="white" />
        </LinearGradient>
      </Animated.View>
    );
  };

  const containerClass = fullScreen 
    ? 'flex-1 justify-center items-center bg-white' 
    : 'items-center py-8';

  return (
    <View className={containerClass}>
      {renderLoader()}
      
      {message && (
        <Text className={`text-gray-600 text-center mt-4 font-medium ${sizeConfig.textSize}`}>
          {message}
        </Text>
      )}
      
      {fullScreen && (
        <Text className="text-gray-400 text-sm text-center mt-2">
          This won't take long...
        </Text>
      )}
    </View>
  );
}