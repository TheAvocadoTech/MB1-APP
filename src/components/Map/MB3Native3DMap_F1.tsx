import React, {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';

import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';

import {
  Canvas,
  useFrame,
} from '@react-three/fiber/native';

import {
  useGLTF,
  OrbitControls,
} from '@react-three/drei/native';

import {
  Vector3,
  CatmullRomCurve3,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  RingGeometry,
  CircleGeometry,
  SphereGeometry,
  BufferGeometry,
  LineSegments,
  Float32BufferAttribute,
  Box3,
  TOUCH,
} from 'three';
import type { GLTF } from 'three-stdlib';
import { Asset } from 'expo-asset';

import { getMapDetails, getWayfindingPath } from '../../services/ApiUtility';
import { FLOOR_MAP_IDS } from '../../constants/constants';

const MB3_F1 = require('../../assets/models/1st-floor.glb');

// Model calibration setup
const F1_CALIBRATION = {
  posX: -9.5,  
  posY: 0.0,   
  posZ: -38.0, // Base vertical alignment preserved
  scaleX: 1.0, 
  scaleY: 1.0, 
  scaleZ: 1.0,
};

// Independent offsets ONLY for nodes/paths
const NODE_OFFSET_X = 0.0;  // Horizontal shift (+ to move right, - to move left)
const NODE_OFFSET_Z = -5.0; // Forward/Backward shift (Make more negative to push FORWARD)

// Map dimension & pixel-per-meter defaults
const DEFAULT_MAP_META = {
  width_m: 127.81,
  height_m: 102.25,
  ppm: 50.07391564392213,
};

const MARKER_RING_GEO = new RingGeometry(0.8, 1.2, 32);
const MARKER_CIRCLE_GEO = new CircleGeometry(0.6, 32);
const NODE_SPHERE_GEO = new SphereGeometry(0.35, 12, 12);

const MapLoadingUI = () => (
  <View style={styles.loadingOverlay} pointerEvents="none">
    <ActivityIndicator size="large" color="#0ea5e9" />
    <Text style={styles.loadingText}>Loading 3D Map...</Text>
  </View>
);

/**
 * Maps 2D pixel space directly into 3D world space aligned with GLTF Model
 */
function mapTo3D(
  pixelX: number,
  pixelY: number,
  mapMeta: any,
  elevationY = 0.5
): [number, number, number] {
  const ppm = mapMeta?.ppm || DEFAULT_MAP_META.ppm;
  const widthMeters = mapMeta?.width_m || DEFAULT_MAP_META.width_m;
  const heightMeters = mapMeta?.height_m || DEFAULT_MAP_META.height_m;

  // 1. Convert pixel coordinates to meter space centered at origin (0,0)
  const rawX3D = (Number(pixelX) / ppm) - (widthMeters / 2);
  const rawZ3D = (Number(pixelY) / ppm) - (heightMeters / 2);

  // 2. Apply model base position AND independent node offsets
  const calibratedX = (rawX3D * F1_CALIBRATION.scaleX) + F1_CALIBRATION.posX + NODE_OFFSET_X;
  const calibratedZ = (rawZ3D * F1_CALIBRATION.scaleZ) + F1_CALIBRATION.posZ + NODE_OFFSET_Z;
  const calibratedY = elevationY * F1_CALIBRATION.scaleY;

  return [calibratedX, calibratedY, calibratedZ];
}

/**
 * Universal Node Lookup
 */
function findWayfindingNode(nodesList: any[], targetId: string | number) {
  if (!nodesList) return null;
  const list = Array.isArray(nodesList) ? nodesList : Object.values(nodesList);
  const targetStr = String(targetId).trim().toUpperCase();
  const numOnly = targetStr.replace(/[^0-9]/g, '');

  let found = list.find((n) => {
    if (!n) return false;
    const name = String(n.name || n.id || '').trim().toUpperCase();
    return (
      name === targetStr ||
      name === `N${numOnly}` ||
      name === numOnly ||
      name === `NODE ${numOnly}` ||
      name === `NODE_${numOnly}` ||
      name === `NODE${numOnly}`
    );
  });
  if (found) return found;

  if (numOnly) {
    const regex = new RegExp(`(^|[^0-9])0*${numOnly}([^0-9]|$)`, 'i');
    found = list.find((n) => {
      const name = String(n?.name || n?.id || '');
      return regex.test(name);
    });
    if (found) return found;

    const idx = parseInt(numOnly, 10) - 1;
    if (idx >= 0 && idx < list.length) {
      return list[idx];
    }
  }

  return null;
}

/**
 * Dijkstra Path Computation
 */
function calculateDijkstraPath(
  nodesList: any[],
  edgesMap: Record<string, any>,
  startPos: { x: number; y: number },
  endPos: { x: number; y: number }
): Array<{ x: number; y: number }> {
  if (!nodesList || nodesList.length === 0 || !startPos || !endPos) return [];
  const list = Array.isArray(nodesList) ? nodesList : Object.values(nodesList);

  let startNode: any = null;
  let minStartDist = Infinity;
  let endNode: any = null;
  let minEndDist = Infinity;

  list.forEach((n) => {
    const pos = n.position || n;
    if (pos && pos.x !== undefined && pos.y !== undefined) {
      const dStart = Math.hypot(pos.x - startPos.x, pos.y - startPos.y);
      if (dStart < minStartDist) {
        minStartDist = dStart;
        startNode = n;
      }
      const dEnd = Math.hypot(pos.x - endPos.x, pos.y - endPos.y);
      if (dEnd < minEndDist) {
        minEndDist = dEnd;
        endNode = n;
      }
    }
  });

  if (!startNode || !endNode) return [];

  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  list.forEach((n) => {
    const name = String(n.name || n.id);
    distances[name] = Infinity;
    unvisited.add(name);
  });

  const startName = String(startNode.name || startNode.id);
  const endName = String(endNode.name || endNode.id);
  distances[startName] = 0;

  while (unvisited.size > 0) {
    let current: string | null = null;
    let shortestDist = Infinity;
    unvisited.forEach((nodeName) => {
      if (distances[nodeName] < shortestDist) {
        shortestDist = distances[nodeName];
        current = nodeName;
      }
    });

    if (current === null || current === endName || shortestDist === Infinity) {
      break;
    }

    unvisited.delete(current);

    const neighbors = edgesMap[current] || {};
    const neighborKeys = Array.isArray(neighbors)
      ? neighbors
      : Object.keys(neighbors);

    neighborKeys.forEach((neighborKey: any) => {
      const neighborName =
        typeof neighborKey === 'string' ? neighborKey : neighborKey?.name;
      if (neighborName && unvisited.has(neighborName)) {
        const neighborNode = list.find((n) => String(n.name || n.id) === neighborName);
        const currentNode = list.find((n) => String(n.name || n.id) === current);
        let weight = 1;
        if (currentNode && neighborNode) {
          const p1 = currentNode.position || currentNode;
          const p2 = neighborNode.position || neighborNode;
          weight = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        }
        const alt = distances[current!] + weight;
        if (alt < distances[neighborName]) {
          distances[neighborName] = alt;
          previous[neighborName] = current;
        }
      }
    });
  }

  const pathNodes: Array<{ x: number; y: number; name?: string }> = [];
  let curr: string | null = endName;

  while (curr) {
    const nodeObj = list.find((n) => String(n.name || n.id) === curr);
    if (nodeObj) {
      const p = nodeObj.position || nodeObj;
      pathNodes.unshift({ x: Number(p.x), y: Number(p.y), name: curr });
    }
    curr = previous[curr] || null;
  }

  if (
    pathNodes.length === 0 ||
    (pathNodes[0].name !== startName && list.length > 1)
  ) {
    return [
      {
        x: startNode.position?.x || startNode.x,
        y: startNode.position?.y || startNode.y,
      },
      {
        x: endNode.position?.x || endNode.x,
        y: endNode.position?.y || endNode.y,
      },
      { x: endPos.x, y: endPos.y },
    ];
  }

  return [...pathNodes, { x: endPos.x, y: endPos.y }];
}

/**
 * Overlay component for graph nodes and connecting network edges
 */
const GraphDebugOverlay = React.memo(({
  graphNodes,
  graphEdges,
  mapMeta,
}: {
  graphNodes: any[];
  graphEdges: Record<string, any>;
  mapMeta: any;
}) => {
  const parsedNodes = useMemo(() => {
    return graphNodes.map((n) => {
      const p = n.position || n;
      const [wx, wy, wz] = mapTo3D(p.x, p.y, mapMeta, 0.5);
      return {
        id: String(n.name || n.id),
        position: [wx, wy, wz] as [number, number, number],
      };
    });
  }, [graphNodes, mapMeta]);

  const edgeLinesGeometry = useMemo(() => {
    if (!graphNodes.length || !graphEdges) return null;

    const nodePosMap = new Map<string, [number, number, number]>();
    parsedNodes.forEach((pn) => nodePosMap.set(pn.id, pn.position));

    const linePositions: number[] = [];
    const drawnPairs = new Set<string>();

    Object.entries(graphEdges).forEach(([sourceId, neighbors]) => {
      const p1 = nodePosMap.get(String(sourceId));
      if (!p1) return;

      const neighborList = Array.isArray(neighbors)
        ? neighbors
        : Object.keys(neighbors);

      neighborList.forEach((nKey: any) => {
        const targetId = String(typeof nKey === 'string' ? nKey : nKey?.name || nKey?.id);
        const p2 = nodePosMap.get(targetId);
        if (!p2) return;

        const pairKey = [sourceId, targetId].sort().join('--');
        if (drawnPairs.has(pairKey)) return;
        drawnPairs.add(pairKey);

        linePositions.push(p1[0], p1[1], p1[2]);
        linePositions.push(p2[0], p2[1], p2[2]);
      });
    });

    if (linePositions.length === 0) return null;

    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(linePositions, 3));
    return geo;
  }, [parsedNodes, graphEdges, graphNodes]);

  return (
    <group key="graph-debug-overlay">
      {/* Node Spheres */}
      {parsedNodes.map((node) => (
        <mesh
          key={`node-${node.id}`}
          position={node.position}
          geometry={NODE_SPHERE_GEO}
          frustumCulled={false}
        >
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
        </mesh>
      ))}

      {/* Connected Line Edges */}
      {edgeLinesGeometry && (
        <lineSegments geometry={edgeLinesGeometry} frustumCulled={false}>
          <lineBasicMaterial color="#0284c7" transparent opacity={0.4} linewidth={1} />
        </lineSegments>
      )}
    </group>
  );
});

export const Native3DPathLayer = React.memo(({
  visitorPos,
  targetPos,
  mapMeta,
  wayfindingData,
  onPositionsComputed,
}: {
  visitorPos?: { x: number; y: number };
  targetPos?: { x: number; y: number };
  mapMeta?: any;
  wayfindingData?: any;
  onPositionsComputed?: (visitor: [number, number, number] | null, target: [number, number, number] | null) => void;
}) => {
  const pulseMeshRef = useRef<Mesh>(null);
  const pulseMatRef = useRef<MeshBasicMaterial>(null);

  const rawVisitor2D = useMemo(() => {
    if (visitorPos && typeof visitorPos.x === 'number' && typeof visitorPos.y === 'number') {
      return { x: visitorPos.x, y: visitorPos.y };
    }
    return { x: 0, y: 0 };
  }, [visitorPos]);

  const rawTarget2D = useMemo(() => {
    if (targetPos && typeof targetPos.x === 'number' && typeof targetPos.y === 'number') {
      return { x: targetPos.x, y: targetPos.y };
    }
    return { x: 5525.298, y: 2491.837 };
  }, [targetPos]);

  const { graphNodes, graphEdges } = useMemo(() => {
    const nodes = wayfindingData?.nodes || wayfindingData?.wayfinding_path?.nodes || [];
    let edges = wayfindingData?.edges || wayfindingData?.wayfinding_path?.edges || {};

    if (Object.keys(edges).length === 0 && nodes.length > 0) {
      const extracted: Record<string, any> = {};
      nodes.forEach((n: any) => {
        if (n.edges) extracted[String(n.name || n.id)] = n.edges;
      });
      edges = extracted;
    }

    return { graphNodes: nodes, graphEdges: edges };
  }, [wayfindingData]);

  const rawPath2D = useMemo(() => {
    if (rawVisitor2D.x > 0 && rawTarget2D.x > 0 && graphNodes.length > 0) {
      return calculateDijkstraPath(graphNodes, graphEdges, rawVisitor2D, rawTarget2D);
    }
    return [];
  }, [graphNodes, graphEdges, rawVisitor2D, rawTarget2D]);

  const liveVisitorPos = useMemo<[number, number, number] | null>(() => {
    if (!rawVisitor2D.x && !rawVisitor2D.y) return null;
    return mapTo3D(rawVisitor2D.x, rawVisitor2D.y, mapMeta, 0.6);
  }, [rawVisitor2D, mapMeta]);

  const targetPosTuple = useMemo<[number, number, number] | null>(() => {
    if (!rawTarget2D.x && !rawTarget2D.y) return null;
    return mapTo3D(rawTarget2D.x, rawTarget2D.y, mapMeta, 0.6);
  }, [rawTarget2D, mapMeta]);

  useEffect(() => {
    if (onPositionsComputed && liveVisitorPos && targetPosTuple) {
      onPositionsComputed(liveVisitorPos, targetPosTuple);
    }
  }, [liveVisitorPos, targetPosTuple, onPositionsComputed]);

  const pathCurve = useMemo(() => {
    if (!liveVisitorPos || !targetPosTuple) return null;

    const routePoints: Vector3[] = [new Vector3(...liveVisitorPos)];

    if (rawPath2D.length > 0) {
      rawPath2D.forEach((pt) => {
        const [wx, wy, wz] = mapTo3D(pt.x, pt.y, mapMeta, 0.6);
        routePoints.push(new Vector3(wx, wy, wz));
      });
    }

    routePoints.push(new Vector3(...targetPosTuple));

    const uniquePoints = routePoints.filter((point, index) => {
      if (index === 0) return true;
      return point.distanceTo(routePoints[index - 1]) > 0.05;
    });

    if (uniquePoints.length < 2) return null;

    return new CatmullRomCurve3(uniquePoints, false, 'catmullrom', 0.1);
  }, [liveVisitorPos, targetPosTuple, rawPath2D, mapMeta]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const cycle = (time * 2) % 1;

    if (pulseMeshRef.current) {
      const scale = 0.8 + cycle * 1.5;
      pulseMeshRef.current.scale.set(scale, scale, 1);
    }
    if (pulseMatRef.current) {
      pulseMatRef.current.opacity = Math.pow(1 - cycle, 1.2);
    }
  });

  return (
    <group key={`path-layer-f1`}>
      {/* Node Graph Overlay & Connections */}
      <GraphDebugOverlay
        graphNodes={graphNodes}
        graphEdges={graphEdges}
        mapMeta={mapMeta}
      />

      {/* Calculated Wayfinding Tube Path */}
      {pathCurve && (
        <>
          <mesh frustumCulled={false}>
            <tubeGeometry args={[pathCurve, 128, 0.2, 8, false]} />
            <meshBasicMaterial color="#0046be" transparent={false} opacity={1.0} side={DoubleSide} />
          </mesh>
          <mesh frustumCulled={false}>
            <tubeGeometry args={[pathCurve, 128, 0.4, 8, false]} />
            <meshBasicMaterial color="#0284c7" transparent opacity={0.4} side={DoubleSide} />
          </mesh>
        </>
      )}

      {/* Visitor Origin Marker */}
      {liveVisitorPos && (
        <group position={liveVisitorPos} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh ref={pulseMeshRef} frustumCulled={false} geometry={MARKER_RING_GEO}>
            <meshBasicMaterial ref={pulseMatRef} color="#0085ff" transparent side={DoubleSide} depthTest={false} />
          </mesh>
          <mesh frustumCulled={false} position={[0, 0, 0.02]} geometry={MARKER_CIRCLE_GEO}>
            <meshBasicMaterial color="#0085ff" side={DoubleSide} depthTest={false} />
          </mesh>
        </group>
      )}

      {/* Target Destination Marker */}
      {targetPosTuple && (
        <group position={targetPosTuple} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh frustumCulled={false} geometry={MARKER_RING_GEO}>
            <meshBasicMaterial color="#ef4444" transparent opacity={0.8} side={DoubleSide} depthTest={false} />
          </mesh>
          <mesh frustumCulled={false} position={[0, 0, 0.02]} geometry={MARKER_CIRCLE_GEO}>
            <meshBasicMaterial color="#ef4444" side={DoubleSide} depthTest={false} />
          </mesh>
        </group>
      )}
    </group>
  );
});

export const FacilityModel = ({
  modelUri,
}: {
  modelUri: string;
}) => {
  const gltf = useGLTF(modelUri) as GLTF;
  const { scene } = gltf;

  useLayoutEffect(() => {
    if (scene) {
      const box = new Box3().setFromObject(scene);
      const center = box.getCenter(new Vector3());
      scene.position.x = -center.x;
      scene.position.y = -box.min.y;
      scene.position.z = -center.z;
    }
  }, [scene]);

  return (
    <group
      position={[F1_CALIBRATION.posX, F1_CALIBRATION.posY, F1_CALIBRATION.posZ]}
      scale={[F1_CALIBRATION.scaleX, F1_CALIBRATION.scaleY, F1_CALIBRATION.scaleZ]}
    >
      <primitive object={scene} />
    </group>
  );
};

const MapScene = ({
  modelUri,
  visitorPos,
  targetPos,
  mapMeta,
  wayfindingData,
}: {
  modelUri: string;
  visitorPos: any;
  targetPos: any;
  mapMeta: any;
  wayfindingData: any;
}) => {
  const [focusTarget, setFocusTarget] = useState<[number, number, number]>([0, 0, 0]);
  const controlsRef = useRef<any>(null);

  const handlePositionsComputed = useCallback(
    (visitor: [number, number, number] | null, target: [number, number, number] | null) => {
      if (!visitor || !target) return;

      const midX = (visitor[0] + target[0]) / 2;
      const midY = (visitor[1] + target[1]) / 2;
      const midZ = (visitor[2] + target[2]) / 2;

      setFocusTarget((prev) => {
        if (Math.abs(prev[0] - midX) < 0.1 && Math.abs(prev[2] - midZ) < 0.1) {
          return prev;
        }
        return [midX, midY, midZ];
      });
    },
    []
  );

  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[50, 100, 50]} intensity={1.6} />

      <Suspense fallback={null}>
        <FacilityModel modelUri={modelUri} />

        <Native3DPathLayer
          visitorPos={visitorPos}
          targetPos={targetPos}
          mapMeta={mapMeta}
          wayfindingData={wayfindingData}
          onPositionsComputed={handlePositionsComputed}
        />
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping={true}
        dampingFactor={0.05}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={20}
        maxDistance={600}
        target={focusTarget}
        touches={{
          ONE: TOUCH.ROTATE,
          TWO: TOUCH.DOLLY_PAN,
        }}
      />
    </>
  );
};

export const MB3Native3DMap_F1 = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [localUri, setLocalUri] = useState<string | null>(null);

  const [wayfindingData, setWayfindingData] = useState<any>(null);
  const [mapMeta, setMapMeta] = useState<any>(DEFAULT_MAP_META);
  const [visitorPos, setVisitorPos] = useState<{ x: number; y: number } | null>(null);
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function prepareAsset() {
      try {
        const asset = Asset.fromModule(MB3_F1);
        await asset.downloadAsync();
        if (isMounted) {
          setLocalUri(asset.localUri || asset.uri);
        }
      } catch (err) {
        console.error('Failed to unpack F1 3D asset:', err);
      }
    }
    prepareAsset();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchFloorMaps = async () => {
      setIsLoading(true);

      try {
        const [mapRes, wfRes] = await Promise.allSettled([
          getMapDetails(FLOOR_MAP_IDS.F1),
          getWayfindingPath(FLOOR_MAP_IDS.F1),
        ]);

        if (!isMounted) return;

        const mapData =
          mapRes.status === 'fulfilled' && mapRes.value
            ? mapRes.value.data || mapRes.value
            : null;

        const wfData =
          wfRes.status === 'fulfilled' && wfRes.value
            ? wfRes.value.data || wfRes.value
            : null;

        const computedMapMeta = {
          width_m: mapData?.width_m || DEFAULT_MAP_META.width_m,
          height_m: mapData?.height_m || DEFAULT_MAP_META.height_m,
          ppm: mapData?.ppm || DEFAULT_MAP_META.ppm,
        };

        const nodes = wfData?.nodes || wfData?.wayfinding_path?.nodes || [];

        const n48 = findWayfindingNode(nodes, '48');
        const n45 = findWayfindingNode(nodes, '45');
        let f1LiftPos = { x: 5004.59, y: 2313.4 };

        if (n48 && n45) {
          const p1 = n48.position || n48;
          const p2 = n45.position || n45;
          if (p1?.x !== undefined && p2?.x !== undefined) {
            f1LiftPos = {
              x: (Number(p1.x) + Number(p2.x)) / 2,
              y: (Number(p1.y) + Number(p2.y)) / 2,
            };
          }
        }

        setMapMeta(computedMapMeta);
        setWayfindingData(wfData);
        setVisitorPos(f1LiftPos);
        setTargetPos({ x: 5525.298, y: 2491.837 });
      } catch (err: any) {
        console.warn('Map fetch error:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchFloorMaps();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      {isLoading && <MapLoadingUI />}

      {localUri && (
        <Canvas
          camera={{
            position: [0, 150, 50],
            fov: 45,
            near: 0.1,
            far: 100000,
          }}>
          <MapScene
            modelUri={localUri}
            visitorPos={visitorPos || { x: 5004.59, y: 2313.4 }}
            targetPos={targetPos || { x: 5525.298, y: 2491.837 }}
            mapMeta={mapMeta}
            wayfindingData={wayfindingData}
          />
        </Canvas>
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
    position: 'relative',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
});