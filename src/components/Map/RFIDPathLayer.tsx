// import React from 'react';
// import {
//   View,
//   StyleSheet,
//   LayoutChangeEvent,
// } from 'react-native';

// // import Svg, {
// //   Polyline,
// //   Circle,
// // } from 'react-native-svg';


// export type RFIDReader = {
//   sequence: number;
//   id: number;
//   location: string;

//   coords: {
//     x: number;
//     y: number;
//   };

//   ip?: string;
//   sr?: string;
//   ser?: string;
//   port?: number;
//   isWaypoint?: boolean;
// };


// type RFIDPathLayerProps = {
//   readers: RFIDReader[];

//   /*
//    * Converts your RFID coordinate system
//    * into screen/SVG coordinates.
//    */
//   scale?: number;

//   offsetX?: number;
//   offsetY?: number;

//   /*
//    * Full path
//    */
//   showFullPath?: boolean;

//   fullPathColor?: string;
//   fullPathWidth?: number;

//   /*
//    * Active/highlighted path
//    */
//   showActivePath?: boolean;

//   activePathColor?: string;
//   activePathWidth?: number;

//   /*
//    * Reader markers
//    */
//   markerRadius?: number;
// };


// export const RFIDPathLayer = ({
//   readers,

//   scale = 1,

//   offsetX = 0,
//   offsetY = 0,

//   showFullPath = true,

//   fullPathColor = '#9ca3af',
//   fullPathWidth = 3,

//   showActivePath = true,

//   activePathColor = '#0ea5e9',
//   activePathWidth = 6,

//   markerRadius = 7,

// }: RFIDPathLayerProps) => {

//   const [viewWidth, setViewWidth] = React.useState(1);
//   const [viewHeight, setViewHeight] = React.useState(1);


//   /*
//    * Same logic as your web version:
//    *
//    * allReaders
//    *   ↓
//    * sequence sort
//    */

//   const orderedReaders = React.useMemo(() => {

//     return [...readers]
//       .filter(
//         reader =>
//           reader.coords &&
//           Number.isFinite(reader.coords.x) &&
//           Number.isFinite(reader.coords.y),
//       )
//       .sort(
//         (a, b) =>
//           a.sequence - b.sequence,
//       );

//   }, [readers]);


//   /*
//    * Convert RFID coordinates
//    * into SVG coordinates.
//    */

//   const points = React.useMemo(() => {

//   return orderedReaders.map(reader => {

//     const x =
//       (reader.coords.x / 100) *
//       viewWidth;

//     const y =
//       (reader.coords.y / 100) *
//       viewHeight;

//     return {
//       x,
//       y,
//     };

//   });

// }, [
//   orderedReaders,
//   viewWidth,
//   viewHeight,
// ]);

//   /*
//    * SVG Polyline format:
//    *
//    * "x1,y1 x2,y2 x3,y3"
//    */

//   const polylinePoints = React.useMemo(() => {

//     return points
//       .map(
//         point =>
//           `${point.x},${point.y}`,
//       )
//       .join(' ');

//   }, [points]);


//   /*
//    * Layout
//    */

//   const onLayout = (
//     event: LayoutChangeEvent,
//   ) => {

//     const {
//       width,
//       height,
//     } = event.nativeEvent.layout;

//     if (width > 0) {
//       setViewWidth(width);
//     }

//     if (height > 0) {
//       setViewHeight(height);
//     }
//   };


//   return (

//     <View
//       pointerEvents="none"
//       style={StyleSheet.absoluteFill}
//       onLayout={onLayout}
//     >

//       <Svg
//         width={viewWidth}
//         height={viewHeight}
//         viewBox={`0 0 ${viewWidth} ${viewHeight}`}
//       >

//         {/* =================================================
//             1. FULL RFID PATH
//             Same idea as:
//             <Line color="#9ca3af" />
//            ================================================= */}

//         {showFullPath &&
//           points.length > 1 && (

//             <Polyline
//               points={polylinePoints}

//               fill="none"

//               stroke={fullPathColor}

//               strokeWidth={fullPathWidth}

//               strokeLinecap="round"

//               strokeLinejoin="round"

//               opacity={0.45}
//             />

//           )}


//         {/* =================================================
//             2. HIGHLIGHTED PATH
//             Same idea as your cyan active path.
            
//             We draw a wide transparent line first,
//             then a narrower core line.
//            ================================================= */}

//         {showActivePath &&
//           points.length > 1 && (
//             <>

//               {/* Outer glow */}

//               <Polyline
//                 points={polylinePoints}

//                 fill="none"

//                 stroke={activePathColor}

//                 strokeWidth={
//                   activePathWidth * 2.5
//                 }

//                 strokeLinecap="round"

//                 strokeLinejoin="round"

//                 opacity={0.25}
//               />


//               {/* Core */}

//               <Polyline
//                 points={polylinePoints}

//                 fill="none"
                
//                 stroke={activePathColor}

//                 strokeWidth={
//                   activePathWidth
//                 }

//                 strokeLinecap="round"

//                 strokeLinejoin="round"

//                 opacity={1}
//               />

//             </>
//           )}


//         {/* =================================================
//             3. RFID READER MARKERS
//            ================================================= */}

//         {points.map(
//           (point, index) => {

//             const reader =
//               orderedReaders[index];

//             return (

//               <React.Fragment
//                 key={`rfid-${reader.id}`}
//               >

//                 {/* Outer halo */}

//                 <Circle
//                   cx={point.x}
//                   cy={point.y}

//                   r={
//                     markerRadius * 1.8
//                   }

//                   fill="#0ea5e9"

//                   opacity={0.2}
//                 />


//                 {/* Reader */}

//                 <Circle
//                   cx={point.x}
//                   cy={point.y}

//                   r={markerRadius}

//                   fill="#0ea5e9"

//                   stroke="#ffffff"

//                   strokeWidth={2}
//                 />

//               </React.Fragment>

//             );

//           },
//         )}

//       </Svg>

//     </View>

//   );
// };