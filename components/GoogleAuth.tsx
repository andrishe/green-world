import { View, Text, Image } from 'react-native';
import React from 'react';
import CustomButton from './CustomButton';
import { icons } from '../constants/icons';
import { authGoogle } from '@/lib/appwrite';

const GoogleAuth = () => {
  const handleGoogleSignIn = async () => {
    try {
      await authGoogle();
    } catch (error) {
      console.error('Google Sign In Error:', error);
    }
  };

  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-gray" />
        <Text className="text-lg text-grayBlack">Ou</Text>
        <View className="flex-1 h-[1px] bg-gray" />
      </View>

      <CustomButton
        containerStyles="mt-5 w-full shadow-none bg-white border border-primary"
        textStyles="text-primary"
        title="Se connecter Google"
        icon={
          <Image
            source={icons.google}
            resizeMode="contain"
            className="w-5 h-5"
          />
        }
        onPress={handleGoogleSignIn}
      />
    </View>
  );
};

export default GoogleAuth;
