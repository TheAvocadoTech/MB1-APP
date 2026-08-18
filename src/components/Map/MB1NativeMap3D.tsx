// import React from 'react';

// import defaultReaders from '../../config/rfidReaders.json';

// import {
//   View,
//   StyleSheet,
//   LayoutChangeEvent,
// } from 'react-native';

// import {
//   Camera,
//   DefaultLight,
//   FilamentScene,
//   FilamentView,
//   Model,
//   useCameraManipulator,
// } from 'react-native-filament';

// import {
//   Gesture,
//   GestureDetector,
// } from 'react-native-gesture-handler';

// import {
//   RFIDPathLayer,
// } from './RFIDPathLayer';


// export const MB1NativeMap3D = () => {
//   return (
//     <FilamentScene>
//       <MB1FilamentMap />
//     </FilamentScene>
//   );
// };

// const MB1FilamentMap = () => {
//      const orderedReaders = React.useMemo(() => {
//     return [...defaultReaders].sort(
//       (a, b) => a.sequence - b.sequence,
//     );
//   }, []);
//   const MB1_CAMPUS_GLB =
//     require('../../assets/models/mb1-campus.glb');

//   const [viewHeight, setViewHeight] = React.useState(1);

//   const cameraManipulator = useCameraManipulator({
//     orbitHomePosition: [0, 30, 90],

//     targetPosition: [0, 20, 0],

//     orbitSpeed: [0.003, 0.003],

//     upVector: [0, 1, 0],

//     zoomSpeed: [1.05],
//   });

//   const onLayout = (
//     event: LayoutChangeEvent,
//   ) => {
//     const height =
//       event.nativeEvent.layout.height;

//     if (height > 0) {
//       setViewHeight(height);
//     }
//   };

//   const panGesture = Gesture.Pan()
//     .minPointers(1)
//     .maxPointers(1)
//     .runOnJS(true)

//     .onBegin((event) => {
//       if (!cameraManipulator) {
//         return;
//       }

//       const y =
//         viewHeight - event.y;

//       cameraManipulator.grabBegin(
//         event.x,
//         y,
//         false,
//       );
//     })

//     .onUpdate((event) => {
//       if (!cameraManipulator) {
//         return;
//       }

//       const y =
//         viewHeight - event.y;

//       cameraManipulator.grabUpdate(
//         event.x,
//         y,
//       );
//     })

//     .onEnd(() => {
//       if (!cameraManipulator) {
//         return;
//       }

//       cameraManipulator.grabEnd();
//     })

//     .onFinalize(() => {
//       if (!cameraManipulator) {
//         return;
//       }

//       cameraManipulator.grabEnd();
//     });

//   return (
//     <GestureDetector gesture={panGesture}>
//       <View
//         style={styles.gestureContainer}
//         onLayout={onLayout}
//       >
//         <FilamentView
//           style={styles.filamentView}
//         >
//           <DefaultLight />

//           <Camera
//             cameraManipulator={
//               cameraManipulator
//             }
//             near={0.1}
//             far={100000}
//           />

//           <Model
//             source={MB1_CAMPUS_GLB}
//           />
         
         
          

//         </FilamentView>
//          <RFIDPathLayer
//         readers={orderedReaders}

//         scale={1}

//         offsetX={0}

//         offsetY={0}
//       />

//       </View>
//     </GestureDetector>
//   );
// };
// // const MB1FilamentMap = () => {

// //   const orderedReaders = React.useMemo(() => {
// //     return [...defaultReaders].sort(
// //       (a, b) => a.sequence - b.sequence,
// //     );
// //   }, []);

// //   const MB1_CAMPUS_GLB =
// //     require('../../assets/models/mb1-campus.glb');

// //   const [viewHeight, setViewHeight] =
// //     React.useState(1);


// //   /*
// //    * CAMERA
// //    */
// //   const cameraManipulator =
// //     useCameraManipulator({

// //       orbitHomePosition: [
// //         0,
// //         30,
// //         90,
// //       ],

// //       targetPosition: [
// //         0,
// //         20,
// //         0,
// //       ],

// //       orbitSpeed: [
// //         0.003,
// //         0.003,
// //       ],

// //       upVector: [
// //         0,
// //         1,
// //         0,
// //       ],

// //       zoomSpeed: [
// //         1.05,
// //       ],
// //     });


// //   /*
// //    * VIEW HEIGHT
// //    */
// //   const onLayout = (
// //     event: LayoutChangeEvent,
// //   ) => {

// //     const height =
// //       event.nativeEvent.layout.height;

// //     if (height > 0) {
// //       setViewHeight(height);
// //     }
// //   };


// //   /*
// //    * ONE FINGER DRAG
// //    */
// //   const panGesture = Gesture.Pan()

// //     .minPointers(1)

// //     .maxPointers(1)

// //     .runOnJS(true)

// //     .onBegin((event) => {

// //       if (!cameraManipulator) {
// //         return;
// //       }

// //       const y =
// //         viewHeight - event.y;

// //       cameraManipulator.grabBegin(
// //         event.x,
// //         y,
// //         false,
// //       );
// //     })

// //     .onUpdate((event) => {

// //       if (!cameraManipulator) {
// //         return;
// //       }

// //       const y =
// //         viewHeight - event.y;

// //       cameraManipulator.grabUpdate(
// //         event.x,
// //         y,
// //       );
// //     })

// //     .onEnd(() => {

// //       if (!cameraManipulator) {
// //         return;
// //       }

// //       cameraManipulator.grabEnd();
// //     });

  
// //   return (
// //     <GestureDetector
// //       gesture={panGesture}
// //     >

// //       <View
// //         style={styles.gestureContainer}
// //         onLayout={onLayout}
// //       >

// //         <FilamentView
// //           style={styles.filamentView}
// //         >

// //           <DefaultLight />

// //           <Camera
// //             cameraManipulator={
// //               cameraManipulator
// //             }
// //             near={0.1}
// //             far={100000}
// //           />

// //           {/* YOUR EXISTING CAMPUS MODEL */}
// //           <Model
// //             source={MB1_CAMPUS_GLB}
// //           />

// //           {/* RFID PATH */}
// //           <RFIDPathLayer
// //             readers={orderedReaders}
// //             markerSize={1}
// //             markerHeight={1}
// //             pathHeight={0.15}
// //             pathThickness={0.12}
// //           />

// //         </FilamentView>

// //       </View>

// //     </GestureDetector>
// //   );
// // };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },

  
//   gestureContainer: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },

//   filamentView: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },

// });