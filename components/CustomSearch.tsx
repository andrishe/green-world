import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { Search } from 'lucide-react-native';

const CustomSearch = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState<string>();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setQuery('');
  }, []);
  return (
    <View
      className={`border-2 w-full h-14 px-6 bg-white rounded-2xl flex-row items-center space-x-4 ${
        isFocused ? 'border-primary' : 'border-green'
      }`}
    >
      <TextInput
        placeholder="Search"
        placeholderTextColor="#455a64"
        value={''}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChangeText={(text) => setQuery(text)}
        className="flex-1 text-base font-RobotoRegular text-grayBlack"
      />

      <TouchableOpacity>
        <Search size={24} color="#bfdbcb" />
      </TouchableOpacity>
    </View>
  );
};

export default CustomSearch;
