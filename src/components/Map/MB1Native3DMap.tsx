import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import { useGLTF, OrbitControls } from '@react-three/drei/native';
import { DoubleSide, MathUtils, Mesh, MeshBasicMaterial, Vector2, Vector3 } from 'three';

import { FlatPathLayer, pctToWorld } from './FlatPathLayer';
import defaultReaders from '../../config/rfidReaders.json';
import transform from '../../config/mapConfig.json';

const MB1_CAMPUS_GLB = require('../../assets/models/mb1-campus.glb');
const resolvedAsset = Image.resolveAssetSource(MB1_CAMPUS_GLB);

const FLOOR_WIDTH = 40;
const FLOOR_DEPTH = 28;

// ---------------------------------------------------------------------------
// Helpers & Math
// ---------------------------------------------------------------------------
const computeAngle = (from: [number, number, number], to: [number, number, number]): number => {
  const dx = to[0] - from[0];
  const dz = to[2] - from[2];
  if (Math.abs(dx) < 0.0001 && Math.abs(dz) < 0.0001) return 0;
  return Math.atan2(dx, dz);
};

// ---------------------------------------------------------------------------
// 1. Facility GLTF Model
// ---------------------------------------------------------------------------
const FacilityModel = ({ liveTransform }: { liveTransform?: any }) => {
  const { scene } = useGLTF(resolvedAsset.uri);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  const t = liveTransform || transform;

  return (
    <primitive
      object={clonedScene}
      position={[t.position.x, t.position.y, t.position.z]}
      rotation={[0, t.rotationY, 0]}
      scale={t.scale}
    />
  );
};

// ---------------------------------------------------------------------------
// 2. Render All Readers as Static Round Circles (Excludes Active Next Target)
// ---------------------------------------------------------------------------
const AllReadersMarkers = ({
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
        <mesh key={m.key} position={m.position} rotation={[-Math.PI / 2, 0, 0]}>
          {/* Reduced radius from 0.5 to 0.25 */}
          <circleGeometry args={[0.25, 32]} />
          <meshBasicMaterial color="#64748b" transparent opacity={0.5} side={DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

// ---------------------------------------------------------------------------
// 3. Lime Green Pulsing Ring ONLY at NEXT READER Target (#84cc16)
// ---------------------------------------------------------------------------
const NextLocationRing = ({ coords }: { coords?: { x: number; y: number } | null }) => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshBasicMaterial>(null);

  const positionTuple = useMemo((): [number, number, number] | null => {
    if (!coords || !Number.isFinite(coords.x) || !Number.isFinite(coords.y)) {
      return null;
    }
    return pctToWorld(coords.x, coords.y, 0.05);
  }, [coords?.x, coords?.y]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const cycle = (time * 2) % 1; // 0.5s pulse loop

    if (meshRef.current) {
      // Reduced max pulse scale expansion (0.6 -> 1.1 instead of 0.8 -> 2.0)
      const scale = 0.6 + cycle * 0.5;
      meshRef.current.scale.set(scale, scale, 1);
    }
    if (materialRef.current) {
      materialRef.current.opacity = 1 - cycle;
    }
  });

  if (!positionTuple) return null;

  return (
    <group position={positionTuple} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer Lime Pulsing Ring (Reduced radius args from [0.8, 1.1] to [0.4, 0.55]) */}
      <mesh ref={meshRef}>
        <ringGeometry args={[0.4, 0.55, 32]} />
        <meshBasicMaterial ref={materialRef} color="#84cc16" transparent side={DoubleSide} />
      </mesh>

      {/* Inner Solid Core (Reduced radius args from 0.7 to 0.35) */}
      <mesh>
        <circleGeometry args={[0.35, 32]} />
        <meshBasicMaterial color="#84cc16" transparent opacity={0.8} side={DoubleSide} />
      </mesh>
    </group>
  );
};

// ---------------------------------------------------------------------------
// 4. Cyan Chevrons (>25° Turns) & Orientation Arrow (#06b6d4)
// ---------------------------------------------------------------------------
const DirectionalOverlay = ({ remainingPath }: { remainingPath: any[] }) => {
  const { chevrons, activeVector } = useMemo(() => {
    if (!remainingPath || remainingPath.length < 2) {
      return { chevrons: [], activeVector: null };
    }

    const pointsWithData = remainingPath
      .filter(
        (item) =>
          item?.coords &&
          Number.isFinite(item.coords.x) &&
          Number.isFinite(item.coords.y)
      )
      .map((item) => ({
        point: pctToWorld(item.coords.x, item.coords.y, 0.05),
        id: item.id || item.readerId || `${item.coords.x}-${item.coords.y}`,
      }));

    if (pointsWithData.length < 2) {
      return { chevrons: [], activeVector: null };
    }

    const turnChevrons: Array<{ key: string; position: [number, number, number]; rotation: number }> = [];

    // Identify turns sharper than 25 degrees
    for (let i = 0; i < pointsWithData.length - 2; i++) {
      const p1 = pointsWithData[i].point;
      const p2 = pointsWithData[i + 1].point;
      const p3 = pointsWithData[i + 2].point;

      const v1 = new Vector2(p2[0] - p1[0], p2[2] - p1[2]);
      const v2 = new Vector2(p3[0] - p2[0], p3[2] - p2[2]);

      if (v1.lengthSq() < 0.0001 || v2.lengthSq() < 0.0001) continue;

      const dir1 = v1.normalize();
      const dir2 = v2.normalize();

      const dot = MathUtils.clamp(dir1.dot(dir2), -1, 1);
      const angleRad = Math.acos(dot);
      const angleDeg = MathUtils.radToDeg(angleRad);

      if (!Number.isNaN(angleDeg) && angleDeg > 25) {
        const turnAngle = computeAngle(p2, p3);
        turnChevrons.push({
          key: `chevron-${pointsWithData[i + 1].id}-${i}`,
          position: [p2[0], p2[1] + 0.02, p2[2]],
          rotation: Number.isNaN(turnAngle) ? 0 : turnAngle,
        });
      }
    }

    // Orientation arrow for active segment
    const currentPos = pointsWithData[0].point;
    const nextPos = pointsWithData[1].point;
    const arrowAngle = computeAngle(currentPos, nextPos);

    return {
      chevrons: turnChevrons,
      activeVector: {
        position: [currentPos[0], currentPos[1] + 0.05, currentPos[2]] as [number, number, number],
        rotation: Number.isNaN(arrowAngle) ? 0 : arrowAngle,
      },
    };
  }, [remainingPath]);

  return (
    <group>
      {/* Cyan Chevrons */}
      {chevrons.map((chev) => (
        <group
          key={chev.key}
          position={chev.position}
          rotation={[-Math.PI / 2, 0, chev.rotation]}
        >
          <mesh>
            <ringGeometry args={[0.5, 0.7, 3, 1, 0, Math.PI]} />
            <meshBasicMaterial color="#06b6d4" side={DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* Orientation Cone */}
      {activeVector && (
        <group
          position={activeVector.position}
          rotation={[0, activeVector.rotation, 0]}
        >
          <mesh position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.5, 1.2, 16]} />
            <meshBasicMaterial color="#06b6d4" />
          </mesh>
        </group>
      )}
    </group>
  );
};

// ---------------------------------------------------------------------------
// 5. Navigation Camera Controller & Orbit Controls
// ---------------------------------------------------------------------------
function NavigationCameraController({
  currentCoords,
  nextCoords,
  isManualCamera,
  setIsManualCamera,
  recenterTrigger,
}: {
  currentCoords: any;
  nextCoords: any;
  isManualCamera: boolean;
  setIsManualCamera: (val: boolean) => void;
  recenterTrigger: any;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const targetVec = useRef(new Vector3());
  const camVec = useRef(new Vector3());
  const isDragging = useRef(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleStart = () => {
      isDragging.current = true;
      setIsManualCamera(true);
    };
    const handleEnd = () => {
      isDragging.current = false;
    };

    controls.addEventListener('start', handleStart);
    controls.addEventListener('end', handleEnd);
    return () => {
      controls.removeEventListener('start', handleStart);
      controls.removeEventListener('end', handleEnd);
    };
  }, [setIsManualCamera]);

  // Recenter when requested or when current location changes initially
  useEffect(() => {
    if (recenterTrigger) {
      setIsManualCamera(false);
      isDragging.current = false;
    }
  }, [recenterTrigger, setIsManualCamera]);

  useFrame((_, delta) => {
    if (!currentCoords || typeof currentCoords.x !== 'number' || typeof currentCoords.y !== 'number') return;

    const [cx, cy, cz] = pctToWorld(currentCoords.x, currentCoords.y, 0.3);
    const camDist = 12;
    const camHeight = 10;

    targetVec.current.set(cx, cy, cz);
    camVec.current.set(cx, cy + camHeight, cz + camDist);

    if (controlsRef.current) {
      // 1. INSTANT FOCUS ON FIRST LOAD: Jump immediately to current reader position without lerp lag
      if (!hasInitialized.current) {
        controlsRef.current.target.copy(targetVec.current);
        camera.position.copy(camVec.current);
        controlsRef.current.update();
        hasInitialized.current = true;
        return;
      }

      // 2. Continuous tracking if user is not manually dragging
      if (!isManualCamera && !isDragging.current) {
        const lerpFactor = Math.min(1.0, delta * 4.5);
        controlsRef.current.target.lerp(targetVec.current, lerpFactor);
        camera.position.lerp(camVec.current, lerpFactor);
        controlsRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping={true}
      dampingFactor={0.12}
      rotateSpeed={0.8}
      panSpeed={1.0}
      zoomSpeed={1.0}
      maxPolarAngle={Math.PI / 2 - 0.05}
      minDistance={2}
      maxDistance={75}
    />
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export const MB1Native3DMap = ({
  liveData,
  liveTransform,
}: {
  liveData?: any;
  liveTransform?: any;
}) => {
  const allReaders = liveData?.allReaders?.length ? liveData.allReaders : defaultReaders;
  const currentReader = liveData?.currentReader || defaultReaders[0];
  const currentSeq = currentReader?.sequence || 1;
  const totalStops = allReaders.filter((r: any) => !r.isWaypoint).length;
  const progressPct = totalStops > 1 ? Math.round(((currentSeq - 1) / (totalStops - 1)) * 100) : 0;

  const remainingReaders = useMemo(() => {
    if (liveData?.data?.remainingPath?.length) {
      return liveData.data.remainingPath;
    }
    if (liveData?.remainingPath?.length) {
      return liveData.remainingPath;
    }
    return allReaders.filter((r: any) => r.sequence >= currentSeq);
  }, [liveData, allReaders, currentSeq]);

  const currentCoords = currentReader?.coords;
  const nextCoords = remainingReaders.length > 1 ? remainingReaders[1]?.coords : null;

  const [isManualCamera, setIsManualCamera] = useState(false);
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  const handleRecenter = () => {
    setIsManualCamera(false);
    setRecenterTrigger(Date.now());
  };

  return (
    <View style={styles.container}>
      <Canvas
        camera={{
          position: [0, 25, 25],
          fov: 45,
          near: 0.1,
          far: 100000,
        }}
        onTouchStart={() => setIsManualCamera(true)}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[15, 30, 15]} intensity={1.2} />
        <directionalLight position={[-15, 20, -15]} intensity={0.5} />

        <Suspense fallback={null}>
          <FacilityModel liveTransform={liveTransform} />
          <FlatPathLayer liveData={liveData} />

          {/* All reader locations as neutral circular dots */}
          <AllReadersMarkers allReaders={allReaders} nextCoords={nextCoords} />

          {/* Lime Green Pulsing Ring rendered strictly at nextCoords */}
          <NextLocationRing coords={nextCoords} />
          {/* <DirectionalOverlay remainingPath={remainingReaders} /> */}

          <NavigationCameraController
            currentCoords={currentCoords}
            nextCoords={nextCoords}
            isManualCamera={isManualCamera}
            setIsManualCamera={setIsManualCamera}
            recenterTrigger={recenterTrigger}
          />
        </Suspense>
      </Canvas>

      {/* Status Overlay */}
      {/* <View style={styles.statusCard}>
        <View style={styles.liveDot} />
        <View style={styles.statusTextContainer}>
          <Text style={styles.statusLabel}>CURRENT LOCATION</Text>
          <Text style={styles.locationTitle}>{currentReader?.location || 'Unknown'}</Text>
        </View>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>{progressPct}%</Text>
        </View>
      </View> */}

      {/* Recenter Button */}
      {isManualCamera && (
        <TouchableOpacity style={styles.recenterButton} onPress={handleRecenter}>
          <Text style={styles.recenterText}>Recenter</Text>
        </TouchableOpacity>
      )}
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
    
    elevation: 5,
  },
  recenterText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});