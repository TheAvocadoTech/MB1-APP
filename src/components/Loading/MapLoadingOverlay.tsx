import { useProgress } from "@react-three/drei/core";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export const MapLoadingOverlay = () => {
  const { active, progress } = useProgress();

  if (!active && progress === 100) return null;

  return (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="#0ea5e9" />
      <Text style={styles.loadingText}>
        Loading 3D Map... {progress < 100 ? `${Math.round(progress)}%` : ''}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#f8fafc',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  }
});