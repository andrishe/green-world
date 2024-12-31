import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import React from 'react';
import { View, Image, Text } from 'react-native';

const App = () => {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 bg-white justify-center items-center">
        <Image
          source={require('../assets/images/ecoLogin.png')}
          resizeMode="contain"
          className="w-full h-72 mt-10"
        />

        <Text className="text-grayBlack font-RobotoBold font-extrabold text-center text-5xl mt-4 ">
          GreenWorld
        </Text>

        <Text className="text-gray font-RobotoRegular text-center text-lg  ">
          Protégeons nos espaces, un signalement à la fois
        </Text>
      </View>

      <View className="flex-1 bg-primary justify-center items-center rounded-[36px] px-4">
        <CustomButton
          title="Bienvenue"
          containerStyles="bg-white"
          textStyles="text-grayBlack"
          onPress={() => router.replace('/signIn')}
        />
      </View>
    </View>
  );
};

export default App;
