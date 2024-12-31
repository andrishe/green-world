import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  textStyles?: string;
  containerStyles?: string;
  icon?: React.ReactNode;
};

const CustomButton = ({
  title,
  textStyles,
  containerStyles,
  onPress,
  icon,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      className={`w-full py-4 rounded-3xl flex flex-row justify-center items-center ${containerStyles}`}
      onPress={onPress}
    >
      {icon && <View className="mr-2">{icon}</View>}
      <Text className={`text-center font-RobotoBold text-xl ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
