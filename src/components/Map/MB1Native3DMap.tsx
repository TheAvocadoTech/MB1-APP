import React, { Suspense, useMemo, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { Canvas, ObjectMap } from '@react-three/fiber/native';
import { useGLTF, OrbitControls } from '@react-three/drei/native';
import { FlatPathLayer } from './RFIDPathLayer';
import defaultReaders from '../../config/rfidReaders.json';
import { Asset } from 'expo-asset';
import { GLTF } from 'three-stdlib';

// const MB1_CAMPUS_GLB = require('../../assets/Images/GRFloor.glb');
const MB1_CAMPUS_GLB = require('../../assets/models/mb1-campus.glb');

const resolvedAsset = Image.resolveAssetSource(MB1_CAMPUS_GLB);

const FacilityModel = () => {
  const { scene } = useGLTF(resolvedAsset.uri);

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  return (
    <primitive
      object={clonedScene}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      scale={1}
    />
  );
};

// Require your optimized 7MB model path




export default FacilityModel;



// 1. Declare defaultReaders at the top level of the file

export const MB1Native3DMap = ({ liveData }: { liveData?: any }) => {
  const allReaders = liveData?.allReaders?.length ? liveData.allReaders : defaultReaders;
  const currentReader = liveData?.currentReader || defaultReaders[0];
  const currentSeq = currentReader.sequence || 1;
  const totalStops = allReaders.filter((r: any) => !r.isWaypoint).length;
  const progressPct = totalStops > 1 ? Math.round(((currentSeq - 1) / (totalStops - 1)) * 100) : 0;

  const [isManualCamera, setIsManualCamera] = useState(false);

  const handleRecenter = () => {
    setIsManualCamera(false);
  };

  return (
    <View style={styles.container}>
      <Canvas
        camera={{
          position: [0, 150, 100],
          fov: 45,
          near: 0.1,
          far: 100000,
        }}
        onTouchStart={() => setIsManualCamera(true)}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[15, 30, 15]} intensity={1.2} />
        <directionalLight position={[-15, 20, -15]} intensity={0.5} />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={2000}
          target={[0, 0, 0]}
        />

        <Suspense fallback={null}>
          <FacilityModel />
          <FlatPathLayer liveData={liveData} />
        </Suspense>
      </Canvas>

      {/* ── Status Overlay Card (Top Left) ── */}
      {/* <View style={styles.statusCard}>
        <View style={styles.liveDot} />
        <View style={styles.statusTextContainer}>
          <Text style={styles.statusLabel}>CURRENT LOCATION</Text>
          <Text style={styles.locationTitle}>{currentReader.location}</Text>
        </View>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>{progressPct}%</Text>
        </View>
      </View> */}

      {/* ── Recenter Floating Button (Appears when user rotates/pans map) ── */}
      {/* {isManualCamera && (
        <TouchableOpacity style={styles.recenterButton} onPress={handleRecenter}>
          <Text style={styles.recenterText}>🎯 Recenter</Text>
        </TouchableOpacity>
      )} */}
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
  statusCard: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
  },
  statusTextContainer: {
    flexDirection: 'column',
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 0.5,
  },
  locationTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1f2937',
  },
  progressBadge: {
    backgroundColor: '#e0f2fe',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0ea5e9',
  },
  recenterButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.5)',
    elevation: 5,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  recenterText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});