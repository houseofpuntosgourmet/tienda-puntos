import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';

export default function PerfilScreen() {
  const router = useRouter();
  const { usuario, logout, updateUser } = useAuth();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [email, setEmail] = useState(usuario?.email || '');
  const [cumpleaños, setCumpleaños] = useState(usuario?.cumpleaños || '');
  const [loading, setLoading] = useState(false);

  const handleUpdatePerfil = async () => {
    setLoading(true);
    try {
      const updated = await api.put<any>(`/clientes/${usuario?.id}`, {
        nombre,
        email: email || undefined,
        cumpleaños: cumpleaños || undefined,
      });
      updateUser(updated as any);
      setEditModalVisible(false);
      Alert.alert('¡Éxito!', 'Perfil actualizado correctamente');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Información Personal</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Nombre</Text>
          <Text style={styles.value}>{usuario?.nombre}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>WhatsApp</Text>
          <Text style={styles.value}>{usuario?.whatsapp}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>DNI</Text>
          <Text style={styles.value}>{usuario?.dni}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{usuario?.email || 'No registrado'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Cumpleaños</Text>
          <Text style={styles.value}>{usuario?.cumpleaños || 'No registrado'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => setEditModalVisible(true)}>
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Text style={styles.modalCloseText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TouchableOpacity onPress={handleUpdatePerfil} disabled={loading}>
              <Text style={[styles.modalSaveText, loading && styles.modalSaveTextDisabled]}>
                {loading ? 'Guardando...' : 'Guardar'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalForm}>
            <Text style={styles.inputLabel}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              editable={!loading}
            />

            <Text style={styles.inputLabel}>Email (opcional)</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!loading}
            />

            <Text style={styles.inputLabel}>Cumpleaños (YYYY-MM-DD) (opcional)</Text>
            <TextInput
              style={styles.input}
              value={cumpleaños}
              onChangeText={setCumpleaños}
              editable={!loading}
            />
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  infoRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 12,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalCloseText: {
    color: '#007AFF',
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalSaveText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSaveTextDisabled: {
    opacity: 0.5,
  },
  modalForm: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
});
