import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../../components/common/Card';
import { useAuthStore } from '../../store/authStore';
import { useExpenseStore } from '../../store/expenseStore';

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();
  const { clearError, pendingOperations } = useExpenseStore();
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            clearError();
            await logout();
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. You may need to reload your expenses.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // Clear cache logic here
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      })
    : 'Recently';

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header with User Profile */}
        <View className="px-6 pt-6 pb-4">
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            className="rounded-2xl p-6"
          >
            <View className="flex-row items-center">
              <View className="bg-white/20 w-20 h-20 rounded-full items-center justify-center mr-4">
                <Text className="text-white text-2xl font-bold">
                  {(user?.username?.charAt(0) || 'U').toUpperCase()}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold text-xl mb-1">
                  {user?.username?.split('@')[0] || 'User'}
                </Text>
                <Text className="text-white/80 text-sm">
                  {user?.username}
                </Text>
                <Text className="text-white/60 text-xs mt-1">
                  Member since {memberSince}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Status Section */}
        {pendingOperations.length > 0 && (
          <View className="px-6 mb-4">
            <Card>
              <View className="flex-row items-center">
                <View className="bg-orange-100 w-12 h-12 rounded-full items-center justify-center mr-3">
                  <Ionicons name="sync" size={24} color="#f97316" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium">
                    Pending Sync
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {pendingOperations.length} changes waiting to sync
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Preferences */}
        <View className="px-6 mb-6">
          <Text className="text-gray-900 font-semibold text-lg mb-4">
            Preferences
          </Text>
          <Card padding="none">
            {/* Notifications Toggle */}
            <View className="p-4 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="bg-gray-100 w-12 h-12 rounded-full items-center justify-center mr-3">
                  <Ionicons name="notifications" size={24} color="#374151" />
                </View>
                <View>
                  <Text className="text-gray-900 font-medium">Notifications</Text>
                  <Text className="text-gray-500 text-sm">Expense reminders</Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                thumbColor={notifications ? '#ffffff' : '#ffffff'}
              />
            </View>
          </Card>
        </View>

        {/* Data Management */}
        <View className="px-6 mb-6">
          <Text className="text-gray-900 font-semibold text-lg mb-4">
            Data
          </Text>
          <Card padding="none">
            <TouchableOpacity
              onPress={handleClearCache}
              className="p-4 flex-row items-center"
            >
              <View className="bg-gray-100 w-12 h-12 rounded-full items-center justify-center mr-3">
                <Ionicons name="trash-outline" size={24} color="#374151" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Clear Cache</Text>
                <Text className="text-gray-500 text-sm">Free up storage space</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </Card>
        </View>

        {/* About */}
        <View className="px-6 mb-8">
          <Card>
            <View className="items-center py-4">
              <Text className="text-gray-900 font-semibold text-lg mb-2">
                Finance Tracker
              </Text>
              <Text className="text-gray-500 text-sm mb-1">
                Version 1.0.0
              </Text>
              <Text className="text-gray-400 text-xs text-center">
                Track your expenses with ease
              </Text>
            </View>
          </Card>
        </View>

        {/* Sign Out Button */}
        <View className="px-6 pb-8">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-600 py-4 rounded-2xl active:bg-red-700 shadow-lg"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="log-out-outline" size={22} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">
                Sign Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}