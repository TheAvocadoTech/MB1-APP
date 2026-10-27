import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Animated,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import Svg, {
  Circle,
  G,
  Image as SvgImage,
  Path,
  Polygon,
} from 'react-native-svg';

import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react-native';

// ============================================================
// TYPES
// ============================================================

type Point = {
  x: number;
  y: number;
};

type MarkerLocation = {
  id: string | number;
  name: string;
  coords: Point;
};

type MB1Commons2DMapProps = {
  activeLocationId?: string | number;
  cabinetName?: string;
};

// ============================================================
// CONSTANTS
// ============================================================

const SVG_WIDTH = 1000;
const SVG_HEIGHT = 700;

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.4;

const px = (x: number): number => (x / 100) * SVG_WIDTH;
const py = (y: number): number => (y / 100) * SVG_HEIGHT;

const MB1Commons2DMap: React.FC<MB1Commons2DMapProps> = ({ activeLocationId, cabinetName }) => {
  const [zoom, setZoom] = useState<number>(MIN_ZOOM);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const zoomRef = useRef<number>(MIN_ZOOM);
  const panRef = useRef({ x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const [MappedLocations, setMappedLocations] = useState<MarkerLocation[]>([]);

  useEffect(() => {
    if (cabinetName === "Wash Room") {
      const restRoomReaders: MarkerLocation[] = [
        { id: 'reception', name: 'Reception', coords: { x: 20, y: 40 } },
        { id: 'manTrap', name: 'ManTrap', coords: { x: 21, y: 35 } },
        { id: 'abovecolo3Door', name: 'Abovecolo3Door', coords: { x: 22.5, y: 30 } },
        // { id: 'key-cabinet', name: 'Key cabinet', coords: { x: 23, y: 33 } },
        { id: 'bom12MainEntryDoor', name: 'Bom12MainEntryDoor', coords: { x: 23, y: 39 } },
        { id: 'restroom', name: 'Restroom', coords: { x: 20, y: 50 } },
      ];
      setMappedLocations(restRoomReaders);
    } else if (cabinetName === "Key Cabin") {
      const keyCabinReaders: MarkerLocation[] = [
        { id: 'reception', name: 'Reception', coords: { x: 20, y: 40 } },
        { id: 'manTrap', name: 'ManTrap', coords: { x: 21, y: 35 } },
        { id: 'abovecolo3Door', name: 'Abovecolo3Door', coords: { x: 22.5, y: 30 } },
        { id: 'key-cabinet', name: 'Key cabinet', coords: { x: 23, y: 33 } },
      ];
      setMappedLocations(keyCabinReaders);
    } else if (cabinetName === "NOC Room") {
      const nocRoomReaders: MarkerLocation[] = [
        { id: 'reception', name: 'Reception', coords: { x: 20, y: 40 } },
        { id: 'manTrap', name: 'ManTrap', coords: { x: 21, y: 35 } },
        { id: 'abovecolo3Door', name: 'Abovecolo3Door', coords: { x: 22.5, y: 30 } },
        { id: 'bom12MainEntryDoor', name: 'Bom12MainEntryDoor', coords: { x: 23, y: 39 } },
                { id: 'nocRoomDoor', name: 'NocRoomDoor', coords: { x: 27, y: 45 } },

        { id: 'noc', name: 'NOC', coords: { x: 27, y: 41 } },
      ];
      setMappedLocations(nocRoomReaders);
    } else if (cabinetName === "Loading Area") {
      const loadingAreaReaders: MarkerLocation[] = [
        { id: 'reception', name: 'Reception', coords: { x: 20, y: 40 } },
        { id: 'manTrap', name: 'ManTrap', coords: { x: 21, y: 35 } },
        // { id: 'key-cabinet', name: 'Key cabinet', coords: { x: 23, y: 33 } },
        { id: 'abovecolo3Door', name: 'Abovecolo3Door', coords: { x: 22.5, y: 30 } },
        { id: 'frontOfVSRDoor', name: 'FrontOfVSRDoor', coords: { x: 35, y: 45 } },
         { id: 'bom12MainEntryDoor', name: 'Bom12MainEntryDoor', coords: { x: 23, y: 39 } },

        { id: 'nocRoomDoor', name: 'NocRoomDoor', coords: { x: 27, y: 45 } },
        { id: 'frontOfACarrierDoor', name: 'FrontOfACarrierDoor', coords: { x: 39, y: 46 } },
        { id: 'loadingArea', name: 'LoadingArea', coords: { x: 47, y: 45 } },
      ];
      setMappedLocations(loadingAreaReaders);
    }
    else if (cabinetName === "Final Destination (Colo 1)") {
      const loadingAreaReaders: MarkerLocation[] = [
        { id: 'reception', name: 'Reception', coords: { x: 20, y: 40 } },
        { id: 'manTrap', name: 'ManTrap', coords: { x: 21, y: 35 } },
        // { id: 'key-cabinet', name: 'Key cabinet', coords: { x: 23, y: 33 } },
        { id: 'abovecolo3Door', name: 'Abovecolo3Door', coords: { x: 22.5, y: 30 } },
        { id: 'frontOfVSRDoor', name: 'FrontOfVSRDoor', coords: { x: 35, y: 45 } },
         { id: 'bom12MainEntryDoor', name: 'Bom12MainEntryDoor', coords: { x: 23, y: 39 } },

        { id: 'nocRoomDoor', name: 'NocRoomDoor', coords: { x: 27, y: 45 } },
        { id: 'frontOfACarrierDoor', name: 'FrontOfACarrierDoor', coords: { x: 39, y: 46 } },
        { id: 'loadingArea', name: 'LoadingArea', coords: { x: 47, y: 45 } },
                { id: 'aboveColo2Door', name: 'AboveColo2Door', coords: { x: 47, y: 40 } },
                { id: 'colo12Passage1', name: 'Colo1-2Passage1', coords: { x: 52, y: 40 } },
                                { id: 'colo12Passage2', name: 'Colo1-2Passage2', coords: { x: 57, y: 40 } },
              { id: 'colo12Passage2', name: 'Colo1Entry', coords: { x: 61, y: 40 } },
              { id: 'facingTowardRow5-6', name: 'FacingTowardRow5-6', coords: { x: 61, y: 44 } },
              { id: 'firstReaderofRow5-6', name: 'FirstReaderOfRow5-6', coords: { x: 65, y: 44 } },
              { id: 'finalDestination(Colo-1)', name: 'FinalDestination((Colo-1))', coords: { x: 70, y: 44 } },



      ];
      setMappedLocations(loadingAreaReaders);
    }
  }, [cabinetName]);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  const handleZoomIn = useCallback(() => {
    setZoom((currentZoom) => {
      const nextZoom = Math.min(currentZoom + ZOOM_STEP, MAX_ZOOM);
      zoomRef.current = nextZoom;
      return nextZoom;
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((currentZoom) => {
      const nextZoom = Math.max(currentZoom - ZOOM_STEP, MIN_ZOOM);
      zoomRef.current = nextZoom;
      if (nextZoom === MIN_ZOOM) {
        panRef.current = { x: 0, y: 0 };
        setPan({ x: 0, y: 0 });
      }
      return nextZoom;
    });
  }, []);

  const handleReset = useCallback(() => {
    zoomRef.current = MIN_ZOOM;
    panRef.current = { x: 0, y: 0 };
    setZoom(MIN_ZOOM);
    setPan({ x: 0, y: 0 });
  }, []);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => zoomRef.current > MIN_ZOOM,
        onMoveShouldSetPanResponder: () => zoomRef.current > MIN_ZOOM,
        onPanResponderGrant: (event) => {
          if (zoomRef.current <= MIN_ZOOM) return;
          dragStartRef.current = {
            x: event.nativeEvent.pageX - panRef.current.x,
            y: event.nativeEvent.pageY - panRef.current.y,
          };
        },
        onPanResponderMove: (event) => {
          if (zoomRef.current <= MIN_ZOOM) return;
          const newPan = {
            x: event.nativeEvent.pageX - dragStartRef.current.x,
            y: event.nativeEvent.pageY - dragStartRef.current.y,
          };
          panRef.current = newPan;
          setPan(newPan);
        },
        onPanResponderRelease: () => {},
        onPanResponderTerminate: () => {},
      }),
    [],
  );

  // Pulse animation using interpolation
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: false }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1000, useNativeDriver: false }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  const pulseRadius = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 24],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 0.1],
  });

  // ==========================================================
  // PATH GENERATOR (Conditional per Cabinet Name)
  // ==========================================================
 
 // ==========================================================
  // PATH GENERATOR (Conditional per Cabinet Name)
  // ==========================================================
  const curveDataString = useMemo(() => {
    const reception = MappedLocations.find((loc) => loc.id === 'reception');
    if (!reception) return '';

    // If cabinetName is "Key Cabin", render smooth upward-bowing arch
    if (cabinetName === "Key Cabin") {
      const startX = px(20);
      const startY = py(40);
      const controlX = px(23);
      const controlY = py(24);
      const endX = px(23);
      const endY = py(33);

      return `
        M ${startX} ${startY}
        Q ${controlX} ${controlY}, ${endX} ${endY}
      `;
    }

    // If cabinetName is "NOC Room", render the orthogonal routing matching the NOC reference image
    if (cabinetName === "NOC Room") {
      const startX = px(20);
      const startY = py(40);
      const corner1X = px(23);
      const corner1Y = py(30);
      const corner2X = px(23);
      const corner2Y = py(45);
      const corner3X = px(27);
      const corner3Y = py(45);
      const endX = px(27);
      const endY = py(41);

      return `
        M ${startX} ${startY}
        L ${corner1X} ${corner1Y + 2}
        Q ${corner1X} ${corner1Y}, ${corner1X + 4} ${corner1Y}
        L ${corner2X} ${corner2Y - 4}
        Q ${corner2X} ${corner2Y}, ${corner2X + 4} ${corner2Y}
        L ${corner3X - 4} ${corner3Y}
        Q ${corner3X} ${corner3Y}, ${corner3X} ${corner3Y - 4}
        L ${endX} ${endY}
      `;
    }

    // Default / Wash Room Orthogonal Hallway Path
    const target = MappedLocations.find((loc) => loc.id === 'restroom') || MappedLocations[MappedLocations.length - 1];
    if (!target) return '';

    const startX = px(20);
    const startY = py(39);
    const corner1X = px(23);
    const corner1Y = py(30);
    const corner2X = px(23);
    const corner2Y = cabinetName === "Loading Area" ? py(45) : py(48);
    const endX = px(target.coords.x);
    const endY = py(target.coords.y);

    return `
      M ${startX} ${startY}
      L ${corner1X} ${corner1Y + 2}
      Q ${corner1X} ${corner1Y}, ${corner1X - 4} ${corner1Y}
      L ${corner2X} ${corner2Y - 8}
      Q ${corner2X} ${corner2Y}, ${corner2X - 4} ${corner2Y}
      L ${endX} ${endY}
    `;
  }, [MappedLocations, cabinetName]);

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer} {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.mapWrapper,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { scale: zoom },
              ],
            },
          ]}
        >
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 1000 700"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Floor Plan Image */}
            <SvgImage
              href={require('../../assets/Images/CommonsMap.png')}
              x="0"
              y="0"
              width="1000"
              height="700"
              preserveAspectRatio="xMidYMid meet"
            />

            {/* Blue Dotted Path Line */}
            {curveDataString ? (
              <Path
                d={curveDataString}
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6,6"
              />
            ) : null}

           {/* Render Standalone Marker Points at Each Location */}
            <G>
              {MappedLocations.map((loc, index) => {
                const isActive = activeLocationId === loc.id;
                const isUserLocation = loc.id === 'reception';
                
                // Identify the final destination point (last item in array)
                const isDestination = index === MappedLocations.length - 1 && !isUserLocation;
                
                const cx = px(loc.coords.x);
                const cy = py(loc.coords.y);

                return (
                  <G key={`marker-pin-${loc.id}`}>
                    {/* Green Pulse for User's Current Location */}
                    {isUserLocation && (
                      <AnimatedCircle
                        cx={cx}
                        cy={cy}
                        r={pulseRadius}
                        fill="#22c55e"
                        opacity={pulseOpacity}
                      />
                    )}

                    {/* Red Highlighted Pulse Ring for Active Selected Destination */}
                    {isActive && !isUserLocation && (
                      <AnimatedCircle
                        cx={cx}
                        cy={cy}
                        r={pulseRadius}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="3"
                        opacity={pulseOpacity}
                      />
                    )}

                    {/* Dashed Red Ring for Path Destination Point */}
                    {isDestination && (
                      <Circle
                        cx={cx}
                        cy={cy}
                        r={10}
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth={2}
                        strokeDasharray="3 3"
                      />
                    )}

                    {/* Conditional Pin rendering: Navigation Polygon for User Location vs Standard Pin for others */}
                    {isUserLocation ? (
                      <G transform={`translate(${cx}, ${cy})`}>
                        <Polygon
                          points="-9,7 0,-16 9,7 0,2"
                          fill="#22c55e"
                          stroke="#ffffff"
                          strokeWidth={2}
                        />
                      </G>
                    ) : (
                      <G>
                        <Circle
                          cx={cx}
                          cy={cy}
                          r={7}
                          fill={isActive || isDestination ? '#ef4444' : '#0284c7'}
                          stroke="#ffffff"
                          strokeWidth={2}
                        />
                      </G>
                    )}
                  </G>
                );
              })}
            </G>
          </Svg>
        </Animated.View>

        {/* Zoom Controls */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
            <ZoomIn size={18} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
            <ZoomOut size={18} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} onPress={handleReset}>
            <RotateCcw size={17} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MB1Commons2DMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomControls: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 25,
    gap: 6,
  },
  zoomButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});