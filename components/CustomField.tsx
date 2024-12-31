import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react-native';

type CustomFieldProps = {
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  onChangeText: (text: string) => void;
  value: string;
  containerStyles?: string;
  labelStyle: string;

  secureTextEntry?: boolean;
  inputStyle?: string;
  iconStyle?: string;
};

const CustomField = ({
  label,
  placeholder,
  value,
  containerStyles,
  labelStyle,
  icon,
  iconRight,
  onChangeText,

  secureTextEntry,
  inputStyle,
  iconStyle,
  ...props
}: CustomFieldProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  return (
    <View className="my-2 w-full">
      <Text
        className={`text-lg font-RobotoRegular text-grayBlack mb-3 ${labelStyle}`}
      >
        {label}
      </Text>
      <View
        className={`flex flex-row justify-start items-center relative bg-White rounded-3xl border ${
          isFocused ? 'border-primary' : 'border-green'
        } ${containerStyles}`}
      >
        {icon && <View className={`ml-4 ${iconStyle}`}>{icon}</View>}
        <TextInput
          className={`rounded-full p-4 font-RobotoMedium text-[15px] flex-1 ${inputStyle} text-left`}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            className="mr-4"
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? (
              <EyeOff size={18} color="#66ab82" />
            ) : (
              <Eye size={18} color="#66ab82" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomField;
