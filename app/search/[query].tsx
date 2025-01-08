import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  CircleChevronLeft,
  FileSearch,
  FileWarning,
} from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import useFetchData from '@/hooks/useFetchData';
import Card from '@/components/Card';
import CustomSearch from '@/components/CustomSearch';
import { searchPosts } from '@/lib/appwrite';
import { router } from 'expo-router';

const SearchQuery = () => {
  const { query } = useLocalSearchParams();

  const { data: posts, refresh } = useFetchData(() =>
    searchPosts(query as string)
  );

  useEffect(() => {
    refresh();
  }, [query]);

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
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
          <View className="my-6 px-4">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-base font-RobotoRegular text-grayBlack">
                {posts.length === 0
                  ? 'Aucun résultat trouvé'
                  : posts.length === 1
                  ? '1 Résultat trouvé'
                  : `${posts.length} Résultats trouvés`}
              </Text>

              <TouchableOpacity onPress={() => router.push('/home')}>
                <ArrowLeft size={22} color="#455a64" />
              </TouchableOpacity>
            </View>

            <View className="mt-6 mb-8">
              <CustomSearch
                value=""
                placeholder="Recherche de signalement"
                onChangeText={() => {}}
                otherStyles=""
                initialQuery={query as string}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex-col items-center justify-center mt-8">
            <FileSearch size={64} color="#455a64" />
            <Text className="text-lg font-RobotoRegular text-grayBlack mt-4">
              Aucun résultat trouvé pour {query}.
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default SearchQuery;
