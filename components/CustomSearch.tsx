import { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Search } from 'lucide-react-native';
import { usePathname, useRouter } from 'expo-router';

type CustomSearchProps = {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  otherStyles: string;
  initialQuery: string;
};

const CustomSearch: React.FC<CustomSearchProps> = ({
  value,
  placeholder,
  initialQuery,
  onChangeText,
  otherStyles,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const [query, setQuery] = useState<string>(initialQuery || '');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  return (
    <View
      className={`border-2 w-full h-14 px-6 bg-white rounded-2xl flex-row items-center space-x-4 ${
        isFocused ? 'border-primary' : 'border-green'
      }`}
    >
      <TextInput
        placeholderTextColor="#455a64"
        value={query}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        onChangeText={(text) => setQuery(text)}
        className="flex-1 text-base font-RobotoRegular text-grayBlack"
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              'Recherche vide',
              'Veuillez entrer un mot-clé pour effectuer une recherche dans la base de données.'
            );
          }
          if (pathname.startsWith('/search')) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}
      >
        <Search size={24} color="#bfdbcb" />
      </TouchableOpacity>
    </View>
  );
};

export default CustomSearch;
