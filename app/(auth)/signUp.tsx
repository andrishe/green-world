import { View, Text, Image, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';

import { router, Link } from 'expo-router';
import CustomField from '@/components/CustomField';
import { Lock, Mail, User } from 'lucide-react-native';
import CustomButton from '@/components/CustomButton';
import GoogleAuth from '@/components/GoogleAuth';
import { createUser } from '@/lib/appwrite';

const signUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password || !form.username) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    setIsSubmitting(true);

    try {
      await createUser(form.email, form.password, form.username);
      router.replace('/logIn');
      Alert.alert('Succès', 'Compte créé avec succès');
    } catch (error) {
      Alert.alert(
        'Erreur',
        (error as any).message || 'Une erreur est survenue'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <ScrollView className="bg-white h-full px-4">
      <View>
        <Image
          source={require('../../assets/images/signup.png')}
          resizeMode="contain"
          className="w-full h-64 mt-10"
        />
      </View>

      <CustomField
        label="Nom"
        placeholder="Nom"
        value={form.username}
        icon={<User size={16} color={'#66ab82'} />}
        onChangeText={(text) => setForm({ ...form, username: text })}
        labelStyle="text-base font-RobotoRegular text-grayBlack mb-2"
      />
      <CustomField
        label="Email"
        placeholder="address@mail.com"
        value={form.email}
        icon={<Mail size={16} color={'#66ab82'} />}
        onChangeText={(text) => setForm({ ...form, email: text })}
        labelStyle="text-base font-RobotoRegular text-grayBlack mb-2"
      />

      <CustomField
        label="Mot de passe"
        placeholder="Mot de passe"
        value={form.password}
        icon={<Lock size={16} color={'#66ab82'} />}
        onChangeText={(text) => setForm({ ...form, password: text })}
        labelStyle="text-base font-RobotoRegular text-grayBlack mb-2"
        secureTextEntry={true}
      />

      <CustomButton
        title="Se connecter"
        onPress={handleSubmit}
        containerStyles="bg-primary mt-8"
        textStyles="text-white"
      />

      <GoogleAuth />

      <Link
        href="/logIn"
        className="text-gray font-RobotoRegular text-center text-lg mt-4"
      >
        <Text>Je n'ai pas de compte? </Text>
        <Text className="text-primary">Inscrivez-vous</Text>
      </Link>
    </ScrollView>
  );
};

export default signUp;
