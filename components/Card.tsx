import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { X, MapPin, NotebookText, NotebookPen } from 'lucide-react-native';
import CustomField from '@/components/CustomField';
import CustomButton from '@/components/CustomButton';
import { deleteSelectedPost, updatePost } from '@/lib/appwrite';

type Creator = {
  username: string;
  avatar: string;
};

type CardProps = {
  dataPost: {
    $id: string;
    title: string;
    image: string;
    address: string;
    description: string;
    creator: Creator;
  };
};

const Card = ({ dataPost }: CardProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    title: dataPost.title,
    description: dataPost.description,
    address: dataPost.address,
  });

  const handleDelete = async () => {
    try {
      if (!dataPost.$id) {
        Alert.alert('Error', 'Post ID not found');
        return;
      }

      await deleteSelectedPost(dataPost);
      Alert.alert('Success', 'Post supprimé avec succès');
      // Mettre à jour la liste des posts si nécessaire
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Erreur lors de la suppression');
    }
  };

  const handleSave = async () => {
    try {
      if (!dataPost.$id) {
        Alert.alert('Erreur', 'ID du post introuvable');
        return;
      }

      const updatedData = {
        title: form.title,
        description: form.description,
        address: form.address,
      };

      await updatePost(dataPost.$id, updatedData);
      Alert.alert('Succès', 'Les modifications ont été sauvegardées');
      setModalVisible(false);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Échec de la mise à jour du post');
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
          <TouchableOpacity onPress={handleDelete}>
            <X size={20} color="#455a64" />
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-2"
            onPress={() => setModalVisible(true)}
          >
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
          className="w-full h-[240px] rounded-xl"
        />
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          activeOpacity={1}
          onPress={() => setModalVisible(false)} // Fermeture en cliquant à l'extérieur
        >
          <View className="w-full bg-white rounded-xl p-10 mx-auto mt-60">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="absolute top-4 right-4 bg-gray-800 p-2 rounded-full"
            >
              <X size={24} color="#455a64" />
            </TouchableOpacity>

            <ScrollView>
              <Text className="text-lg font-RobotoBold text-grayBlack mb-4">
                Modifier votre signalement
              </Text>

              <CustomField
                label="Titre"
                placeholder="Entrez le titre"
                value={form.title}
                onChangeText={(text) => setForm({ ...form, title: text })}
                labelStyle=""
              />

              <CustomField
                label="Description"
                placeholder="Entrez la description"
                value={form.description}
                onChangeText={(text) => setForm({ ...form, description: text })}
                labelStyle=""
              />

              <CustomField
                label="Adresse"
                placeholder="Entrez l'adresse"
                value={form.address}
                onChangeText={(text) => setForm({ ...form, address: text })}
                labelStyle=""
              />

              <CustomButton
                title="Modifier"
                containerStyles="border border-secondary mt-10"
                textStyles="text-primary"
                onPress={handleSave}
              />
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Card;
