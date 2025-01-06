import React, { useState } from 'react';
import { Image, Text, View, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getAllPosts } from '@/lib/appwrite';

import Card from '@/components/Card';
import CustomSearch from '@/components/CustomSearch';
import useFetchData from '@/hooks/useFetchData';
import ImageTrending from '@/components/ImageTrending';

type Creator = {
  username: string;
  avatar: string;
};

type Post = {
  $id: string;
  title: string;
  image: string;
  address: string;
  description: string;
  creator: Creator;
};

export default function HomeScreen() {
  const { user } = useGlobalContext();
  const { data: rawPosts, refresh } = useFetchData(getAllPosts);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };
  const posts: Post[] =
    rawPosts?.map((item) => ({
      $id: item.$id,
      title: item.title || 'Titre non disponible',
      image: item.image || '',
      address: item.address || 'Adresse non disponible',
      description: item.description || 'Description non disponible',
      creator: {
        username: item.creator?.username || 'Inconnu',
        avatar: item.creator?.avatar || 'https://default-avatar.com/avatar.png',
      },
    })) || [];

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={posts}
        keyExtractor={(item: Post) => item.$id}
        renderItem={({ item }) => (
          <Card
            dataPost={{
              $id: item.$id,
              title: item.title,
              image: item.image,
              address: item.address,
              description: item.description,
              creator: {
                username: item.creator.username,
                avatar: item.creator.avatar,
              },
            }}
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 space-y-6 px-4">
            {/* Greeting Section */}
            <View className="mb-10 flex-row justify-between items-center">
              <Text className="font-RobotoRegular text-sm text-grayBlack">
                Bonjour{' '}
                <Text className="text-base font-RobotoMedium text-gray">
                  {user?.username} 👋
                </Text>
              </Text>
              <Image
                source={require('../../assets/images/ecolo.png')}
                className="w-8 h-8"
                resizeMode="contain"
              />
            </View>

            {/* Search Component */}
            <CustomSearch />

            {/* Trending Images */}
            <ImageTrending />
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
