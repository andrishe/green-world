import React, { useRef, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { getAllPosts, getLatestPosts } from '@/lib/appwrite';
import useFetchData from '@/hooks/useFetchData';

type ImageData = {
  $id: string;
  image: string;
};

const ImageTrending: React.FC = () => {
  const { data: latestPostsData } = useFetchData(getLatestPosts);
  const latestPosts: ImageData[] = latestPostsData.map((post: any) => ({
    $id: post.$id,
    image: post.image,
  }));
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList<ImageData>>(null);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / 350);
    setActiveIndex(index);
  };

  const renderItem = ({ item, index }: { item: ImageData; index: number }) => {
    const isActive = index === activeIndex;

    return (
      <Animatable.View
        className={`flex items-center justify-center ${
          isActive ? 'scale-110' : 'scale-95'
        } mb-5 mr-2`}
        animation={isActive ? 'pulse' : undefined}
        duration={500}
      >
        <Animatable.Image
          source={{ uri: item.image }}
          className="w-96 h-60 rounded-lg mb-2"
          resizeMode="cover"
        />
      </Animatable.View>
    );
  };

  return (
    <View className="flex-1 mt-10">
      <Text className="text-2xl font-RobotoMedium text-grayBlack mb-4">
        Derniers signalements
      </Text>
      <FlatList
        ref={flatListRef}
        data={latestPosts}
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default ImageTrending;
