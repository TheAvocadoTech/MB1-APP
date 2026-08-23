import React, {
  useMemo,
} from 'react';

import {
  Line,
} from '@react-three/drei/native';

import defaultReaders from '../../config/rfidReaders.json';

import type {
  ModelMapTransform,
} from './MB3Native3DMap';


/**
 * ============================================================
 * PROPS
 * ============================================================
 */

interface Native3DPathLayerProps {

  liveData?: any;

  
  modelTransform:
    ModelMapTransform;
}



function pctToWorld(
  x: number,
  y: number,
  height: number,
  transform: ModelMapTransform,
): [number, number, number] {

  const normalizedX =
    Number(x) / 100;


  const normalizedY =
    Number(y) / 100;

  const worldX =
    transform.minX +
    normalizedX *
      transform.width;


  const worldZ =
    transform.maxZ -
    normalizedY *
      transform.depth;

  const worldY =
    transform.floorY +
    height;


  return [
    worldX,
    worldY,
    worldZ,
  ];
}


/**
 * ============================================================
 * ANGLE BETWEEN TWO RFID POINTS
 * ============================================================
 */
function angleBetween(
  a: {
    x: number;
    y: number;
  },

  b: {
    x: number;
    y: number;
  },

  transform: ModelMapTransform,
) {

  const dx =
    (
      (b.x - a.x) /
      100
    ) *
    transform.width;


  /**
   * Negative because RFID Y is mapped to
   * reversed Three.js Z.
   */
  const dz =
    -(
      (b.y - a.y) /
      100
    ) *
    transform.depth;


  return Math.atan2(
    dx,
    dz,
  );
}


/**
 * ============================================================
 * TURN DETECTION
 * ============================================================
 */
function isTurnPoint(
  readers: any[],
  index: number,
  transform: ModelMapTransform,
  threshold = 25,
) {

  if (
    index < 1 ||
    index >=
      readers.length - 1
  ) {
    return false;
  }


  const prev =
    readers[
      index - 1
    ].coords;


  const curr =
    readers[
      index
    ].coords;


  const next =
    readers[
      index + 1
    ].coords;


  /**
   * Incoming direction.
   */
  const dx1 =
    (
      (curr.x - prev.x) /
      100
    ) *
    transform.width;


  const dz1 =
    -(
      (curr.y - prev.y) /
      100
    ) *
    transform.depth;


  const inAngle =
    Math.atan2(
      dx1,
      dz1,
    );


  /**
   * Outgoing direction.
   */
  const dx2 =
    (
      (next.x - curr.x) /
      100
    ) *
    transform.width;


  const dz2 =
    -(
      (next.y - curr.y) /
      100
    ) *
    transform.depth;


  const outAngle =
    Math.atan2(
      dx2,
      dz2,
    );


  let diff =
    Math.abs(
      (
        outAngle -
        inAngle
      ) *
        (
          180 /
          Math.PI
        ),
    );


  if (
    diff > 180
  ) {

    diff =
      360 - diff;

  }


  return (
    diff >
    threshold
  );
}


/**
 * ============================================================
 * PATH LAYER
 * ============================================================
 */
export default function Native3DPathLayer({
  liveData,
  modelTransform,
}: Native3DPathLayerProps) {


  /**
   * ==========================================================
   * READERS
   * ==========================================================
   */

  const apiReaders =
    liveData?.allReaders?.length
      ? liveData.allReaders
      : defaultReaders;


  const currentReader =
    liveData?.currentReader ||
    defaultReaders[0];


  const currentSeq =
    currentReader?.sequence ||
    1;


  /**
   * ==========================================================
   * MERGE API DATA WITH LOCAL COORDINATES
   * ==========================================================
   */

  const allReaders =
    useMemo(() => {

      return apiReaders.map(
        (reader: any) => {

          const local =
            defaultReaders.find(
              (d: any) =>
                d.id ===
                reader.id,
            );


          return local
            ? {

                ...reader,

                coords:
                  local.coords,

                location:
                  local.location,

              }
            : reader;

        },
      );

    }, [
      apiReaders,
    ]);


  /**
   * ==========================================================
   * REMAINING PATH
   * ==========================================================
   */

  const remainingReaders =
    useMemo(() => {

      return allReaders.filter(
        (reader: any) =>
          reader.sequence >=
          currentSeq,
      );

    }, [
      allReaders,
      currentSeq,
    ]);


  /**
   * ==========================================================
   * FULL PATH
   * ==========================================================
   */

  const allPoints3D =
    useMemo(() => {

      return allReaders

        .filter(
          (reader: any) =>
            reader.coords &&
            reader.coords.x !==
              undefined &&
            reader.coords.y !==
              undefined,
        )

        .map(
          (reader: any) =>
            pctToWorld(

              reader.coords.x,

              reader.coords.y,

              0.15,

              modelTransform,
            ),
        );

    }, [
      allReaders,
      modelTransform,
    ]);


  /**
   * ==========================================================
   * ACTIVE PATH
   * ==========================================================
   */

  const remainingPoints3D =
    useMemo(() => {

      return remainingReaders

        .filter(
          (reader: any) =>
            reader.coords &&
            reader.coords.x !==
              undefined &&
            reader.coords.y !==
              undefined,
        )

        .map(
          (reader: any) =>
            pctToWorld(

              reader.coords.x,

              reader.coords.y,

              0.18,

              modelTransform,
            ),
        );

    }, [
      remainingReaders,
      modelTransform,
    ]);


  /**
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (

    <group>


      {/* ======================================================
          FULL / GHOST PATH
          ====================================================== */}

      {allPoints3D.length > 1 && (

        <Line
          points={
            allPoints3D
          }

          color="#9ca3af"

          opacity={0.4}

          transparent

          lineWidth={2.5}
        />

      )}


      {/* ======================================================
          ACTIVE BLUE PATH - GLOW
          ====================================================== */}

      {remainingPoints3D.length > 1 && (

        <Line
          points={
            remainingPoints3D
          }

          color="#0ea5e9"

          opacity={0.30}

          transparent

          lineWidth={7}
        />

      )}


      {/* ======================================================
          ACTIVE BLUE PATH - CORE
          ====================================================== */}

      {remainingPoints3D.length > 1 && (

        <Line
          points={
            remainingPoints3D
          }

          color="#0ea5e9"

          lineWidth={2.5}
        />

      )}


      {/* ======================================================
          CURRENT RFID READER
          ====================================================== */}

      {allReaders.map(
        (
          reader: any,
        ) => {

          /**
           * Ignore waypoint.
           */
          if (
            reader.isWaypoint
          ) {
            return null;
          }


          /**
           * Only current reader.
           */
          if (
            reader.sequence !==
            currentSeq
          ) {
            return null;
          }


          /**
           * Make sure coordinates exist.
           */
          if (
            !reader.coords ||
            reader.coords.x ===
              undefined ||
            reader.coords.y ===
              undefined
          ) {
            return null;
          }


          const [
            wx,
            wy,
            wz,
          ] =
            pctToWorld(

              reader.coords.x,

              reader.coords.y,

              0.20,

              modelTransform,
            );


          return (

            <group
              key={
                `current-${reader.id}`
              }

              position={[
                wx,
                wy,
                wz,
              ]}
            >


              {/* ==========================================
                  CURRENT LOCATION HALO
                  ========================================== */}

              <mesh
                rotation={[
                  -Math.PI / 2,
                  0,
                  0,
                ]}
              >

                <circleGeometry
                  args={[
                    0.8,
                    32,
                  ]}
                />

                <meshBasicMaterial
                  color="#84cc16"
                  opacity={0.22}
                  transparent
                  depthWrite={false}
                />

              </mesh>


              {/* ==========================================
                  CURRENT LOCATION RING
                  ========================================== */}

              <mesh
                rotation={[
                  -Math.PI / 2,
                  0,
                  0,
                ]}
              >

                <ringGeometry
                  args={[
                    0.4,
                    0.48,
                    32,
                  ]}
                />

                <meshBasicMaterial
                  color="#84cc16"
                  depthWrite={false}
                />

              </mesh>

            </group>

          );

        },
      )}


      {/* ======================================================
          TURN CHEVRONS
          ====================================================== */}

      {allReaders.map(
        (
          reader: any,
          index: number,
        ) => {

          /**
           * Is this a turn?
           */
          if (
            !isTurnPoint(
              allReaders,
              index,
              modelTransform,
            )
          ) {
            return null;
          }


          /**
           * Don't show completed turns.
           */
          if (
            reader.sequence <
            currentSeq
          ) {
            return null;
          }


          const next =
            allReaders[
              index + 1
            ]?.coords;


          if (!next) {
            return null;
          }


          if (
            !reader.coords
          ) {
            return null;
          }


          const [
            wx,
            wy,
            wz,
          ] =
            pctToWorld(

              reader.coords.x,

              reader.coords.y,

              0.22,

              modelTransform,
            );


          const angle =
            angleBetween(

              reader.coords,

              next,

              modelTransform,
            );


          const offX =
            Math.sin(
              angle,
            ) *
            0.6;


          const offZ =
            Math.cos(
              angle,
            ) *
            0.6;


          /**
           * White halo.
           */
          const haloPoints = [

            [
              -0.25,
              0,
              -0.2,
            ],

            [
              0,
              0,
              0.25,
            ],

            [
              0.25,
              0,
              -0.2,
            ],

          ] as [
            number,
            number,
            number,
          ][];


          /**
           * Blue core.
           */
          const corePoints = [

            [
              -0.22,
              0,
              -0.18,
            ],

            [
              0,
              0,
              0.23,
            ],

            [
              0.22,
              0,
              -0.18,
            ],

          ] as [
            number,
            number,
            number,
          ][];


          return (

            <group

              key={
                `turn-${reader.id}`
              }

              position={[
                wx + offX,
                wy,
                wz + offZ,
              ]}

              rotation={[
                0,
                angle,
                0,
              ]}
            >


              <Line
                points={
                  haloPoints
                }

                color="#ffffff"

                lineWidth={4.5}
              />


              <Line
                points={
                  corePoints
                }

                color="#0ea5e9"

                lineWidth={2.8}
              />

            </group>

          );

        },
      )}


      {/* ======================================================
          CURRENT DIRECTION ARROW
          ====================================================== */}

      {remainingReaders.length > 1 &&
        (() => {

          const curr =
            remainingReaders[
              0
            ]?.coords;


          const next =
            remainingReaders[
              1
            ]?.coords;


          if (
            !curr ||
            !next
          ) {
            return null;
          }


          const [
            cx,
            cy,
            cz,
          ] =
            pctToWorld(

              curr.x,

              curr.y,

              0.24,

              modelTransform,
            );


          const angle =
            angleBetween(

              curr,

              next,

              modelTransform,
            );


          const arrowPoints = [

            [
              -0.2,
              0,
              -0.25,
            ],

            [
              0,
              0,
              0.35,
            ],

            [
              0.2,
              0,
              -0.25,
            ],

            [
              0,
              0,
              -0.1,
            ],

            [
              -0.2,
              0,
              -0.25,
            ],

          ] as [
            number,
            number,
            number,
          ][];


          return (

            <group

              position={[
                cx,
                cy,
                cz,
              ]}

              rotation={[
                0,
                angle,
                0,
              ]}
            >

              <Line
                points={
                  arrowPoints
                }

                color="#0ea5e9"

                lineWidth={3}
              />

            </group>

          );

        })()}

    </group>
  );
}