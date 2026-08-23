import React, { useMemo } from 'react';
import { Line } from '@react-three/drei/native';
import defaultReaders from '../../config/rfidReaders.json';

const FLOOR_WIDTH = 40;
const FLOOR_DEPTH = 28;

/**
 * Exact port of Web pctToWorld logic:
 * Maps percentage coords (0-100) to 3D scene units with origin at center [0,0,0]
 */
export const pctToWorld = (xPct: number, yPct: number, height = 0.15): [number, number, number] => {
  return [
    (xPct / 100) * FLOOR_WIDTH - FLOOR_WIDTH / 2,
    height,
    (yPct / 100) * FLOOR_DEPTH - FLOOR_DEPTH / 2,
  ];
};

export const angleBetween = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dx = ((b.x - a.x) / 100) * FLOOR_WIDTH;
  const dz = ((b.y - a.y) / 100) * FLOOR_DEPTH;
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
  const apiReaders    = liveData?.allReaders?.length ? liveData.allReaders : defaultReaders;
  const currentReader = liveData?.currentReader || defaultReaders[0];
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
      {allPoints3D.length > 1 && (
        <Line
          points={allPoints3D}
          color="#9ca3af"
          opacity={0.4}
          transparent
          lineWidth={2.5}
          depthTest={false}
          depthWrite={false}
        />
      )}

      {/* ── 2. Active remaining path line (glowing cyan) ── */}
      {remainingPoints3D.length > 1 && (
        <>
          <Line
            points={remainingPoints3D}
            color="#0ea5e9"
            opacity={0.3}
            transparent
            lineWidth={7}
            depthTest={false}
            depthWrite={false}
          />
          <Line
            points={remainingPoints3D}
            color="#0ea5e9"
            lineWidth={2.5}
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
              <circleGeometry args={[0.8, 32]} />
              <meshBasicMaterial color="#84cc16" opacity={0.22} transparent depthTest={false} depthWrite={false} />
            </mesh>
            <mesh>
              <ringGeometry args={[0.4, 0.48, 32]} />
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