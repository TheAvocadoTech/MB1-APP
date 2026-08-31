import React, { Suspense, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import { useGLTF, OrbitControls } from '@react-three/drei/native';
import { DoubleSide, Mesh, MeshBasicMaterial, Vector3, RingGeometry, CircleGeometry } from 'three';
import { Asset } from 'expo-asset';

import { FlatPathLayer, pctToWorld } from './FlatPathLayer';
import defaultReaders from '../../config/rfidReaders.json';
import transform from '../../config/mapConfig.json';

const MB1_CAMPUS_GLB = require('../../assets/models/mb1-campus.glb');

// Static Geometries to avoid garbage collection spikes during touch events
const RING_GEO_1 = new RingGeometry(0.18, 0.22, 16);
const CIRCLE_GEO = new CircleGeometry(0.14, 16);
const READER_GEO = new CircleGeometry(0.12, 12);
const READER_MAT = new MeshBasicMaterial({ color: '#64748b', transparent: true, opacity: 0.5, side: DoubleSide });

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class MapErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Map Release Crash Captured:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Failed to load 3D Map</Text>
          <Text style={styles.errorSubtext}>
            {this.state.error?.message || 'Unable to render 3D canvas environment.'}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const MapLoadingUI = () => (
  <View style={styles.loadingOverlay} pointerEvents="none">
    <ActivityIndicator size="large" color="#0ea5e9" />
    <Text style={styles.loadingText}>Loading 3D Map...</Text>
  </View>
);

const ModelLoaderNotifier = ({ scene, onLoad }: { scene: any; onLoad: () => void }) => {
  const { gl, camera } = useThree();

  useEffect(() => {
    if (scene) {
      gl.compile(scene, camera);
      onLoad();
    }
  }, [scene, gl, camera, onLoad]);

  return null;
};

const FacilityModel = React.memo(({
  modelUri,
  liveTransform,
  onLoaded,
}: {
  modelUri: string;
  liveTransform?: any;
  onLoaded: () => void;
}) => {
  const { scene } = useGLTF(modelUri);
  const t = liveTransform || transform;

  return (
    <>
      <primitive
        object={scene}
        position={[t.position.x, t.position.y, t.position.z]}
        rotation={[0, t.rotationY, 0]}
        scale={t.scale}
      />
      <ModelLoaderNotifier scene={scene} onLoad={onLoaded} />
    </>
  );
});

const AllReadersMarkers = React.memo(({
  allReaders,
  nextCoords,
}: {
  allReaders: any[];
  nextCoords?: { x: number; y: number } | null;
}) => {
  const markers = useMemo(() => {
    return allReaders
      .filter((reader) => reader?.coords && Number.isFinite(reader.coords.x) && Number.isFinite(reader.coords.y))
      .filter((reader) => {
        if (!nextCoords) return true;
        return !(Math.abs(reader.coords.x - nextCoords.x) < 0.001 && Math.abs(reader.coords.y - nextCoords.y) < 0.001);
      })
      .map((reader, index) => ({
        key: reader.id || `reader-${index}`,
        position: pctToWorld(reader.coords.x, reader.coords.y, 0.04),
      }));
  }, [allReaders, nextCoords]);

  return (
    <group>
      {markers.map((m) => (
        <mesh key={m.key} position={m.position} rotation={[-Math.PI / 2, 0, 0]} geometry={READER_GEO} material={READER_MAT} />
      ))}
    </group>
  );
});

const NextLocationRing = React.memo(({ coords }: { coords?: { x: number; y: number } | null }) => {
  const meshRef1 = useRef<Mesh>(null);
  const materialRef1 = useRef<MeshBasicMaterial>(null);
  const meshRef2 = useRef<Mesh>(null);
  const materialRef2 = useRef<MeshBasicMaterial>(null);

  const positionTuple = useMemo((): [number, number, number] | null => {
    if (!coords || !Number.isFinite(coords.x) || !Number.isFinite(coords.y)) {
      return null;
    }
    return pctToWorld(coords.x, coords.y, 0.05);
  }, [coords?.x, coords?.y]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const SPEED = 3.5;

    const cycle1 = (time * SPEED) % 1;
    if (meshRef1.current) {
      const scale1 = 0.4 + cycle1 * 1.8;
      meshRef1.current.scale.set(scale1, scale1, 1);
    }
    if (materialRef1.current) {
      materialRef1.current.opacity = Math.pow(1 - cycle1, 1.5);
    }

    const cycle2 = (time * SPEED + 0.5) % 1;
    if (meshRef2.current) {
      const scale2 = 0.4 + cycle2 * 1.8;
      meshRef2.current.scale.set(scale2, scale2, 1);
    }
    if (materialRef2.current) {
      materialRef2.current.opacity = Math.pow(1 - cycle2, 1.5);
    }
  });

  if (!positionTuple) return null;

  return (
    <group position={positionTuple} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={meshRef1} geometry={RING_GEO_1}>
        <meshBasicMaterial ref={materialRef1} color="#84cc16" transparent side={DoubleSide} depthTest={false} />
        
      </mesh>

      <mesh ref={meshRef2} geometry={RING_GEO_1}>
        <meshBasicMaterial ref={materialRef2} color="#84cc16" transparent side={DoubleSide} depthTest={false} />
      </mesh>

      <mesh position={[0, 0, 0.001]} geometry={CIRCLE_GEO}>
        <meshBasicMaterial color="#84cc16" transparent opacity={0.9} side={DoubleSide} depthTest={false} />
      </mesh>
    </group>
  );
});

function NavigationCameraController({
  currentCoords,
  isManualCamera,
  setIsManualCamera,
  recenterTrigger,
}: {
  currentCoords: { x: number; y: number } | null | undefined;
  isManualCamera: boolean;
  setIsManualCamera: (val: boolean) => void;
  recenterTrigger: any;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const targetVec = useRef(new Vector3());
  const camVec = useRef(new Vector3());

  const isInteracting = useRef(false);
  const isManualRef = useRef(isManualCamera);
  const lastCoordsRef = useRef<{ x: number; y: number } | null>(null);

  const OVERHEAD_HEIGHT = 80;
  const X_OFFSET = 12;

  useEffect(() => {
    camera.up.set(0, 0, -1);
    camera.updateProjectionMatrix();
  }, [camera]);

  useEffect(() => {
    isManualRef.current = isManualCamera;
  }, [isManualCamera]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    // Gesture tracking without setting React state on touch start
    const handleStart = () => {
      isInteracting.current = true;
      if (!isManualRef.current) {
        isManualRef.current = true;
      }
    };

    const handleEnd = () => {
      isInteracting.current = false;
      // Delay state sync until gesture completes to keep touch fluid
      setIsManualCamera(true);
    };

    controls.addEventListener('start', handleStart);
    controls.addEventListener('end', handleEnd);

    return () => {
      controls.removeEventListener('start', handleStart);
      controls.removeEventListener('end', handleEnd);
    };
  }, [setIsManualCamera]);

  useEffect(() => {
    if (recenterTrigger) {
      isManualRef.current = false;
      setIsManualCamera(false);
      isInteracting.current = false;

      if (currentCoords && Number.isFinite(currentCoords.x) && Number.isFinite(currentCoords.y)) {
        const [cx, cy, cz] = pctToWorld(currentCoords.x, currentCoords.y, 0);

        targetVec.current.set(cx + X_OFFSET, cy, cz);
        camVec.current.set(cx + X_OFFSET, cy + OVERHEAD_HEIGHT, cz);

        if (controlsRef.current) {
          controlsRef.current.target.copy(targetVec.current);
          camera.position.copy(camVec.current);
          controlsRef.current.update();
        }
      }
    }
  }, [recenterTrigger, currentCoords, camera, setIsManualCamera]);

  useEffect(() => {
    if (currentCoords && Number.isFinite(currentCoords.x) && Number.isFinite(currentCoords.y)) {
      const prev = lastCoordsRef.current;
      const isNewReader = !prev || prev.x !== currentCoords.x || prev.y !== currentCoords.y;

      if (isNewReader) {
        lastCoordsRef.current = { x: currentCoords.x, y: currentCoords.y };

        const [cx, cy, cz] = pctToWorld(currentCoords.x, currentCoords.y, 0);

        targetVec.current.set(cx + X_OFFSET, cy, cz);
        camVec.current.set(cx + X_OFFSET, cy + OVERHEAD_HEIGHT, cz);

        if (controlsRef.current) {
          controlsRef.current.target.copy(targetVec.current);
          camera.position.copy(camVec.current);
          controlsRef.current.update();
        }

        isManualRef.current = false;
        setIsManualCamera(false);
        isInteracting.current = false;
      }
    }
  }, [currentCoords?.x, currentCoords?.y, camera, setIsManualCamera]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (!isManualRef.current && !isInteracting.current) {
      if (currentCoords && Number.isFinite(currentCoords.x) && Number.isFinite(currentCoords.y)) {
        const [cx, cy, cz] = pctToWorld(currentCoords.x, currentCoords.y, 0);

        targetVec.current.set(cx + X_OFFSET, cy, cz);
        camVec.current.set(cx + X_OFFSET, cy + OVERHEAD_HEIGHT, cz);

        const lerpFactor = Math.min(1.0, delta * 6.0);
        controls.target.lerp(targetVec.current, lerpFactor);
        camera.position.lerp(camVec.current, lerpFactor);
        controls.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping={true}
      dampingFactor={0.05}
      rotateSpeed={0.8}
      panSpeed={1.2}
      zoomSpeed={1.0}
      enablePan={true}
      screenSpacePanning={true}
      minDistance={2}
      maxDistance={200}
    />
  );
}

export const MB1Native3DMap = ({
  liveData,
  liveTransform,
}: {
  liveData?: any;
  liveTransform?: any;
}) => {
  const payload = liveData?.data || liveData;

  const allReaders = payload?.allReaders?.length ? payload.allReaders : defaultReaders;
  const currentReader = payload?.currentReader || liveData?.currentReader || defaultReaders[0];
  const currentSeq = currentReader?.sequence || 1;

  const remainingReaders = useMemo(() => {
    if (payload?.remainingPath?.length) {
      return payload.remainingPath;
    }
    return allReaders.filter((r: any) => r.sequence >= currentSeq);
  }, [payload, allReaders, currentSeq]);

  const currentCoords = currentReader?.coords;
  const nextCoords = remainingReaders.length > 1 ? remainingReaders[1]?.coords : null;

  const [localUri, setLocalUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isManualCamera, setIsManualCamera] = useState(false);
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function prepareAsset() {
      try {
        const asset = Asset.fromModule(MB1_CAMPUS_GLB);
        await asset.downloadAsync();
        if (isMounted) {
          setLocalUri(asset.localUri || asset.uri);
        }
      } catch (err) {
        console.error('Failed to unpack asset:', err);
      }
    }
    prepareAsset();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoaded = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleRecenter = () => {
    setIsManualCamera(false);
    setRecenterTrigger(Date.now());
  };

  return (
    <MapErrorBoundary>
      <View style={styles.container}>
        {isLoading && <MapLoadingUI />}

        {localUri && (
          <Canvas
            gl={{ 
              powerPreference: 'high-performance', 
              antialias: false,
              precision: 'lowp',
              logarithmicDepthBuffer: false,
            }}
            frameloop="always"
            camera={{
              position: [12, 80, 0],
              fov: 45,
              near: 0.1,
              far: 10000,
            }}>
            <ambientLight intensity={0.9} />
            <directionalLight position={[0, 80, 0]} intensity={1.2} />

            <Suspense fallback={null}>
              <FacilityModel
                modelUri={localUri}
                liveTransform={liveTransform}
                onLoaded={handleLoaded}
              />
              <FlatPathLayer liveData={liveData} />

              <AllReadersMarkers allReaders={allReaders} nextCoords={nextCoords} />
              <NextLocationRing coords={nextCoords} />

              <NavigationCameraController
                currentCoords={currentCoords}
                isManualCamera={isManualCamera}
                setIsManualCamera={setIsManualCamera}
                recenterTrigger={recenterTrigger}
              />
            </Suspense>
          </Canvas>
        )}

        {isManualCamera && !isLoading && (
          <TouchableOpacity style={styles.recenterButton} onPress={handleRecenter}>
            <Text style={styles.recenterText}>Recenter</Text>
          </TouchableOpacity>
        )}
      </View>
    </MapErrorBoundary>
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
  },
  recenterButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#334155',
    elevation: 5,
  },
  recenterText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
  },
  errorSubtext: {
    marginTop: 8,
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});