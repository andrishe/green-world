import {
  Image,
  StyleSheet,
  Platform,
  Text,
  View,
  Alert,
  Pressable,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/context/GlobalProvider';
import { logout } from '@/lib/appwrite';
import { router } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { posts } from '@/data/data';
import Card from '@/components/Card';

export default function HomeScreen() {
  const { user } = useGlobalContext();

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Success', 'You have been logged out');
      router.replace('/logIn');
    } catch (error) {
      Alert.alert('Error', (error as any).message || 'Lout out failed');
    }
  };

  return (
    <SafeAreaView className="bg-white h-full px-4  ">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Card dataPost={item} />}
        ListHeaderComponent={() => (
          <View className="flex-row justify-between items-start mb-10 ">
            <View>
              <Text>Bonjour</Text>
              <Text>{user?.username}</Text>
            </View>
            <Pressable onPress={handleLogout}>
              <LogOut size={24} />
            </Pressable>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
