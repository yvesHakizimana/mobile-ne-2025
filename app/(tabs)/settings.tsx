import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Card } from '../../components/common/Card';
import { useAuthStore } from '../../store/authStore';

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const settingsOptions = [
    {
      title: 'Profile',
      subtitle: 'Manage your account',
      icon: 'person' as keyof typeof Ionicons.glyphMap,
      onPress: () => Alert.alert('Coming Soon', 'Profile management will be available soon'),
    },
    {
      title: 'Notifications',
      subtitle: 'Manage your alerts',
      icon: 'notifications' as keyof typeof Ionicons.glyphMap,
      onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon'),
    },
    {
      title: 'Export Data',
      subtitle: 'Download your expenses',
      icon: 'download' as keyof typeof Ionicons.glyphMap,
      onPress: () => Alert.alert('Coming Soon', 'Data export will be available soon'),
    },
    {
      title: 'Help & Support',
      subtitle: 'Get help and support',
      icon: 'help-circle' as keyof typeof Ionicons.glyphMap,
      onPress: () => Alert.alert('Help', 'For support, please contact support@financetracker.com'),
    },
    {
      title: 'About',
      subtitle: 'App version and info',
      icon: 'information-circle' as keyof typeof Ionicons.glyphMap,
      onPress: () => Alert.alert('About', 'Personal Finance Tracker v1.0.0\nBuilt with React Native'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200">
        <View className="px-6 py-4">
          <Text className="text-2xl font-bold text-gray-900">Settings</Text>
          <Text className="text-gray-500 text-sm">Manage your preferences</Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View className="p-6">
          <Card>
            <View className="flex-row items-center">
              <View className="bg-primary-100 w-16 h-16 rounded-full items-center justify-center mr-4">
                <Ionicons name="person" size={32} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold text-lg">
                  {user?.username?.split('@')[0] || 'User'}
                </Text>
                <Text className="text-gray-500 text-sm">{user?.username}</Text>
                <Text className="text-gray-400 text-xs">
                  Member since {new Date(user?.createdAt || '').toLocaleDateString()}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Settings Options */}
        <View className="px-6">
          <Card padding="none">
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={option.title}
                onPress={option.onPress}
                className={`p-4 flex-row items-center ${
                  index !== settingsOptions.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <View className="bg-gray-100 w-12 h-12 rounded-full items-center justify-center mr-4">
                  <Ionicons name={option.icon} size={24} color="#374151" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium">{option.title}</Text>
                  <Text className="text-gray-500 text-sm">{option.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </Card>
        </View>

        {/* App Info */}
        <View className="px-6 mt-6">
          <Card>
            <Text className="text-center text-gray-500 text-sm mb-2">
              Personal Finance Tracker
            </Text>
            <Text className="text-center text-gray-400 text-xs">
              Version 1.0.0
            </Text>
          </Card>
        </View>

        {/* Logout Button */}
        <View className="p-6">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-600 py-4 rounded-xl active:bg-red-700"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="log-out" size={20} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}