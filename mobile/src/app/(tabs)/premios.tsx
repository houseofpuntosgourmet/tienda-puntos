import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';

interface Premio {
  id: string;
  nombre: string;
  descripcion?: string;
  puntosRequeridos: number;
  valor: number;
  cantidad?: number;
}

export default function PremiosScreen() {
  const router = useRouter();
  const { usuario } = useAuth();
  const [premios, setPremios] = useState<Premio[]>([]);
  const [filtro, setFiltro] = useState<'todos' | 'puedo' | 'no_puedo'>('todos');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPremios();
  }, []);

  const loadPremios = async () => {
    try {
      setLoading(true);
      const data = await api.get<Premio[]>('/premios');
      setPremios(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load prizes');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPremios();
    setRefreshing(false);
  };

  const getFilteredPremios = () => {
    const userPoints = usuario?.puntosActuales || 0;
    return premios.filter((premio) => {
      if (filtro === 'puedo') return userPoints >= premio.puntosRequeridos;
      if (filtro === 'no_puedo') return userPoints < premio.puntosRequeridos;
      return true;
    });
  };

  const handlePremioPress = (premio: Premio) => {
    const userPoints = usuario?.puntosActuales || 0;
    const canRedeem = userPoints >= premio.puntosRequeridos;

    if (!canRedeem) {
      Alert.alert(
        premio.nombre,
        `Puntos requeridos: ${premio.puntosRequeridos}\nTus puntos: ${userPoints}\n\n${premio.descripcion || 'Sin descripción'}\n\nNo tienes suficientes puntos`,
        [{ text: 'Ok', style: 'default' }]
      );
    } else {
      Alert.alert(
        premio.nombre,
        `Puntos requeridos: ${premio.puntosRequeridos}\nTus puntos: ${userPoints}\n\n${premio.descripcion || 'Sin descripción'}`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Canjear',
            onPress: () => handleCanje(premio),
            style: 'default',
          },
        ]
      );
    }
  };

  const handleCanje = async (premio: Premio) => {
    try {
      await api.post('/clientes/canjes', { premioId: premio.id });
      Alert.alert('¡Éxito!', 'Tu canje ha sido solicitado. El admin confirmará la entrega.');
      loadPremios(); // Refresh to update UI
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to redeem prize');
    }
  };

  const filteredPremios = getFilteredPremios();
  const userPoints = usuario?.puntosActuales || 0;

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterBtn, filtro === 'todos' && styles.filterBtnActive]}
          onPress={() => setFiltro('todos')}
        >
          <Text style={[styles.filterText, filtro === 'todos' && styles.filterTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, filtro === 'puedo' && styles.filterBtnActive]}
          onPress={() => setFiltro('puedo')}
        >
          <Text style={[styles.filterText, filtro === 'puedo' && styles.filterTextActive]}>
            Puedo Canjear
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, filtro === 'no_puedo' && styles.filterBtnActive]}
          onPress={() => setFiltro('no_puedo')}
        >
          <Text style={[styles.filterText, filtro === 'no_puedo' && styles.filterTextActive]}>
            No Puedo
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPremios}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => {
          const canRedeem = userPoints >= item.puntosRequeridos;
          return (
            <TouchableOpacity
              style={[styles.premioCard, !canRedeem && styles.premioCardDisabled]}
              onPress={() => handlePremioPress(item)}
            >
              <View style={styles.premioContent}>
                <Text style={styles.premioNombre}>{item.nombre}</Text>
                <Text style={styles.premioDesc}>{item.descripcion || 'Sin descripción'}</Text>
                <Text style={styles.premioValor}>${item.valor}</Text>
              </View>
              <View style={[styles.puntosRequired, canRedeem && styles.puntosRequiredOk]}>
                <Text style={styles.puntosRequiredText}>{item.puntosRequeridos}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay premios disponibles</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  filterBtnActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  premioCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  premioCardDisabled: {
    opacity: 0.6,
    borderLeftColor: '#ccc',
  },
  premioContent: {
    flex: 1,
  },
  premioNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  premioDesc: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  premioValor: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  puntosRequired: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  puntosRequiredOk: {
    backgroundColor: '#4CAF50',
  },
  puntosRequiredText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});
