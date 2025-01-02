import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { CircleX } from 'lucide-react-native';

type CardProps = {
  dataPost: {
    id: number;
    title: string;
    description: string;
    image: any; // Change to any to accommodate the imported image
    creator: string;
    avatar: string;
  };
};

const Card = ({ dataPost }: CardProps) => {
  return (
    <View
      className="flex-col items-center px-4 py-4 mb-10 rounded-xl border border-gray "
      style={styles.container}
    >
      <View className="flex-row items-start gap-3">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[40px] h-[40px] rounded-full border border-primary justify-center items-center p-0.5">
            <Image
              source={{ uri: dataPost.avatar }}
              resizeMode="contain"
              className="w-10 h-10 rounded-full"
            />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text className="text-sm font-RobotoRegular text-grayBlack">
              {dataPost.creator}
            </Text>
          </View>
        </View>

        <TouchableOpacity className="justify-center items-center">
          <CircleX size={30} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View className="mt-4">
        <Text className="text-lg font-RobotoBold text-grayBlack">
          {dataPost.title}
        </Text>
        <Text className="text-sm font-RobotoRegular text-gray">
          {dataPost.description}
        </Text>
      </View>

      <View>
        <Image
          source={dataPost.image}
          resizeMode="contain"
          className="w-[450px] h-[240px] mt-4 rounded-lg"
        />
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
