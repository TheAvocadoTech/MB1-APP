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
import { useSelector, useDispatch } from 'react-redux';
import { Asset } from 'expo-asset';

import { RootState, AppDispatch } from '../../store/store';
import { setFloorMapDetails } from '../../store/slices/floorSlice';
import { getMapDetails, getWayfindingPath } from '../../services/ApiUtility';
import { FLOOR_MAP_IDS } from '../../constants/constants';

const MB3_GR = require('../../assets/models/gr-floor.glb');

// Shared visual primitives
const NODE_RING_GEO = new RingGeometry(0.3, 0.45, 16);
const NODE_CIRCLE_GEO = new CircleGeometry(0.25, 16);
const MARKER_RING_GEO = new RingGeometry(0.8, 1.2, 32);
const MARKER_CIRCLE_GEO = new CircleGeometry(0.6, 32);

const NODE_OUTER_MAT = new MeshBasicMaterial({ color: '#0ea5e9', transparent: true, opacity: 0.8, side: DoubleSide });
const NODE_INNER_MAT = new MeshBasicMaterial({ color: '#0ea5e9', side: DoubleSide });
const PATH_GLOW_MAT = new MeshBasicMaterial({ color: '#0085ff', transparent: true, opacity: 0.3, side: DoubleSide });
const PATH_CORE_MAT = new MeshBasicMaterial({ color: '#0085ff', transparent: true, opacity: 0.95, side: DoubleSide });
const TARGET_RING_MAT = new MeshBasicMaterial({ color: '#ef4444', transparent: true, opacity: 0.8, side: DoubleSide, depthTest: false });
const TARGET_CIRCLE_MAT = new MeshBasicMaterial({ color: '#ef4444', side: DoubleSide, depthTest: false });

const MapLoadingUI = React.memo(() => (
  <View style={styles.loadingOverlay} pointerEvents="none">
    <ActivityIndicator size="large" color="#0ea5e9" />
    <Text style={styles.loadingText}>Loading 3D Map...</Text>
  </View>
));

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

function findWayfindingNode(nodesList: any[], targetId: string) {
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

function calculateDijkstraPath(
  nodesList: any[],
  edgesMap: Record<string, any>,
  startPos: { x: number; y: number },
  endPos: { x: number; y: number }
): Array<{ x: number; y: number }> {
  if (!nodesList?.length || !startPos || !endPos) return [];
  const list = Array.isArray(nodesList) ? nodesList : Object.values(nodesList);

  let startNode: any = null;
  let minStartDist = Infinity;
  let endNode: any = null;
  let minEndDist = Infinity;

  for (let i = 0; i < list.length; i++) {
    const n = list[i];
    const pos = n.position || n;
    if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
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
  }

  if (!startNode || !endNode) return [];

  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  for (let i = 0; i < list.length; i++) {
    const name = String(list[i].name || list[i].id);
    distances[name] = Infinity;
    previous[name] = null;
    unvisited.add(name);
  }

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
    const neighborKeys = Array.isArray(neighbors) ? neighbors : Object.keys(neighbors);

    for (let i = 0; i < neighborKeys.length; i++) {
      const neighborKey = neighborKeys[i];
      const neighborName = typeof neighborKey === 'string' ? neighborKey : neighborKey?.name;
      if (neighborName && unvisited.has(neighborName)) {
        const neighborNode = list.find((n) => String(n.name || n.id) === neighborName);
        const currentNode = list.find((n) => String(n.name || n.id) === current);
        let weight = 1;

        if (currentNode && neighborNode) {
          const p1 = currentNode.position || currentNode;
          const p2 = neighborNode.position || neighborNode;
          weight = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        }

        const alt = distances[current] + weight;
        if (alt < distances[neighborName]) {
          distances[neighborName] = alt;
          previous[neighborName] = current;
        }
      }
    }
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

  if (pathNodes.length === 0 || (pathNodes[0].name !== startName && list.length > 1)) {
    return [
      { x: startNode.position?.x || startNode.x, y: startNode.position?.y || startNode.y },
      { x: endNode.position?.x || endNode.x, y: endNode.position?.y || endNode.y },
      { x: endPos.x, y: endPos.y },
    ];
  }

  return [...pathNodes, { x: endPos.x, y: endPos.y }];
}

export const GraphNodesLayer = React.memo(({
  wayfindingData,
  transform,
  mapMeta,
}: {
  wayfindingData?: any;
  transform?: ModelMapTransform | null;
  mapMeta?: any;
}) => {
  const nodes = useMemo(() => {
    return wayfindingData?.nodes || wayfindingData?.wayfinding_path?.nodes || [];
  }, [wayfindingData]);

  const mapWidth = mapMeta?.width || wayfindingData?.map?.width || 6400;
  const mapHeight = mapMeta?.height || wayfindingData?.map?.height || 5120;

  const nodePositions = useMemo(() => {
    if (!transform) return [];

    return nodes.map((node: any) => {
      const pos = node.position || node;
      if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
        const coords = project2Dto3DTuple(pos.x, pos.y, mapWidth, mapHeight, transform, 0.2);
        return { id: node.name || node.id, pos: coords };
      }
      return null;
    }).filter(Boolean);
  }, [nodes, mapWidth, mapHeight, transform]);

  if (nodePositions.length === 0) return null;

  return (
    <group>
      {nodePositions.map((nodeItem: any) => (
        <group key={`node-marker-${nodeItem.id}`} position={nodeItem.pos} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh frustumCulled={false} geometry={NODE_RING_GEO} material={NODE_OUTER_MAT} />
          <mesh frustumCulled={false} position={[0, 0, 0.01]} geometry={NODE_CIRCLE_GEO} material={NODE_INNER_MAT} />
        </group>
      ))}
    </group>
  );
});

export const AllNodesDottedPath = React.memo(({
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

  const lineSegments = useMemo(() => {
    if (!transform) return [];

    const nodes = wayfindingData?.nodes || wayfindingData?.wayfinding_path?.nodes || [];
    let edges = wayfindingData?.edges || wayfindingData?.wayfinding_path?.edges || {};

    if (Object.keys(edges).length === 0 && nodes.length > 0) {
      const extracted: Record<string, any> = {};
      nodes.forEach((n: any) => {
        if (n.edges) extracted[n.name || n.id] = n.edges;
      });
      edges = extracted;
    }

    if (!Array.isArray(nodes) || nodes.length === 0) return [];

    const nodePosMap = new Map<string, [number, number, number]>();
    nodes.forEach((node: any) => {
      const pos = node.position || node;
      if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
        const tuple = project2Dto3DTuple(pos.x, pos.y, mapWidth, mapHeight, transform, 0.25);
        if (!isNaN(tuple[0])) nodePosMap.set(String(node.name || node.id), tuple);
      }
    });

    const segments: Array<[[number, number, number], [number, number, number]]> = [];
    const drawnPairs = new Set<string>();

    Object.entries(edges).forEach(([sourceName, targets]) => {
      const p1 = nodePosMap.get(sourceName);
      if (!p1) return;

      const targetList = Array.isArray(targets) ? targets : Object.keys(targets || {});
      targetList.forEach((targetItem: any) => {
        const targetName = typeof targetItem === 'string' ? targetItem : targetItem?.name;
        if (!targetName) return;

        const edgeKey = [sourceName, targetName].sort().join('<->');
        if (drawnPairs.has(edgeKey)) return;
        drawnPairs.add(edgeKey);

        const p2 = nodePosMap.get(targetName);
        if (p2) {
          const dx = p1[0] - p2[0];
          const dy = p1[1] - p2[1];
          const dz = p1[2] - p2[2];
          if (dx * dx + dy * dy + dz * dz > 0.0001) {
            segments.push([p1, p2]);
          }
        }
      });
    });

    return segments;
  }, [wayfindingData, transform, mapWidth, mapHeight]);

  if (lineSegments.length === 0) return null;

  return (
    <group>
      {lineSegments.map(([startPt, endPt], idx) => (
        <Line
          key={`graph-edge-${idx}`}
          points={[startPt, endPt]}
          color="#38bdf8"
          lineWidth={2}
          dashed={true}
          dashSize={0.8}
          gapSize={0.4}
        />
      ))}
    </group>
  );
});

export const Native3DPathLayer = React.memo(({
  visitorPos,
  targetPos,
  selectedFloor = 'GR',
  transform,
  mapMeta,
  wayfindingData,
  onPositionsComputed,
  onTurnInstructionCalculated,
}: {
  visitorPos?: { x: number; y: number } | null;
  targetPos?: { x: number; y: number } | null;
  selectedFloor?: string;
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

  // Dynamic calculation of Lift position based on active nodes
  const grLiftPos = useMemo(() => {
    const n12 = findWayfindingNode(graphNodes, '12');
    const n7 = findWayfindingNode(graphNodes, '7');

    if (n12 && n7) {
      const p1 = n12.position || n12;
      const p2 = n7.position || n7;
      if (p1.x !== undefined && p2.x !== undefined) {
        return {
          x: (Number(p1.x) + Number(p2.x)) / 2,
          y: (Number(p1.y) + Number(p2.y)) / 2,
        };
      }
    }
    return { x: 5004.59, y: 2313.4 };
  }, [graphNodes]);

  // Target Position Resolution logic aligned with MapView3D
  const resolvedTargetPos = useMemo(() => {
    if (selectedFloor === 'GR') {
      return grLiftPos;
    }
    if (targetPos && typeof targetPos.x === 'number' && typeof targetPos.y === 'number') {
      return targetPos;
    }
    return { x: 5525.298750495607, y: 2491.837930104785 };
  }, [selectedFloor, grLiftPos, targetPos]);

  const hasVisitor = Boolean(visitorPos && typeof visitorPos.x === 'number' && typeof visitorPos.y === 'number');
  const hasTarget = Boolean(resolvedTargetPos && typeof resolvedTargetPos.x === 'number' && typeof resolvedTargetPos.y === 'number');

  const rawPath2D = useMemo(() => {
    if (hasVisitor && hasTarget && graphNodes.length > 0) {
      return calculateDijkstraPath(graphNodes, graphEdges, visitorPos!, resolvedTargetPos!);
    }
    return [];
  }, [graphNodes, graphEdges, hasVisitor, hasTarget, visitorPos, resolvedTargetPos]);

  useEffect(() => {
    if (!onTurnInstructionCalculated) return;

    if (!hasTarget) {
      onTurnInstructionCalculated({
        type: 'searching',
        text: 'Live Tracking Active',
        subtext: 'No destination selected',
      });
      return;
    }

    if (hasVisitor && hasTarget) {
      const distToTarget = Math.hypot(resolvedTargetPos!.x - visitorPos!.x, resolvedTargetPos!.y - visitorPos!.y);
      if (distToTarget <= 100) {
        onTurnInstructionCalculated({
          type: 'arrived',
          text: 'You Have Arrived',
          subtext: 'Destination reached',
        });
        return;
      }
    }

    if (rawPath2D.length >= 3) {
      const p0 = rawPath2D[0];
      const p1 = rawPath2D[1];
      const p2 = rawPath2D[2];

      const turnAngle = (Math.atan2(p1.x * p2.y - p1.y * p2.x, p1.x * p2.x + p1.y * p2.y) * 180) / Math.PI;
      const distToTurn = Math.round(Math.hypot(p1.x - p0.x, p1.y - p0.y) / 50);

      if (turnAngle > 25) {
        onTurnInstructionCalculated({
          type: 'turn-right',
          text: `In ${distToTurn}m, Turn Right`,
          subtext: 'Follow corridor path',
        });
      } else if (turnAngle < -25) {
        onTurnInstructionCalculated({
          type: 'turn-left',
          text: `In ${distToTurn}m, Turn Left`,
          subtext: 'Follow corridor path',
        });
      } else {
        onTurnInstructionCalculated({
          type: 'straight',
          text: `Continue Straight for ${distToTurn}m`,
          subtext: 'Along corridor path',
        });
      }
    } else {
      onTurnInstructionCalculated({
        type: 'straight',
        text: 'Navigating to Target',
        subtext: 'Follow path to destination',
      });
    }
  }, [hasVisitor, hasTarget, visitorPos, resolvedTargetPos, rawPath2D, onTurnInstructionCalculated]);

  const liveVisitorPos = useMemo<[number, number, number] | null>(() => {
    if (!hasVisitor) return null;
    return project2Dto3DTuple(visitorPos!.x, visitorPos!.y, mapWidth, mapHeight, transform, 0.4);
  }, [hasVisitor, visitorPos, mapWidth, mapHeight, transform]);

  const targetPosTuple = useMemo<[number, number, number] | null>(() => {
    if (!hasTarget) return null;
    return project2Dto3DTuple(resolvedTargetPos!.x, resolvedTargetPos!.y, mapWidth, mapHeight, transform, 0.4);
  }, [hasTarget, resolvedTargetPos, mapWidth, mapHeight, transform]);

  useEffect(() => {
    if (onPositionsComputed) {
      onPositionsComputed(liveVisitorPos, targetPosTuple);
    }
  }, [liveVisitorPos, targetPosTuple, onPositionsComputed]);

  const pathCurve = useMemo(() => {
    if (!liveVisitorPos || !targetPosTuple || !transform) return null;

    const currentVisitorVec = new Vector3(...liveVisitorPos);

    const waypoints3D: Vector3[] = rawPath2D.map((pt) => {
      const [wx, wy, wz] = project2Dto3DTuple(pt.x, pt.y, mapWidth, mapHeight, transform, 0.4);
      return new Vector3(wx, wy, wz);
    });

    let closestIdx = 0;
    let minDist = Infinity;
    waypoints3D.forEach((wpt, idx) => {
      const d = currentVisitorVec.distanceTo(wpt);
      if (d < minDist) {
        minDist = d;
        closestIdx = idx;
      }
    });

    const forwardWaypoints = waypoints3D.slice(closestIdx);
    const rawPoints: Vector3[] = [currentVisitorVec, ...forwardWaypoints];
    const targetVec = new Vector3(...targetPosTuple);

    if (rawPoints[rawPoints.length - 1].distanceTo(targetVec) > 0.01) {
      rawPoints.push(targetVec);
    }

    const uniquePoints = rawPoints.filter((point, index) => {
      if (index === 0) return true;
      return point.distanceTo(rawPoints[index - 1]) > 0.1;
    });

    if (uniquePoints.length < 2) return null;
    return new CatmullRomCurve3(uniquePoints);
  }, [liveVisitorPos, targetPosTuple, rawPath2D, transform, mapWidth, mapHeight]);

  useFrame(({ clock }) => {
    const cycle = (clock.getElapsedTime() * 2) % 1;
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
          <mesh frustumCulled={false} material={PATH_GLOW_MAT}>
            <tubeGeometry args={[pathCurve, Math.max(2, rawPath2D.length * 4), 0.35, 8, false]} />
          </mesh>
          <mesh frustumCulled={false} material={PATH_CORE_MAT}>
            <tubeGeometry args={[pathCurve, Math.max(2, rawPath2D.length * 4), 0.15, 8, false]} />
          </mesh>
        </>
      )}

      {liveVisitorPos && (
        <group position={liveVisitorPos} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh ref={pulseMeshRef} frustumCulled={false}>
            <ringGeometry args={[0.8, 1.2, 32]} />
            <meshBasicMaterial ref={pulseMatRef} color="#0085ff" transparent side={DoubleSide} depthTest={false} />
          </mesh>
          <mesh frustumCulled={false} position={[0, 0, 0.02]}>
            <circleGeometry args={[0.6, 32]} />
            <meshBasicMaterial color="#0085ff" side={DoubleSide} depthTest={false} />
          </mesh>
        </group>
      )}

      {targetPosTuple && (
        <group position={targetPosTuple} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh frustumCulled={false} geometry={MARKER_RING_GEO} material={TARGET_RING_MAT} />
          <mesh frustumCulled={false} position={[0, 0, 0.02]} geometry={MARKER_CIRCLE_GEO} material={TARGET_CIRCLE_MAT} />
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
    if (transform) onTransformReady(transform);
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

const MapScene = React.memo(({
  modelUri,
  visitorPos,
  targetPos,
  selectedFloor,
  mapMeta,
  wayfindingData,
  onLoaded,
  onInstructionUpdated,
}: {
  modelUri: string;
  visitorPos: any;
  targetPos: any;
  selectedFloor: string;
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
      let focus: [number, number, number] = [0, 0, 0];

      if (visitor && target) {
        focus = [(visitor[0] + target[0]) / 2, (visitor[1] + target[1]) / 2, (visitor[2] + target[2]) / 2];
      } else if (target) {
        focus = target;
      } else if (visitor) {
        focus = visitor;
      }

      setFocusTarget((prev) => {
        if (Math.abs(prev[0] - focus[0]) < 0.1 && Math.abs(prev[2] - focus[2]) < 0.1) {
          return prev;
        }
        return focus;
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

            <AllNodesDottedPath
              wayfindingData={wayfindingData}
              transform={modelTransform}
              mapMeta={mapMeta}
            />

            <Native3DPathLayer
              visitorPos={visitorPos}
              targetPos={targetPos}
              selectedFloor={selectedFloor}
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
});

export const MB3Native3DMap = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedFloor = useSelector((state: RootState) => state.floor.activeFloor || 'GR');
  
  const [isLoading, setIsLoading] = useState(true);
  const [turnInstruction, setTurnInstruction] = useState<any>(null);
  const [localUri, setLocalUri] = useState<string | null>(null);

  const visitorPos = useSelector((state: RootState) => state.floor.visitorPos);
  const targetPos = useSelector((state: RootState) => state.floor.targetPos);
  const mapMeta = useSelector((state: RootState) => state.floor.mapMeta);
  const wayfindingData = useSelector((state: RootState) => state.floor.wayfindingData);

  useEffect(() => {
    let isMounted = true;
    async function prepareAsset() {
      try {
        const asset = Asset.fromModule(MB3_GR);
        await asset.downloadAsync();
        if (isMounted) {
          setLocalUri(asset.localUri || asset.uri);
        }
      } catch (err) {
        console.error('Failed to unpack GR 3D asset:', err);
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
        const [grMapRes, grWfRes] = await Promise.allSettled([
          getMapDetails(FLOOR_MAP_IDS.GR),
          getWayfindingPath(FLOOR_MAP_IDS.GR),
        ]);

        if (!isMounted) return;

        const grMapData =
          grMapRes.status === 'fulfilled' && grMapRes.value
            ? grMapRes.value.data || grMapRes.value
            : null;

        const grWfData =
          grWfRes.status === 'fulfilled' && grWfRes.value
            ? grWfRes.value.data || grWfRes.value
            : null;

        const mapMetaObj = {
          width: grMapData?.width || grMapData?.image_width || grWfData?.map?.width || 6400,
          height: grMapData?.height || grMapData?.image_height || grWfData?.map?.height || 5120,
        };

        dispatch(
          setFloorMapDetails({
            floor: selectedFloor,
            mapMeta: mapMetaObj,
            wayfindingData: grWfData,
            visitorPos,
            targetPos,
          })
        );
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
  }, [dispatch, selectedFloor]);

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
            selectedFloor={selectedFloor}
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