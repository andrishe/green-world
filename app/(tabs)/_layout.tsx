import { Tabs } from 'expo-router';
import { CirclePlus, House, UserCircle, UserRound } from 'lucide-react-native';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3a965f',
        tabBarInactiveTintColor: '#66ab82',

        tabBarLabelStyle: {
          fontFamily: 'RobotoMedium',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <House size={24} color={focused ? '#3a965f' : '#66ab82'} />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ focused }) => (
            <CirclePlus size={24} color={focused ? '#3a965f' : '#66ab82'} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <UserRound size={24} color={focused ? '#3a965f' : '#66ab82'} />
          ),
        }}
      />
    </Tabs>
  );
}
