import React from 'react';
import { View, StyleSheet, LayoutChangeEvent, Dimensions } from 'react-native';

import {
  Camera,
  DefaultLight,
  FilamentScene,
  FilamentView,
  Model,
  useCameraManipulator,
} from 'react-native-filament';

import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-worklets-core';


export const MB1NativeMap3D = () => {
  return (
    <FilamentScene>
      <MB1FilamentMap />
      {/* <Scene/> */}
    </FilamentScene>
  );
};
// function Scene() {
//       const MB1_CAMPUS_GLB =require('../../assets/Images/GRFloor.glb');
// const cameraManipulator = useCameraManipulator({
//         orbitHomePosition: [0, 0, 8],
//         targetPosition: [0, 0, 0],
//         orbitSpeed: [0.003, 0.0031]
//     });
//     const viewHeight = Dimensions. get('window').height;
//     const panGesture = Gesture. Pan()
//     .onBegin( (event) =>{
//         const yCorrected = viewHeight - event. translationY;
//         cameraManipulator?.grabBegin(event.translationX, yCorrected,false);  
//     }).onUpdate((event)=>{
//         const yCorrected = viewHeight - event. translationY;
//         cameraManipulator?.grabUpdate(event.translationX, yCorrected);
//     })
//     .maxPointers(1)
//     .onEnd (() => {
//         cameraManipulator?.grabEnd();
//     });
//     const previousScale = useSharedValue(1) ;
//     const scaleMultiplier = 100;
//     const pinchGesture = Gesture. Pinch()
//     .onBegin(({ scale }) => {
//         previousScale.value = scale;
//     }).onUpdate(({scale,focalX,focalY})=>{
//         const delta = scale - previousScale. value;
//         cameraManipulator?.scroll(focalX, focalY, -delta * scaleMultiplier);
//         previousScale.value = scale;
//     })
//     const combinedGesture = Gesture. Race (pinchGesture, panGesture);
//     return(
//       <GestureDetector gesture={ combinedGesture}>
//         <FilamentView style={styles.filamentView}>
//            <Camera cameraManipulator={cameraManipulator} />
//            <DefaultLight />
//            <Model source={MB1_CAMPUS_GLB} />
//         </FilamentView>
//       </GestureDetector>
//     );
// }


const MB1FilamentMap = () => {
  // const MB1_CAMPUS_GLB =
  //   require('../../assets/Images/1stFloor.glb');
 const MB1_CAMPUS_GLB =
    require('../../assets/models/mb1-campus.glb');
  const [viewHeight, setViewHeight] = React.useState(1);

  const cameraManipulator = useCameraManipulator({
   orbitHomePosition: [0, 100, 300],
    targetPosition: [0, 0, 0],
    upVector: [0, 1, 0],

    // Rotation sensitivity
    orbitSpeed: [0.003, 0.003],

    // IMPORTANT: must be an array
    zoomSpeed: [3.05],
  });


  const onLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;

    if (height > 0) {
      setViewHeight(height);
    }
  };


  /*
   * ONE FINGER
   *
   * Drag finger = orbit/rotate camera
   */
 const panGesture = Gesture.Pan()
  .minPointers(1)
  .maxPointers(1)
  .runOnJS(true)
  .onBegin((event) => {
    console.log('PAN BEGIN', event.x, event.y);

    const y = viewHeight - event.y;

    cameraManipulator?.grabBegin(
      event.x,
      y,
      false
    );
  })
  .onUpdate((event) => {
    const y = viewHeight - event.y;

    cameraManipulator?.grabUpdate(
      event.x,
      y
    );
  })
  .onEnd(() => {
    console.log('PAN END');
    cameraManipulator?.grabEnd();
  })
  .onFinalize(() => {
    cameraManipulator?.grabEnd();
  });


const pinchGesture = Gesture.Pinch()
  .runOnJS(true)

  .onBegin((event) => {
    console.log(
      '========== PINCH BEGIN ==========',
      event.scale
    );
  })

  .onStart((event) => {
    console.log(
      '========== PINCH START ==========',
      event.scale
    );
  })

  .onUpdate((event) => {
    console.log(
      'PINCH:',
      'scale =',
      event.scale,
      'focalX =',
      event.focalX,
      'focalY =',
      event.focalY
    );

    if (!cameraManipulator) {
      console.log('NO CAMERA MANIPULATOR');
      return;
    }

    const y =
      viewHeight - event.focalY;

    /*
     * Use incremental scale instead of
     * absolute event.scale.
     */
    const delta =
      (1 - event.scale) * 5;

    cameraManipulator.scroll(
      event.focalX,
      y,
      delta
    );
  })

  .onEnd(() => {
    console.log('PINCH END');
  })

  .onFinalize(() => {
    console.log('PINCH FINALIZE');
  });


const composedGesture =
  Gesture.Simultaneous(
    panGesture,
    pinchGesture
  );


  return (
  <GestureDetector gesture={composedGesture}>
  <View
    style={styles.gestureContainer}
    onLayout={onLayout}
  >
    <FilamentView style={styles.filamentView}>

      <DefaultLight />

      <Camera
        cameraManipulator={cameraManipulator}
        near={0.1}
        far={100000}
      />

      <Model
        source={MB1_CAMPUS_GLB}
      />

    </FilamentView>
  </View>
</GestureDetector>
  );
};


const styles = StyleSheet.create({

  gestureContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  filamentView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

});