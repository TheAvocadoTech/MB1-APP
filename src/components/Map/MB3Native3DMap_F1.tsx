import React, {
  Suspense,
  useEffect,
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
  useThree,
} from '@react-three/fiber/native';

import {
  useGLTF,
  OrbitControls,
  Line,
} from '@react-three/drei/native';

import {
  Box3,
  Vector3,
  CatmullRomCurve3,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  RingGeometry,
  CircleGeometry,
  TOUCH,
} from 'three';
import type { GLTF } from 'three-stdlib';
import { Asset } from 'expo-asset';

import { getMapDetails, getWayfindingPath } from '../../services/ApiUtility';
import { FLOOR_MAP_IDS } from '../../constants/constants';

const MB3_F1 = require('../../assets/models/1st-floor.glb');

// Pre-instantiated geometries matching optimization patterns
const NODE_RING_GEO = new RingGeometry(0.3, 0.45, 16);
const NODE_CIRCLE_GEO = new CircleGeometry(0.25, 16);
const MARKER_RING_GEO = new RingGeometry(0.8, 1.2, 32);
const MARKER_CIRCLE_GEO = new CircleGeometry(0.6, 32);

const NODE_OUTER_MAT = new MeshBasicMaterial({ color: '#0ea5e9', transparent: true, opacity: 0.8, side: DoubleSide });
const NODE_INNER_MAT = new MeshBasicMaterial({ color: '#0ea5e9', side: DoubleSide });

const MapLoadingUI = () => (
  <View style={styles.loadingOverlay} pointerEvents="none">
    <ActivityIndicator size="large" color="#0ea5e9" />
    <Text style={styles.loadingText}>Loading 3D Map...</Text>
  </View>
);

export interface ModelMapTransform {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  width: number;
  depth: number;
  floorY: number;
  offsetX?: number;
  offsetZ?: number;
}

function project2Dto3DTuple(
  x: number,
  y: number,
  mapWidth: number,
  mapHeight: number,
  transform?: ModelMapTransform | null,
  elevationOffset = 0.3
): [number, number, number] {
  if (!transform || !mapWidth || !mapHeight) return [0, elevationOffset, 0];

  const normX = x / mapWidth;
  const normY = y / mapHeight;

  const shiftRight = transform.offsetX ?? 2.5;
  const shiftForward = transform.offsetZ ?? -8.5;

  const worldX = transform.minX + normX * transform.width + shiftRight;
  const worldZ = transform.minZ + normY * transform.depth + shiftForward;
  const worldY = transform.floorY + elevationOffset;

  return [worldX, worldY, worldZ];
}

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
    previous[name] = null;
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
        const neighborNode = list.find(
          (n) => String(n.name || n.id) === neighborName
        );
        const currentNode = list.find(
          (n) => String(n.name || n.id) === current
        );
        let weight = 1;
        if (currentNode && neighborNode) {
          const p1 = currentNode.position || currentNode;
          const p2 = neighborNode.position || neighborNode;
          weight = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        }
        if (current) {
          const alt = distances[current] + weight;
          if (alt < distances[neighborName]) {
            distances[neighborName] = alt;
            previous[neighborName] = current;
          }
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

// GraphNodesLayer renders node rings and blue dotted edges between graph connections
export const GraphNodesLayer = React.memo(({
  wayfindingData,
  transform,
  mapMeta,
}: {
  wayfindingData?: any;
  transform?: ModelMapTransform | null;
  mapMeta?: any;
}) => {
  const mapWidth = mapMeta?.width || wayfindingData?.map?.width || 6400;
  const mapHeight = mapMeta?.height || wayfindingData?.map?.height || 5120;

  const { nodes, edges } = useMemo(() => {
    const rawNodes = wayfindingData?.nodes || wayfindingData?.wayfinding_path?.nodes || [];
    let rawEdges = wayfindingData?.edges || wayfindingData?.wayfinding_path?.edges || {};

    if (Object.keys(rawEdges).length === 0 && rawNodes.length > 0) {
      const extracted: Record<string, any> = {};
      rawNodes.forEach((n: any) => {
        if (n.edges) extracted[n.name || n.id] = n.edges;
      });
      rawEdges = extracted;
    }

    return { nodes: rawNodes, edges: rawEdges };
  }, [wayfindingData]);

  const { nodePositionsMap, nodePositionsList } = useMemo(() => {
    if (!transform) return { nodePositionsMap: new Map<string, [number, number, number]>(), nodePositionsList: [] };

    const map = new Map<string, [number, number, number]>();
    const list: Array<{ id: string; pos: [number, number, number] }> = [];

    nodes.forEach((node: any) => {
      const pos = node.position || node;
      if (pos && pos.x !== undefined && pos.y !== undefined) {
        const id = String(node.name || node.id);
        const coords = project2Dto3DTuple(
          pos.x,
          pos.y,
          mapWidth,
          mapHeight,
          transform,
          0.2
        );
        map.set(id, coords);
        list.push({ id, pos: coords });
      }
    });

    return { nodePositionsMap: map, nodePositionsList: list };
  }, [nodes, mapWidth, mapHeight, transform]);

  const edgeSegments = useMemo(() => {
    if (!transform || nodePositionsMap.size === 0) return [];

    const segments: Array<{ key: string; start: [number, number, number]; end: [number, number, number] }> = [];
    const drawnEdgePairs = new Set<string>();

    Object.entries(edges).forEach(([sourceName, targets]: [string, any]) => {
      const p1 = nodePositionsMap.get(sourceName);
      if (!p1) return;

      const targetList = Array.isArray(targets)
        ? targets
        : Object.keys(targets || {});

      targetList.forEach((targetKey: any) => {
        const targetName = String(typeof targetKey === 'string' ? targetKey : targetKey?.name);
        const edgeKey = [sourceName, targetName].sort().join('<->');
        if (drawnEdgePairs.has(edgeKey)) return;
        drawnEdgePairs.add(edgeKey);

        const p2 = nodePositionsMap.get(targetName);
        if (!p2) return;

        segments.push({ key: edgeKey, start: p1, end: p2 });
      });
    });

    return segments;
  }, [edges, nodePositionsMap, transform]);

  if (!transform || nodePositionsList.length === 0) return null;

  return (
    <group>
      {/* Blue Dotted Connections */}
      {edgeSegments.map((edge) => (
        <Line
          key={`edge-${edge.key}`}
          points={[edge.start, edge.end]}
          color="#38bdf8"
          lineWidth={2}
          dashed={true}
          dashSize={0.8}
          gapSize={0.4}
        />
      ))}

      {/* Wayfinding Graph Nodes */}
      {nodePositionsList.map((nodeItem) => (
        <group
          key={`node-marker-${nodeItem.id}`}
          position={nodeItem.pos}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <mesh frustumCulled={false} geometry={NODE_RING_GEO} material={NODE_OUTER_MAT} />
          <mesh frustumCulled={false} position={[0, 0, 0.01]} geometry={NODE_CIRCLE_GEO} material={NODE_INNER_MAT} />
        </group>
      ))}
    </group>
  );
});

function NavigationCameraController({
  focusTarget,
  controlsRef,
}: {
  focusTarget: [number, number, number];
  controlsRef: any;
}) {
  const { camera } = useThree();

  useEffect(() => {
    camera.up.set(0, 0, -1);
    camera.updateProjectionMatrix();
  }, [camera]);

  useEffect(() => {
    if (controlsRef.current && (focusTarget[0] !== 0 || focusTarget[2] !== 0)) {
      controlsRef.current.target.set(...focusTarget);
      camera.position.set(focusTarget[0], focusTarget[1] + 120, focusTarget[2] - 140);
      camera.lookAt(...focusTarget);
      controlsRef.current.update();
    }
  }, [focusTarget, camera, controlsRef]);

  return null;
}

export const Native3DPathLayer = React.memo(({
  visitorPos,
  targetPos,
  transform,
  mapMeta,
  wayfindingData,
  onPositionsComputed,
  onTurnInstructionCalculated,
}: {
  visitorPos?: { x: number; y: number };
  targetPos?: { x: number; y: number };
  transform?: ModelMapTransform | null;
  mapMeta?: any;
  wayfindingData?: any;
  onPositionsComputed?: (visitor: [number, number, number] | null, target: [number, number, number] | null) => void;
  onTurnInstructionCalculated?: (instruction: any) => void;
}) => {
  const pulseMeshRef = useRef<Mesh>(null);
  const pulseMatRef = useRef<MeshBasicMaterial>(null);

  const mapWidth = mapMeta?.width || wayfindingData?.map?.width || 6400;
  const mapHeight = mapMeta?.height || wayfindingData?.map?.height || 5120;

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
    return { x: 0, y: 0 };
  }, [targetPos]);

  const { graphNodes, graphEdges } = useMemo(() => {
    const nodes = wayfindingData?.nodes || wayfindingData?.wayfinding_path?.nodes || [];
    let edges = wayfindingData?.edges || wayfindingData?.wayfinding_path?.edges || {};

    if (Object.keys(edges).length === 0 && nodes.length > 0) {
      const extracted: Record<string, any> = {};
      nodes.forEach((n: any) => {
        if (n.edges) extracted[n.name || n.id] = n.edges;
      });
      edges = extracted;
    }

    return { graphNodes: nodes, graphEdges: edges };
  }, [wayfindingData]);

  // Dijkstra path between 2D visitor and target positions
  const rawPath2D = useMemo(() => {
    if (
      rawVisitor2D.x > 0 &&
      rawTarget2D.x > 0 &&
      graphNodes.length > 0
    ) {
      return calculateDijkstraPath(graphNodes, graphEdges, rawVisitor2D, rawTarget2D);
    }
    return [];
  }, [graphNodes, graphEdges, rawVisitor2D, rawTarget2D]);

  const liveVisitorPos = useMemo<[number, number, number] | null>(() => {
    if (!rawVisitor2D.x && !rawVisitor2D.y) return null;
    return project2Dto3DTuple(rawVisitor2D.x, rawVisitor2D.y, mapWidth, mapHeight, transform, 0.4);
  }, [rawVisitor2D, mapWidth, mapHeight, transform]);

  const targetPosTuple = useMemo<[number, number, number] | null>(() => {
    if (!rawTarget2D.x && !rawTarget2D.y) return null;
    return project2Dto3DTuple(rawTarget2D.x, rawTarget2D.y, mapWidth, mapHeight, transform, 0.4);
  }, [rawTarget2D, mapWidth, mapHeight, transform]);

  useEffect(() => {
    if (onPositionsComputed && liveVisitorPos && targetPosTuple) {
      onPositionsComputed(liveVisitorPos, targetPosTuple);
    }
  }, [liveVisitorPos, targetPosTuple, onPositionsComputed]);

  // Exact Core Logic from Reference Code
  const pathCurve = useMemo(() => {
    if (!liveVisitorPos || !targetPosTuple || !transform) return null;

    const routePoints: Vector3[] = [];

    // 1. Add current Live Visitor Position as the start point
    routePoints.push(new Vector3(...liveVisitorPos));

    // 2. Add intermediate Dijkstra waypoints projected to 3D space
    if (rawPath2D.length > 0) {
      rawPath2D.forEach((pt) => {
        const [wx, wy, wz] = project2Dto3DTuple(pt.x, pt.y, mapWidth, mapHeight, transform, 0.4);
        routePoints.push(new Vector3(wx, wy, wz));
      });
    }

    // 3. Add Destination Target Position as the final point
    routePoints.push(new Vector3(...targetPosTuple));

    // Remove overlapping/duplicate consecutive waypoints to avoid CatmullRom rendering artifacts
    const uniquePoints = routePoints.filter((point, index) => {
      if (index === 0) return true;
      return point.distanceTo(routePoints[index - 1]) > 0.0001;
    });

    if (uniquePoints.length < 2) return null;

    return new CatmullRomCurve3(uniquePoints);
  }, [liveVisitorPos, targetPosTuple, rawPath2D, transform, mapWidth, mapHeight]);

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
    <group key={`path-layer-${mapWidth}-${mapHeight}`}>
      {pathCurve && (
        <>
          <mesh frustumCulled={false}>
            <tubeGeometry args={[pathCurve, 64, 0.1, 8, false]} />
            <meshBasicMaterial color="#0046be" transparent={false} opacity={1.0} side={DoubleSide} />
          </mesh>
          <mesh frustumCulled={false}>
            <tubeGeometry args={[pathCurve, 64, 0.2, 8, false]} />
            <meshBasicMaterial color="#0284c7" transparent opacity={0.4} side={DoubleSide} />
          </mesh>
        </>
      )}

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
  onTransformReady,
}: {
  modelUri: string;
  onTransformReady: (transform: ModelMapTransform) => void;
}) => {
  const gltf = useGLTF(modelUri) as GLTF;
  const { scene } = gltf;

  const transform = useMemo(() => {
    if (!scene) return null;

    scene.updateMatrixWorld(true);
    const boundingBox = new Box3().setFromObject(scene);
    const center = new Vector3();
    boundingBox.getCenter(center);

    return {
      minX: boundingBox.min.x - center.x,
      maxX: boundingBox.max.x - center.x,
      minZ: boundingBox.min.z - center.z,
      maxZ: boundingBox.max.z - center.z,
      width: boundingBox.max.x - boundingBox.min.x,
      depth: boundingBox.max.z - boundingBox.min.z,
      floorY: boundingBox.min.y - center.y,
    };
  }, [scene]);

  useEffect(() => {
    if (transform) {
      onTransformReady(transform);
    }
  }, [transform, onTransformReady]);

  const clonedScene = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.updateMatrixWorld(true);

    const boundingBox = new Box3().setFromObject(cloned);
    const center = new Vector3();
    boundingBox.getCenter(center);

    cloned.position.set(-center.x, -center.y, -center.z);
    cloned.updateMatrixWorld(true);

    return cloned;
  }, [scene]);

  return <primitive object={clonedScene} scale={1} />;
};

const MapScene = ({
  modelUri,
  visitorPos,
  targetPos,
  mapMeta,
  wayfindingData,
  onLoaded,
  onInstructionUpdated,
}: {
  modelUri: string;
  visitorPos: any;
  targetPos: any;
  mapMeta: any;
  wayfindingData: any;
  onLoaded: () => void;
  onInstructionUpdated: (instruction: any) => void;
}) => {
  const [modelTransform, setModelTransform] = useState<ModelMapTransform | null>(null);
  const [focusTarget, setFocusTarget] = useState<[number, number, number]>([0, 0, 0]);
  const controlsRef = useRef<any>(null);

  const handleTransformReady = useCallback(
    (transform: ModelMapTransform) => {
      setModelTransform(transform);
      onLoaded();
    },
    [onLoaded]
  );

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
      <ambientLight intensity={0.9} />
      <directionalLight position={[0, 100, 0]} intensity={1.3} />

      <Suspense fallback={null}>
        <FacilityModel
          key={`facility-${modelUri}`}
          modelUri={modelUri}
          onTransformReady={handleTransformReady}
        />

        {modelTransform && (
          <>
            <GraphNodesLayer
              wayfindingData={wayfindingData}
              transform={modelTransform}
              mapMeta={mapMeta}
            />

            <Native3DPathLayer
              visitorPos={visitorPos}
              targetPos={targetPos}
              transform={modelTransform}
              mapMeta={mapMeta}
              wayfindingData={wayfindingData}
              onPositionsComputed={handlePositionsComputed}
              onTurnInstructionCalculated={onInstructionUpdated}
            />
          </>
        )}
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

      <NavigationCameraController focusTarget={focusTarget} controlsRef={controlsRef} />
    </>
  );
};

export const MB3Native3DMap_F1 = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [turnInstruction, setTurnInstruction] = useState<any>(null);
  const [localUri, setLocalUri] = useState<string | null>(null);

  const [wayfindingData, setWayfindingData] = useState<any>(null);
  const [mapMeta, setMapMeta] = useState<any>(null);
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
          width: mapData?.width || mapData?.image_width || wfData?.map?.width || 6400,
          height: mapData?.height || mapData?.image_height || wfData?.map?.height || 5120,
        };

        const nodes = wfData?.nodes || wfData?.wayfinding_path?.nodes || [];
        let calculatedVisitorPos = null;
        let calculatedTargetPos = null;

        if (Array.isArray(nodes) && nodes.length >= 2) {
          const startNodePos = nodes[0].position || nodes[0];
          const endNodePos = nodes[nodes.length - 1].position || nodes[nodes.length - 1];

          if (startNodePos?.x !== undefined && startNodePos?.y !== undefined) {
            calculatedVisitorPos = { x: Number(startNodePos.x), y: Number(startNodePos.y) };
          }
          if (endNodePos?.x !== undefined && endNodePos?.y !== undefined) {
            calculatedTargetPos = { x: Number(endNodePos.x), y: Number(endNodePos.y) };
          }
        }

        setMapMeta(computedMapMeta);
        setWayfindingData(wfData);
        setVisitorPos(calculatedVisitorPos);
        setTargetPos(calculatedTargetPos);
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

  const handleLoaded = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <View style={styles.container}>
      {isLoading && <MapLoadingUI />}

      {turnInstruction && (
        <View style={styles.hudCard} pointerEvents="none">
          <Text style={styles.hudTitle}>{turnInstruction.text}</Text>
          <Text style={styles.hudSubtext}>{turnInstruction.subtext}</Text>
        </View>
      )}

      {localUri && (
        <Canvas
          camera={{
            position: [0, 150, 0],
            fov: 45,
            near: 0.1,
            far: 100000,
          }}>
          <MapScene
            modelUri={localUri}
            visitorPos={visitorPos}
            targetPos={targetPos}
            mapMeta={mapMeta}
            wayfindingData={wayfindingData}
            onLoaded={handleLoaded}
            onInstructionUpdated={setTurnInstruction}
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
  hudCard: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    zIndex: 30,
  },
  hudTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  hudSubtext: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
});