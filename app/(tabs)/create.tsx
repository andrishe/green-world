import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Camera } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomField from '@/components/CustomField';
import CustomButton from '@/components/CustomButton';
import * as ImagePicker from 'expo-image-picker';
import { useGlobalContext } from '@/context/GlobalProvider';
import { createPost } from '@/lib/appwrite';
import { router } from 'expo-router';

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<{
    title: string;

    image: { uri: string } | null;
    description: string;
    address: string;
    creator?: string;
  }>({
    title: '',
    image: null,
    description: '',
    address: '',
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0] });
    }
  };

  const handleUpload = async () => {
    if (!form.title || !form.description || !form.address || !form.image) {
      return Alert.alert('Error', 'Veuillez remplir tous les champs');
    }

    if (!user) return Alert.alert('Error', 'Veuillez vous connecter');
    setUploading(true);

    try {
      await createPost({ ...form, creator: user.$id });
      Alert.alert('Success', 'Depot sauvage signalé avec succès');
      router.push('/home');
    } catch (error: any) {
      Alert.alert('Error', error.message || "Erreur lors de l'envoi");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-grayBlack font-RobotoBold">
          Signaler les depots sauvages
        </Text>

        <Text className="text-base text-gray font-RobotoRegular mb-10 mt-2">
          Remplissez le formulaire pour signaler un depot sauvage
        </Text>
        <CustomField
          label="Titre"
          placeholder="Entrez le titre"
          onChangeText={(text) => setForm({ ...form, title: text })}
          value={form.title}
          labelStyle=""
        />

        <CustomField
          label="Description"
          placeholder="Entrez la description"
          onChangeText={(text) => setForm({ ...form, description: text })}
          value={form.description}
          labelStyle=""
        />

        <CustomField
          label="Adresse"
          placeholder="Entrez l'adresse"
          onChangeText={(text) => setForm({ ...form, address: text })}
          value={form.address}
          labelStyle=""
        />
        <View className="mt-7 space-y-2">
          <View className="flex-row items-center space-x-2">
            <TouchableOpacity
              className=" rounded-lg p-2 w-full"
              onPress={pickImage}
            >
              {form.image ? (
                <Image
                  source={{ uri: form.image.uri }}
                  resizeMode="cover"
                  className="w-full h-64 rounded-lg"
                />
              ) : (
                <View className="h-16 px-4 justify-center items-center border border-green rounded-3xl flex-row space-x-2 gap-2 w-full">
                  <Camera size={24} color="#455a64" />
                  <View>
                    <Text className="text-base text-grayBlack font-RobotoRegular">
                      Ajouter une photo
                    </Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <CustomButton
          title="Envoyer"
          containerStyles="border border-secondary mt-10"
          textStyles="text-primary"
          onPress={handleUpload}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
