import { View, Text, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';

import { router, Link } from 'expo-router';
import CustomField from '@/components/CustomField';
import { Lock, Mail } from 'lucide-react-native';
import CustomButton from '@/components/CustomButton';
import GoogleAuth from '@/components/GoogleAuth';

const signUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
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
        icon={<Mail size={16} color={'#66ab82'} />}
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
        onPress={() => router.push('/signIn')}
        containerStyles="bg-primary mt-8"
        textStyles="text-white"
      />

      <GoogleAuth />

      <Link
        href="/signIn"
        className="text-gray font-RobotoRegular text-center text-lg mt-4"
      >
        <Text>Je n'ai pas de compte? </Text>
        <Text className="text-primary">Inscrivez-vous</Text>
      </Link>
    </ScrollView>
  );
};

export default signUp;
