import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#eee',
          borderTopWidth: 1,
          paddingBottom: 4,
        },
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          headerTitle: 'Mis Puntos',
          tabBarIcon: ({ color, size }: any) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="premios"
        options={{
          title: 'Premios',
          headerTitle: 'Canjea Premios',
          tabBarIcon: ({ color, size }: any) => <Ionicons name="gift" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          headerTitle: 'Mi Perfil',
          tabBarIcon: ({ color, size }: any) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
