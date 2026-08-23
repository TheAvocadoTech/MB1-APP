import React, {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  View,
  StyleSheet,
  Image,
} from 'react-native';

import {
  Canvas,
} from '@react-three/fiber/native';

import {
  useGLTF,
  OrbitControls,
} from '@react-three/drei/native';

import {
  Box3,
  Vector3,
} from 'three';

import type {
  GLTF,
} from 'three-stdlib';

import {
  useSelector,
  useDispatch,
} from 'react-redux';

import {
  RootState,
  AppDispatch,
} from '../../store/store';

import {
  selectBleSignal,
  setFloorMapDetails,
} from '../../store/slices/floorSlice';

import {
  getMapDetails,
} from '../../services/ApiUtility';

import {
  FLOOR_MAP_IDS,
} from '../../constants/constants';

import Native3DPathLayer from './Native3DPathLayer';


/**
 * ============================================================
 * MODEL TRANSFORM
 * ============================================================
 *
 * This contains the ACTUAL dimensions of the rotated/centered
 * GLB model.
 *
 * Native3DPathLayer uses exactly the same coordinate system.
 */
export interface ModelMapTransform {

  minX: number;
  maxX: number;

  minZ: number;
  maxZ: number;

  width: number;
  depth: number;

  /**
   * Bottom of the model.
   *
   * RFID path is placed slightly above this.
   */
  floorY: number;
}


/**
 * ============================================================
 * FACILITY MODEL
 * ============================================================
 */
export const FacilityModel = ({
  resolvedAsset,
  onTransformReady,
}: {
  resolvedAsset: any;
  onTransformReady: (
    transform: ModelMapTransform
  ) => void;
}) => {

  const gltf = useGLTF(
    resolvedAsset.uri,
  ) as GLTF;

  const {
    scene,
  } = gltf;


  const {
    clonedScene,
    transform,
  } = useMemo(() => {

    /**
     * Clone the GLB scene.
     */
    const cloned = scene.clone(true);


    /**
     * ========================================================
     * SAME ROTATION AS YOUR EXISTING MAP
     * ========================================================
     *
     * Your GLB needs this rotation to lie correctly.
     */
    cloned.rotation.set(
      -Math.PI / 2,
      0,
      0,
    );

    cloned.updateMatrixWorld(true);


    /**
     * ========================================================
     * FIND BOUNDING BOX AFTER ROTATION
     * ========================================================
     */
    const rotatedBox =
      new Box3().setFromObject(
        cloned,
      );


    const rotatedCenter =
      new Vector3();

    rotatedBox.getCenter(
      rotatedCenter,
    );


    /**
     * ========================================================
     * CENTER THE MODEL
     * ========================================================
     *
     * This makes the center of the GLB:
     *
     * [0, 0, 0]
     */
    cloned.position.set(
      -rotatedCenter.x,
      -rotatedCenter.y,
      -rotatedCenter.z,
    );

    cloned.updateMatrixWorld(true);


    /**
     * ========================================================
     * GET FINAL CENTERED BOUNDING BOX
     * ========================================================
     */
    const centeredBox =
      new Box3().setFromObject(
        cloned,
      );


    const minX =
      centeredBox.min.x;

    const maxX =
      centeredBox.max.x;

    const minZ =
      centeredBox.min.z;

    const maxZ =
      centeredBox.max.z;


    const width =
      maxX - minX;

    const depth =
      maxZ - minZ;


    /**
     * Bottom of the GLB.
     */
    const floorY =
      centeredBox.min.y;


    const transform: ModelMapTransform = {

      minX,
      maxX,

      minZ,
      maxZ,

      width,
      depth,

      floorY,
    };


    console.log(
      '========== GLB MAP TRANSFORM =========='
    );

    console.log(
      'minX:',
      minX,
    );

    console.log(
      'maxX:',
      maxX,
    );

    console.log(
      'minZ:',
      minZ,
    );

    console.log(
      'maxZ:',
      maxZ,
    );

    console.log(
      'width:',
      width,
    );

    console.log(
      'depth:',
      depth,
    );

    console.log(
      'floorY:',
      floorY,
    );

    console.log(
      '======================================='
    );


    return {
      clonedScene: cloned,
      transform,
    };

  }, [scene]);


  /**
   * Send the actual GLB coordinate system
   * to the path layer.
   */
  useEffect(() => {

    onTransformReady(
      transform,
    );

  }, [
    transform,
    onTransformReady,
  ]);


  return (
    <primitive
      object={clonedScene}
      scale={1}
    />
  );
};


/**
 * ============================================================
 * MAP SCENE
 * ============================================================
 *
 * Model and RFID path are rendered inside the SAME Three.js
 * coordinate system.
 */
const MapScene = ({
  resolvedAsset,
  liveData,
}: {
  resolvedAsset: any;
  liveData: any;
}) => {

  const [
    modelTransform,
    setModelTransform,
  ] = useState<ModelMapTransform | null>(
    null,
  );


  return (
    <>

      {/* ======================================================
          LIGHTING
          ====================================================== */}

      <ambientLight
        intensity={0.8}
      />

      <directionalLight
        position={[
          15,
          30,
          15,
        ]}
        intensity={1.2}
      />


      {/* ======================================================
          MODEL + PATH
          ====================================================== */}

      <Suspense
        fallback={null}
      >

        <FacilityModel
          resolvedAsset={
            resolvedAsset
          }
          onTransformReady={
            setModelTransform
          }
        />


        {modelTransform && (

          <Native3DPathLayer
            liveData={
              liveData
            }
            modelTransform={
              modelTransform
            }
          />

        )}

      </Suspense>


      {/* ======================================================
          CAMERA CONTROLS
          ====================================================== */}

      <OrbitControls
        enablePan
        enableZoom
        enableRotate

        /*
         * Change these if you want to restrict zoom-out.
         */
        minDistance={50}
        maxDistance={600}

        target={[
          0,
          0,
          0,
        ]}
      />

    </>
  );
};


/**
 * ============================================================
 * MAIN COMPONENT
 * ============================================================
 */
export const MB3Native3DMap = ({
  liveData,
  modelAsset,
  floor = 'GR',
}: any) => {

  const dispatch =
    useDispatch<AppDispatch>();


  /**
   * Resolve the React Native GLB asset.
   */
  const resolvedAsset =
    Image.resolveAssetSource(
      modelAsset,
    );


  /**
   * ==========================================================
   * REDUX
   * ==========================================================
   */

  const activeFloor =
    useSelector(
      (state: RootState) =>
        state.floor.activeFloor,
    );


  const visitorPos =
    useSelector(
      (state: RootState) =>
        state.floor.visitorPos,
    );


  const targetPos =
    useSelector(
      (state: RootState) =>
        state.floor.targetPos,
    );


  const mapMeta =
    useSelector(
      (state: RootState) =>
        state.floor.mapMeta,
    );


  const wayfindingData =
    useSelector(
      (state: RootState) =>
        state.floor.wayfindingData,
    );


  const floorMapData =
    useSelector(
      (state: RootState) =>
        state.floor.floorMapData,
    );


  const activeRoute =
    useSelector(
      (state: RootState) =>
        state.floor.activeRoute,
    );


  const distance =
    useSelector(
      (state: RootState) =>
        state.floor.distance,
    );


  const proximity =
    useSelector(
      (state: RootState) =>
        state.floor.proximity,
    );


  const bleSignal =
    useSelector(
      selectBleSignal,
    );


  const assets =
    useSelector(
      (state: RootState) =>
        state.floor.assets,
    );


  /**
   * ==========================================================
   * LOAD FLOOR MAP DATA
   * ==========================================================
   */

  useEffect(() => {

    const fetchFloorMaps =
      async () => {

        /**
         * ================================================
         * GR
         * ================================================
         */

        try {

          const grRes =
            await getMapDetails(
              FLOOR_MAP_IDS.GR,
            );


          if (
            grRes &&
            (
              grRes.data ||
              grRes.id
            )
          ) {

            const grData =
              grRes.data ||
              grRes;


            dispatch(
              setFloorMapDetails({
                floor: 'GR',

                mapMeta:
                  grData,

                wayfindingData:
                  grData.wayfinding_path,
              }),
            );
          }

        } catch (
          err: any
        ) {

          console.warn(
            'GR Map init notice:',
            err.message,
          );

        }


        /**
         * ================================================
         * F1
         * ================================================
         */

        try {

          const f1Res =
            await getMapDetails(
              FLOOR_MAP_IDS.F1,
            );


          if (
            f1Res &&
            (
              f1Res.data ||
              f1Res.id
            )
          ) {

            const f1Data =
              f1Res.data ||
              f1Res;


            dispatch(
              setFloorMapDetails({
                floor: 'F1',

                mapMeta:
                  f1Data,

                wayfindingData:
                  f1Data.wayfinding_path,
              }),
            );
          }

        } catch (
          err: any
        ) {

          console.warn(
            'F1 Map init notice:',
            err.message,
          );

        }

      };


    fetchFloorMaps();

  }, [
    dispatch,
  ]);


  /**
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (

    <View
      style={
        styles.container
      }
    >

      <Canvas
        camera={{
          position: [
            0,
            200,
            150,
          ],

          fov: 45,

          near: 0.1,

          far: 100000,
        }}
      >

        <MapScene
          resolvedAsset={
            resolvedAsset
          }
          liveData={
            liveData
          }
        />

      </Canvas>

    </View>

  );
};


/**
 * ============================================================
 * STYLES
 * ============================================================
 */

const styles =
  StyleSheet.create({

    container: {

      flex: 1,

      width: '100%',

      height: '100%',

      backgroundColor:
        '#f8fafc',
    },

    diagnosticsOverlay: {

      position: 'absolute',

      top: 0,

      left: 0,

      right: 0,

      zIndex: 10,
    },

  });