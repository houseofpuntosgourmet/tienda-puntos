import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PuntosCardProps {
  nombre: string;
  puntos: number;
}

export default function PuntosCard({ nombre, puntos }: PuntosCardProps) {
  const maxPuntos = Math.max(puntos * 1.5, 1000); // Dynamic max for progress bar
  const progressPercent = Math.min((puntos / maxPuntos) * 100, 100);

  return (
    <View style={styles.card}>
      <Text style={styles.greeting}>¡Hola, {nombre}!</Text>

      <View style={styles.puntosContainer}>
        <Text style={styles.puntosLabel}>Tus Puntos</Text>
        <Text style={styles.puntosValue}>{puntos}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progressPercent}%` }]}
          />
        </View>
        <Text style={styles.progressText}>
          {progressPercent.toFixed(0)}% hacia el próximo nivel
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  greeting: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  puntosContainer: {
    marginBottom: 20,
  },
  puntosLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  puntosValue: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
});
