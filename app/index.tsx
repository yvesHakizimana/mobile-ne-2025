import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  title: string;
  subtitle: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: string[];
}

const onboardingData: OnboardingSlide[] = [
  {
    title: "Track Your Expenses",
    subtitle: "Smart Finance Management",
    description: "Easily track your daily expenses and get insights into your spending habits with our intuitive interface.",
    icon: "wallet",
    gradient: ['#667eea', '#764ba2']
  },
  {
    title: "Set Smart Budgets",
    subtitle: "Stay Within Limits",
    description: "Create custom budgets for different categories and receive notifications when you're approaching your limits.",
    icon: "trending-up",
    gradient: ['#f093fb', '#f5576c']
  },
  {
    title: "Visual Analytics",
    subtitle: "Understand Your Money",
    description: "Get beautiful charts and insights that help you understand where your money goes and how to save more.",
    icon: "analytics",
    gradient: ['#4facfe', '#00f2fe']
  }
];

export default function WelcomeScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const goToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    setCurrentIndex(index);
  };

  const handleGetStarted = () => {
    router.replace('/(auth)/login');
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => (
    <View key={index} style={{ width }} className="flex-1 justify-center items-center px-8">
      <LinearGradient
        colors={slide.gradient}
        className="w-32 h-32 rounded-full items-center justify-center mb-12"
      >
        <Ionicons name={slide.icon} size={64} color="white" />
      </LinearGradient>

      <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
        {slide.title}
      </Text>

      <Text className="text-lg font-semibold text-primary-600 text-center mb-6">
        {slide.subtitle}
      </Text>

      <Text className="text-base text-gray-600 text-center leading-6 max-w-sm">
        {slide.description}
      </Text>
    </View>
  );

  const renderPaginationDots = () => (
    <View className="flex-row justify-center items-center mb-8">
      {onboardingData.map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => goToSlide(index)}
          className={`w-3 h-3 rounded-full mx-2 ${
            index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
          }`}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View className="flex-row justify-between items-center p-6">
        <Text className="text-2xl font-bold text-gray-900">
          FinanceTracker
        </Text>
        
        {currentIndex < onboardingData.length - 1 && (
          <TouchableOpacity 
            onPress={handleGetStarted}
            className="px-4 py-2"
          >
            <Text className="text-primary-600 font-semibold">Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {onboardingData.map(renderSlide)}
      </ScrollView>

      {/* Bottom Section */}
      <View className="px-8 pb-8">
        {renderPaginationDots()}
        
        {currentIndex === onboardingData.length - 1 ? (
          <TouchableOpacity
            onPress={handleGetStarted}
            className="bg-primary-600 py-4 rounded-2xl shadow-lg active:bg-primary-700"
          >
            <Text className="text-white text-lg font-semibold text-center">
              Get Started
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => goToSlide(Math.max(0, currentIndex - 1))}
              className={`flex-1 py-4 mr-3 rounded-2xl border-2 border-gray-200 ${
                currentIndex === 0 ? 'opacity-50' : ''
              }`}
              disabled={currentIndex === 0}
            >
              <Text className="text-gray-700 text-lg font-semibold text-center">
                Previous
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => goToSlide(Math.min(onboardingData.length - 1, currentIndex + 1))}
              className="flex-1 py-4 ml-3 rounded-2xl bg-primary-600 active:bg-primary-700"
            >
              <Text className="text-white text-lg font-semibold text-center">
                Next
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}