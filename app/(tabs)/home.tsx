import {
  Image,
  StyleSheet,
  Platform,
  Text,
  View,
  Alert,
  Pressable,
  FlatList,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/context/GlobalProvider';
import { logout, getAllPosts, deleteFileFromDatabase } from '@/lib/appwrite';
import { router } from 'expo-router';
import { LogOut } from 'lucide-react-native';

import Card from '@/components/Card';
import CustomSearch from '@/components/CustomSearch';
import useFetchData from '@/hooks/useFetchData';

export default function HomeScreen() {
  const { user } = useGlobalContext();
  const { data: posts, refresh } = useFetchData(getAllPosts);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Success', 'You have been logged out');
      router.replace('/logIn');
    } catch (error) {
      Alert.alert('Error', (error as any).message || 'Lout out failed');
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <Card dataPost={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 space-y-6 px-4 ">
            <View className="mb-10">
              <Text className="font-RobotoRegular text-sm text-grayBlack ">
                Bonjour{' '}
                <Text className="text-base font-RobotoMedium text-gray ">
                  {user?.username} 👋
                </Text>
              </Text>
            </View>

            <CustomSearch />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
