import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import PuntosCard from '@/components/PuntosCard';

interface Transaccion {
  id: string;
  tipo: string;
  puntosAsignados: number;
  descripcion?: string;
  fecha: string;
}

export default function HomeScreen() {
  const { usuario, updateUser } = useAuth();
  const [historial, setHistorial] = useState<Transaccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch user data to get current points
      const userData = await api.get<any>(`/clientes/${usuario?.id}`);
      updateUser(userData);

      // Fetch transaction history
      const historialData = await api.get<Transaccion[]>(`/clientes/${usuario?.id}/historial`);
      setHistorial(historialData.slice(0, 5)); // Show last 5 transactions
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={historial}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <>
            <PuntosCard nombre={usuario?.nombre || ''} puntos={usuario?.puntosActuales || 0} />

            <View style={styles.historialSection}>
              <Text style={styles.sectionTitle}>Últimas Transacciones</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View style={styles.transactionLeft}>
              <Text style={styles.transactionType}>{item.tipo}</Text>
              <Text style={styles.transactionDesc}>{item.descripcion || 'Sin descripción'}</Text>
            </View>
            <Text style={[styles.transactionPoints, { color: item.puntosAsignados > 0 ? '#4CAF50' : '#FF6B6B' }]}>
              {item.puntosAsignados > 0 ? '+' : ''}{item.puntosAsignados}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay transacciones registradas</Text>
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
  historialSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  transactionItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flex: 1,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  transactionDesc: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  transactionPoints: {
    fontSize: 16,
    fontWeight: 'bold',
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
