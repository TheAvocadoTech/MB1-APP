import React, { Suspense, useMemo, useRef } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Canvas, useThree } from '@react-three/fiber/native';
import { useGLTF } from '@react-three/drei/native';
import * as THREE from 'three';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import defaultReaders from '../../config/rfidReaders.json';

const MB1_CAMPUS_GLB = require('../../assets/models/mb1-campus.glb');
const resolvedAsset = Image.resolveAssetSource(MB1_CAMPUS_GLB);

export const MB1Native3DMap = () => {
  return (
    <View style={styles.container}>
      <Canvas
        gl={{
          antialias: true,
        }}
        camera={{
          near: 0.1,
          far: 10000,
          position: [0, 30, 90],
          up: [0, 1, 0],
        }}
      >
        <ambientLight intensity={0.8} />

        <directionalLight
          position={[10, 20, 10]}
          intensity={1.5}
        />

        <Suspense fallback={null}>
          <MB1R3FMap url={resolvedAsset?.uri} />
        </Suspense>
      </Canvas>
    </View>
  );
};

interface MB1R3FMapProps {
  url?: string;
}

const MB1R3FMap = ({ url }: MB1R3FMapProps) => {
  const { camera } = useThree();

  const target = useMemo(
    () => new THREE.Vector3(0, 20, 0),
    []
  );

  const stateRef = useRef({
    startX: 0,
    startY: 0,

    currentAzimuth: 0,

    currentPolar: Math.atan2(
      90,
      30
    ),

    radius: Math.sqrt(
      30 * 30 +
      90 * 90
    ),
  });

  if (!url) {
    return null;
  }

  const { scene } = useGLTF(url);

  React.useEffect(() => {
    camera.position.set(0, 30, 90);
    camera.lookAt(target);
  }, [camera, target]);

  const panGesture = Gesture.Pan()
    .minPointers(1)
    .maxPointers(1)
    .runOnJS(true)
    .onBegin(() => {
      stateRef.current.startX = 0;
      stateRef.current.startY = 0;
    })
    .onUpdate((event) => {
      const state = stateRef.current;

      const deltaX =
        event.translationX -
        state.startX;

      const deltaY =
        event.translationY -
        state.startY;

      state.startX = event.translationX;
      state.startY = event.translationY;

      state.currentAzimuth -=
        deltaX * 0.005;

      state.currentPolar = Math.max(
        0.1,
        Math.min(
          Math.PI / 2 - 0.05,
          state.currentPolar -
            deltaY * 0.005
        )
      );

      const newPosition =
        new THREE.Vector3();

      newPosition.setFromSphericalCoords(
        state.radius,
        state.currentPolar,
        state.currentAzimuth
      );

      camera.position
        .copy(newPosition)
        .add(target);

      camera.lookAt(target);
    });

  return (
    <GestureDetector gesture={panGesture}>
      <primitive
        object={scene}
        scale={1}
      />
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
});