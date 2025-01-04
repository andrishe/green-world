import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { X, MapPin, NotebookText, NotebookPen } from 'lucide-react-native';
import { deleteFileFromDatabase } from '@/lib/appwrite';

type Creator = {
  username: string;
  avatar: string;
};

type CardProps = {
  dataPost: {
    title: string;
    image: string;
    address: string;
    description: string;
    creator: Creator;
  };
};

const Card = ({ dataPost }: CardProps) => {
  const handleDelete = async () => {
    try {
      await deleteFileFromDatabase('collectionId', 'documentId', 'fileId');
      Alert.alert('Success', 'File has been deleted');
    } catch (error) {
      Alert.alert('Error', (error as any).message || 'Failed to delete file');
    }
  };
  return (
    <View className="flex-col items-center px-4 py-4 mb-10 border-b border-grayWhite">
      <View className="flex-row items-start gap-3 w-full">
        <View className="flex-row items-center flex-1">
          <View className="w-[40px] h-[40px] rounded-full border border-primary justify-center items-center p-0.5">
            <Image
              source={{ uri: dataPost.creator.avatar }}
              resizeMode="contain"
              className="w-10 h-10 rounded-full"
            />
          </View>

          <View className="ml-3">
            <Text className="text-lg font-RobotoBold text-grayBlack">
              {dataPost.title}
            </Text>
            <Text className="text-sm font-RobotoRegular text-grayBlack">
              {dataPost.creator.username}
            </Text>
          </View>
        </View>

        <View>
          <TouchableOpacity
            className="justify-center items-center "
            onPress={handleDelete}
          >
            <X size={22} color="#455a64" />
          </TouchableOpacity>

          <TouchableOpacity className=" mt-2">
            <NotebookPen size={20} color="#455a64" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-4 w-full">
        <View className="flex-row items-center gap-2 mt-2">
          <MapPin size={16} color="#37474f" />
          <Text className="text-base font-RobotoRegular text-gray">
            {dataPost.address}
          </Text>
        </View>
        <View className="flex-row items-start gap-2 mt-2">
          <NotebookText size={16} color="#37474f" />
          <Text className="text-base font-RobotoRegular text-gray">
            {dataPost.description}
          </Text>
        </View>
      </View>

      <View className="w-full items-center mt-4">
        <Image
          source={{ uri: dataPost.image }}
          resizeMode="cover"
          className="w-full h-[240px] rounded-xl "
        />
      </View>
    </View>
  );
};

export default Card;
