import React, { useMemo } from 'react';
import { Line } from '@react-three/drei/native';
import defaultReaders from '../../config/rfidReaders.json';

const FLOOR_WIDTH = 40;
const FLOOR_DEPTH = 28;

// Keeps your correct reader-to-reader distance scaling
const SCALE_X = 1.0;
const SCALE_Z = 1.0;

// Re-anchored origins to translate the start point directly onto the marked red spot
const BASE_SCALE = 0.55;
const BASE_ORIGIN_X = -6.3; // Decreased from -8.8 to slide path LEFT into the room
const BASE_ORIGIN_Z = -3.7;   // Increased from -4.3 to slide path DOWN into the hallway

// Average percentage center of your map path coordinates
const CENTER_X_PCT = 50; 
const CENTER_Y_PCT = 50; 

// Automatically re-anchor origin without altering relative spacing
const ORIGIN_X = BASE_ORIGIN_X - (CENTER_X_PCT / 100) * FLOOR_WIDTH * (SCALE_X - BASE_SCALE);
const ORIGIN_Z = BASE_ORIGIN_Z - (CENTER_Y_PCT / 100) * FLOOR_DEPTH * (SCALE_Z - BASE_SCALE);

/**
 * Maps percentage coords accurately onto the 3D floor plan
 */
export const pctToWorld = (xPct: number, yPct: number, height = 0.15): [number, number, number] => {
  const worldX = (xPct / 100) * (FLOOR_WIDTH * SCALE_X) + ORIGIN_X;
  const worldZ = (yPct / 100) * (FLOOR_DEPTH * SCALE_Z) + ORIGIN_Z;

  return [worldX, height, worldZ];
};

export const angleBetween = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dx = ((b.x - a.x) / 100) * FLOOR_WIDTH * (SCALE_X / 0.55);
  const dz = ((b.y - a.y) / 100) * FLOOR_DEPTH * (SCALE_Z / 0.55);
  return Math.atan2(dx, dz);
};

export const isTurnPoint = (readers: any[], i: number, threshold = 25) => {
  if (i < 1 || i >= readers.length - 1) return false;
  const prev = readers[i - 1].coords;
  const curr = readers[i].coords;
  const next = readers[i + 1].coords;

  const dx1 = ((curr.x - prev.x) / 100) * FLOOR_WIDTH;
  const dz1 = ((curr.y - prev.y) / 100) * FLOOR_DEPTH;
  const inAngle = Math.atan2(dx1, dz1);

  const dx2 = ((next.x - curr.x) / 100) * FLOOR_WIDTH;
  const dz2 = ((next.y - curr.y) / 100) * FLOOR_DEPTH;
  const outAngle = Math.atan2(dx2, dz2);

  let diff = Math.abs((outAngle - inAngle) * (180 / Math.PI));
  if (diff > 180) diff = 360 - diff;
  return diff > threshold;
};

export function FlatPathLayer({ liveData }: { liveData?: any }) {
  const apiReaders    = liveData?.data?.allReaders?.length ? liveData.data.allReaders : defaultReaders;
  const currentReader = liveData?.data?.currentReader || defaultReaders[0];
  const currentSeq    = currentReader.sequence || 1;

  const allReaders = useMemo(() => {
    return apiReaders.map((r: any) => {
      const local = defaultReaders.find((d: any) => d.id === r.id);
      return local ? { ...r, coords: local.coords, location: local.location } : r;
    });
  }, [apiReaders]);

  const remainingReaders = useMemo(() => {
    return allReaders.filter((r: any) => r.sequence >= currentSeq);
  }, [allReaders, currentSeq]);

  const allPoints3D = useMemo(() => {
    return allReaders.map((r: any) => pctToWorld(r.coords.x, r.coords.y, 0.12));
  }, [allReaders]);

  const remainingPoints3D = useMemo(() => {
    return remainingReaders.map((r: any) => pctToWorld(r.coords.x, r.coords.y, 0.14));
  }, [remainingReaders]);

  return (
    <group renderOrder={999}>
      {/* ── 1. Full ghost path line (dim gray) ── */}
      {/* ── 1. Full ghost path line (dim gray) ── */}
      {allPoints3D.length > 1 && (
        <Line
          points={allPoints3D}
          color="#9ca3af"
          opacity={0.4}
          transparent
          lineWidth={1.2} // Reduced from 2.5
          depthTest={false}
          depthWrite={false}
        />
      )}

      {/* ── 2. Active remaining path line (glowing cyan) ── */}
      {remainingPoints3D.length > 1 && (
        <>
          {/* Outer glow line */}
          {/* <Line
            points={remainingPoints3D}
            color="#0ea5e9"
            opacity={0.3}
            transparent
            lineWidth={3.5} // Reduced from 7
            depthTest={false}
            depthWrite={false}
          /> */}
          {/* Inner core line */}
          <Line
            points={remainingPoints3D}
            color="#0ea5e9"
            lineWidth={1.2} // Reduced from 2.5
            depthTest={false}
            depthWrite={false}
          />
        </>
      )}

      {/* ── 3. Current Active Reader Ring ── */}
      {allReaders.map((r: any) => {
        if (r.isWaypoint) return null;
        const [wx, wy, wz] = pctToWorld(r.coords.x, r.coords.y, 0.16);
        const isCurrent = r.sequence === currentSeq;

        if (!isCurrent) return null;

        return (
          <group key={r.id} position={[wx, wy, wz]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh>
              <circleGeometry args={[0.5, 32]} />
              <meshBasicMaterial color="#84cc16" opacity={0.22} transparent depthTest={false} depthWrite={false} />
            </mesh>
            <mesh>
              <ringGeometry args={[0.25, 0.32, 32]} />
              <meshBasicMaterial color="#84cc16" depthTest={false} depthWrite={false} />
            </mesh>
          </group>
        );
      })}

      {/* ── 4. Turn Chevrons at direction-change points ── */}
      {allReaders.map((r: any, i: number) => {
        if (!isTurnPoint(allReaders, i)) return null;
        if (r.sequence < currentSeq) return null;

        const [wx, wy, wz] = pctToWorld(r.coords.x, r.coords.y, 0.18);
        const next = allReaders[i + 1].coords;
        const angle = angleBetween(r.coords, next);

        const chevHaloPoints: [number, number, number][] = [
          [-0.25, 0, -0.2],
          [0,     0,  0.25],
          [0.25,  0, -0.2],
        ];
        const chevCorePoints: [number, number, number][] = [
          [-0.22, 0, -0.18],
          [0,     0,  0.23],
          [0.22,  0, -0.18],
        ];

        const offX = Math.sin(angle) * 0.6;
        const offZ = Math.cos(angle) * 0.6;

        return (
          <group key={`turn-${r.id}`} position={[wx + offX, wy, wz + offZ]} rotation={[0, angle, 0]}>
            <Line points={chevHaloPoints} color="rgba(255,255,255,0.9)" lineWidth={4.5} depthTest={false} depthWrite={false} />
            <Line points={chevCorePoints} color="#0ea5e9" lineWidth={2.8} depthTest={false} depthWrite={false} />
          </group>
        );
      })}

      {/* ── 5. Leading direction arrow at current position ── */}
      {remainingReaders.length > 1 && (() => {
        const curr = remainingReaders[0].coords;
        const next = remainingReaders[1].coords;
        const [cx, cy, cz] = pctToWorld(curr.x, curr.y, 0.2);
        const angle = angleBetween(curr, next);

        const arrowPoints: [number, number, number][] = [
          [-0.2, 0, -0.25],
          [0,    0,  0.35],
          [0.2,  0, -0.25],
          [0,    0, -0.1],
          [-0.2, 0, -0.25],
        ];

        return (
          <group position={[cx, cy, cz]} rotation={[0, angle, 0]}>
            <Line points={arrowPoints} color="#0ea5e9" lineWidth={3} depthTest={false} depthWrite={false} />
          </group>
        );
      })()}
    </group>
  );
}