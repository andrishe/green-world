import {
  Image,
  Alert,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/context/GlobalProvider';
import { logout, getAllPosts } from '@/lib/appwrite';
import useFetchData from '@/hooks/useFetchData';
import { FileWarning, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import Card from '@/components/Card';

export default function Profile() {
  const { user } = useGlobalContext();
  const { data: posts, refresh } = useFetchData(getAllPosts);
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
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <Card
            dataPost={{
              $id: item.$id,
              title: item.title,
              image: item.image,
              address: item.address,
              description: item.description,
              creator: {
                username: item.creator.username,
                avatar: item.creator.avatar,
              },
            }}
          />
        )}
        ListHeaderComponent={() => (
          <View>
            <View className="w-full justify-center items-center  mb-8 px-4">
              <Text className="font-RobotoRegular text-3xl text-grayBlack">
                Profile
              </Text>

              <View className="w-[80px] h-[80px] border border-secondary rounded-full justify-center items-center mt-4">
                <Image
                  source={{ uri: user?.avatar }}
                  resizeMode="cover"
                  className="w-[95%] h-[95%] rounded-full"
                />
              </View>
              <Text className="font-RobotoRegular text-lg text-grayBlack mt-4">
                {user?.username}
              </Text>
              <Text className="font-RobotoRegular text-base text-gray mt-2">
                {user?.email}
              </Text>

              <View className="w-full justify-center items-center mt-6">
                <TouchableOpacity
                  className="flex-row items-center "
                  onPress={handleLogout}
                >
                  <LogOut size={20} color="#455a64" />
                  <Text className="font-RobotoRegular text-base text-grayBlack ml-2">
                    Déconnexion
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text className="font-RobotoBold text-2xl text-grayBlack px-4 mb-6 ">
              Mes signalements
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
