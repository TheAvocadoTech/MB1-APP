import React, { Suspense, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { useGLTF, OrbitControls, Line } from '@react-three/drei/native';

// 1. Import defaultReaders JSON directly
import defaultReaders from '../../config/rfidReaders.json';



// ─────────────────────────────────────────────────────────────────────────────
// 2. MAP GEOMETRY HELPERS
// ─────────────────────────────────────────────────────────────────────────────
// Adjust MAP_WIDTH & MAP_DEPTH to match the dimensions of your GLB floorplan in 3D space
const MAP_WIDTH = 100;
const MAP_DEPTH = 100;

/**
 * Converts percentages (x: 0-100%, y: 0-100%) to 3D World Coordinates [X, Y, Z]
 * Height offset (height parameter) prevents Z-fighting with the 3D floor
 */
export const pctToWorld = (xPct: number, yPct: number, height = 0.15): [number, number, number] => {
  const wx = ((xPct - 50) / 100) * MAP_WIDTH;
  const wz = ((yPct - 50) / 100) * MAP_DEPTH;
  return [wx, height, wz];
};

export const angleBetween = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.atan2(dx, dy);
};

export const isTurnPoint = (readers: any[], index: number) => {
  if (index === 0 || index >= readers.length - 1) return false;
  const prev = readers[index - 1].coords;
  const curr = readers[index].coords;
  const next = readers[index + 1].coords;

  const a1 = angleBetween(prev, curr);
  const a2 = angleBetween(curr, next);
  return Math.abs(a1 - a2) > 0.3; // Angle threshold for direction change
};


// ─────────────────────────────────────────────────────────────────────────────
// 4. FLAT PATH LAYER (Exact Logic Ported from Web)
// ─────────────────────────────────────────────────────────────────────────────
export function FlatPathLayer({ liveData }: { liveData?: any }) {
  // 1. Resolve readers list & active sequence
  const apiReaders = liveData?.allReaders?.length ? liveData.allReaders : defaultReaders;
  const currentReader = liveData?.currentReader || defaultReaders[0];
  const currentSeq = currentReader.sequence || 1;

  // 2. Merge local JSON coordinates onto live data so coordinate updates take immediate effect
  const allReaders = useMemo(() => {
    return apiReaders.map((r: any) => {
      const local = defaultReaders.find((d: any) => d.id === r.id);
      return local ? { ...r, coords: local.coords, location: local.location } : r;
    });
  }, [apiReaders]);

  // 3. Filter readers that haven't been passed yet (including current)
  const remainingReaders = useMemo(() => {
    return allReaders.filter((r: any) => r.sequence >= currentSeq);
  }, [allReaders, currentSeq]);

  // 4. Convert coordinates to 3D points with slight Y-height offsets (prevents Z-fighting)
  const allPoints3D = useMemo(() => {
    return allReaders.map((r: any) => pctToWorld(r.coords.x, r.coords.y, 0.12));
  }, [allReaders]);

  const remainingPoints3D = useMemo(() => {
    return remainingReaders.map((r: any) => pctToWorld(r.coords.x, r.coords.y, 0.14));
  }, [remainingReaders]);

  return (
    <group>
      {/* ── 1. Full ghost path line (dim gray) flat on 3D floor ── */}
      {allPoints3D.length > 1 && (
        <Line
          points={allPoints3D}
          color="#9ca3af"
          opacity={0.4}
          transparent
          lineWidth={2.5}
        />
      )}

      {/* ── 2. Active remaining path line (glowing cyan) ── */}
      {remainingPoints3D.length > 1 && (
        <>
          {/* Outer glow line */}
          <Line
            points={remainingPoints3D}
            color="#0ea5e9"
            opacity={0.3}
            transparent
            lineWidth={7}
          />
          {/* Core Line */}
          <Line
            points={remainingPoints3D}
            color="#0ea5e9"
            lineWidth={2.5}
          />
        </>
      )}

      {/* ── 3. Current Active Reader Pulsing Ring ── */}
      {allReaders.map((r: any) => {
        if (r.isWaypoint) return null;
        const [wx, wy, wz] = pctToWorld(r.coords.x, r.coords.y, 0.16);
        const isCurrent = r.sequence === currentSeq;

        if (!isCurrent) return null;

        return (
          <group key={r.id} position={[wx, wy, wz]} rotation={[-Math.PI / 2, 0, 0]}>
            {/* Outer soft circle */}
            <mesh>
              <circleGeometry args={[0.8, 32]} />
              <meshBasicMaterial color="#84cc16" opacity={0.22} transparent />
            </mesh>
            {/* Inner Ring */}
            <mesh>
              <ringGeometry args={[0.4, 0.48, 32]} />
              <meshBasicMaterial color="#84cc16" />
            </mesh>
          </group>
        );
      })}

      {/* ── 4. Turn Chevrons flat on 3D floor at direction-change points ── */}
      {allReaders.map((r: any, i: number) => {
        if (!isTurnPoint(allReaders, i)) return null;
        if (r.sequence < currentSeq) return null; // skip passed turns

        const [wx, wy, wz] = pctToWorld(r.coords.x, r.coords.y, 0.18);
        const next = allReaders[i + 1].coords;
        const angle = angleBetween(r.coords, next);

        const chevHaloPoints: [number, number, number][] = [
          [-0.25, 0, -0.2],
          [0, 0, 0.25],
          [0.25, 0, -0.2],
        ];
        const chevCorePoints: [number, number, number][] = [
          [-0.22, 0, -0.18],
          [0, 0, 0.23],
          [0.22, 0, -0.18],
        ];

        const offX = Math.sin(angle) * 0.6;
        const offZ = Math.cos(angle) * 0.6;

        return (
          <group key={`turn-${r.id}`} position={[wx + offX, wy, wz + offZ]} rotation={[0, angle, 0]}>
            <Line points={chevHaloPoints} color="rgba(255,255,255,0.9)" lineWidth={4.5} />
            <Line points={chevCorePoints} color="#0ea5e9" lineWidth={2.8} />
          </group>
        );
      })}

      {/* ── 5. Leading direction arrow flat on floor at current position ── */}
      {remainingReaders.length > 1 && (() => {
        const curr = remainingReaders[0].coords;
        const next = remainingReaders[1].coords;
        const [cx, cy, cz] = pctToWorld(curr.x, curr.y, 0.2);
        const angle = angleBetween(curr, next);

        const arrowPoints: [number, number, number][] = [
          [-0.2, 0, -0.25],
          [0, 0, 0.35],
          [0.2, 0, -0.25],
          [0, 0, -0.1],
          [-0.2, 0, -0.25],
        ];

        return (
          <group position={[cx, cy, cz]} rotation={[0, angle, 0]}>
            <Line points={arrowPoints} color="#0ea5e9" lineWidth={3} />
          </group>
        );
      })()}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MAIN NATIVE MAP COMPONENT
// ─────────────────────────────────────────────────────────────────────────────


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
  },
  recenterText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});