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
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Svg, {
  Circle,
  G,
  Image as SvgImage,
  Path,
  Polygon,
  Polyline,
} from 'react-native-svg';

import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react-native';
import { ImageSource } from '../../constants/assets/images';

import defaultReaders from '../../config/rfidReaders.json';

// ============================================================
// TYPES
// ============================================================

type Point = {
  x: number;
  y: number;
};

type Reader = {
  id: string | number;
  sequence: number;
  coords: Point;
  location?: string;
  isWaypoint?: boolean;
  [key: string]: any;
};

type LiveData = {
  allReaders?: Reader[];
  currentReader?: Reader;
};

type MB1Native2DMapProps = {
  liveData?: LiveData | null;
  cabinType?: string;
};

// ============================================================
// CONSTANTS
// ============================================================

const SVG_WIDTH = 1000;
const SVG_HEIGHT = 700;

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.4;

const CHEVRON_PATH = 'M -10,-6 L 0,6 L 10,-6';

// ============================================================
// GEOMETRY HELPERS
// ============================================================

const px = (x: number): number => (x / 100) * SVG_WIDTH;
const py = (y: number): number => (y / 100) * SVG_HEIGHT;

const angleBetween = (a: Point, b: Point): number => {
  const dx = ((b.x - a.x) / 100) * SVG_WIDTH;
  const dy = ((b.y - a.y) / 100) * SVG_HEIGHT;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
};

const isTurnPoint = (
  readers: Reader[],
  index: number,
  threshold = 25,
): boolean => {
  if (index < 1 || index >= readers.length - 1) {
    return false;
  }

  const previous = readers[index - 1].coords;
  const current = readers[index].coords;
  const next = readers[index + 1].coords;

  const incomingAngle = angleBetween(previous, current);
  const outgoingAngle = angleBetween(current, next);

  let difference = Math.abs(outgoingAngle - incomingAngle);
  if (difference > 180) {
    difference = 360 - difference;
  }

  return difference > threshold;
};

// ============================================================
// COMPONENT
// ============================================================

const MB1Native2DMap: React.FC<MB1Native2DMapProps> = ({ liveData, cabinType }) => {
  const [zoom, setZoom] = useState<number>(MIN_ZOOM);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const zoomRef = useRef<number>(MIN_ZOOM);
  const panRef = useRef({ x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const [selectedCabinMap, setSelectedCabinMap] = useState<any>();

  useEffect(() => {
    switch (cabinType) {
      case "Final Destination (Colo 2)":
        setSelectedCabinMap(ImageSource.Colo_2_Map2D);
        break;
      case "Final Destination (Colo 3)":
        setSelectedCabinMap(ImageSource.Colo_3_Map2D);
        break;
      default:
        setSelectedCabinMap(ImageSource.MapFloorPlan2D);
        break;
    }
  }, [cabinType]);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  const localReaders = defaultReaders as Reader[];

  // ==========================================================
  // API / LIVE READERS & CABIN TYPE OVERRIDES
  // ==========================================================
  const apiReaders = useMemo<Reader[]>(() => {
    if (liveData?.allReaders && liveData.allReaders.length > 0) {
      return liveData.allReaders;
    }
    return localReaders;
  }, [liveData, localReaders]);

  const currentReader = useMemo<Reader>(() => {
    return liveData?.currentReader || localReaders[0];
  }, [liveData, localReaders]);

  const currentSeq = currentReader?.sequence || 1;

  // Merge live data with local coordinates and safely filter per cabinType
  const allReaders = useMemo<Reader[]>(() => {
    const mapped = apiReaders.map((reader) => {
      const localReader = localReaders.find((local) => local.id === reader.id);
      if (localReader) {
        return {
          ...reader,
          coords: localReader.coords,
          location: localReader.location,
        };
      }
      return reader;
    });

    if (cabinType === "Final Destination (Colo 2)") {
      let colo2PathReaders = mapped.filter((reader) => reader.sequence <= 9 || reader.isWaypoint);
      colo2PathReaders.push({
        id: 46,
        sequence: 2.10,
        coords: { x: 51, y: 40 },
        location: "Final Destination (Colo 2)",
        isWaypoint: true,
      });
      return colo2PathReaders;
    }

    if (cabinType === "Final Destination (Colo 3)") {
      let colo3PathReaders = mapped.filter((reader) => reader.sequence <= 3 );
      colo3PathReaders.push({
        id: 47,
        sequence: 2.11,
        coords: { x: 21, y: 30}, // Adjust coordinates for Colo 3 destination endpoint as needed
        location: "Colo 3 Path 1",
        isWaypoint: true,
      });
      
      return colo3PathReaders;
    }

    return mapped;
  }, [apiReaders, localReaders, cabinType]);

  // Split passed and remaining readers based on liveData currentSeq
  const passedReaders = useMemo<Reader[]>(() => {
    return allReaders.filter((reader) => reader.sequence <= currentSeq);
  }, [allReaders, currentSeq]);

  const remainingReaders = useMemo<Reader[]>(() => {
    return allReaders.filter((reader) => reader.sequence >= currentSeq);
  }, [allReaders, currentSeq]);

  // SVG Point Strings for Polyline fallback
  const allPoints = useMemo(() => {
    return allReaders.map((r) => `${px(r.coords.x)},${py(r.coords.y)}`).join(' ');
  }, [allReaders]);

  const passedPoints = useMemo(() => {
    return passedReaders.map((r) => `${px(r.coords.x)},${py(r.coords.y)}`).join(' ');
  }, [passedReaders]);

  const remainingPoints = useMemo(() => {
    return remainingReaders.map((r) => `${px(r.coords.x)},${py(r.coords.y)}`).join(' ');
  }, [remainingReaders]);

  const customPathData = useMemo(() => {
    if (cabinType === "Final Destination (Colo 2)") {
      const startX = px(20);
      const startY = py(39);
      
      return `
        M ${startX} ${startY}
        L ${px(23)} ${py(30)}
        L ${px(23)} ${py(45)}
        L ${px(35)} ${py(45)}
        L ${px(47)} ${py(45)}
        L ${px(47)} ${py(40)}
        L ${px(49.5)} ${py(40)}
        L ${px(49.5)} ${py(35)}
      `;
    }

  if (cabinType === "Final Destination (Colo 3)") {
      const startX = px(20);
      const startY = py(39);
      
      return `
        M ${startX} ${startY}
        L ${px(22.5)} ${py(29.5)}
       
      
        L ${px(11)} ${py(28)}
        L ${px(11.5)} ${py(32)}
      `;
    }

    return null;
  }, [cabinType]);

  // Current and Next Point for Direction Arrow
  const currPt = remainingReaders[0]?.coords;
  const nextPt = remainingReaders[1]?.coords;

  const leadArrowAngle = useMemo(() => {
    if (!currPt || !nextPt) return 0;
    return angleBetween(currPt, nextPt) + 90;
  }, [currPt, nextPt]);

  const destinationReader = allReaders[allReaders.length - 1];

  const totalStops = useMemo(() => {
    return allReaders.filter((reader) => !reader.isWaypoint).length;
  }, [allReaders]);

  const currentStopIndex = useMemo(() => {
    return allReaders.filter((reader) => !reader.isWaypoint && reader.sequence <= currentSeq).length;
  }, [allReaders, currentSeq]);

  // Zoom and Pan Handlers
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

  // Pulse Animation for Current Location
  const pulseAnimation = useRef(new Animated.Value(0)).current;
  const [pulseValue, setPulseValue] = useState(0);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, { toValue: 1, duration: 1000, useNativeDriver: false }),
        Animated.timing(pulseAnimation, { toValue: 0, duration: 1000, useNativeDriver: false }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnimation]);

  useEffect(() => {
    const listenerId = pulseAnimation.addListener(({ value }) => {
      setPulseValue(value);
    });
    return () => pulseAnimation.removeListener(listenerId);
  }, [pulseAnimation]);

  const pulseRadius = 16 + pulseValue * 10;
  const pulseOpacity = 0.3 - pulseValue * 0.25;

  // Turn Points for Chevrons
  const turnPoints = useMemo(() => {
    return allReaders
      .map((reader, index) => {
        if (!isTurnPoint(allReaders, index)) return null;
        if (reader.sequence < currentSeq) return null;

        const nextReader = allReaders[index + 1];
        if (!nextReader) return null;

        const cx = px(reader.coords.x);
        const cy = py(reader.coords.y);
        const outAngle = angleBetween(reader.coords, nextReader.coords) - 90;
        const outRad = (outAngle + 90) * (Math.PI / 180);
        const offsetX = Math.cos(outRad) * 16;
        const offsetY = Math.sin(outRad) * 16;

        return {
          id: reader.id,
          transform: `translate(${cx + offsetX}, ${cy + offsetY}) rotate(${outAngle})`,
        };
      })
      .filter(Boolean) as { id: string | number; transform: string }[];
  }, [allReaders, currentSeq]);

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
              href={selectedCabinMap}
              x="0"
              y="0"
              width="1000"
              height="700"
              preserveAspectRatio="xMidYMid meet"
            />

            {/* Custom or Standard Path Rendering */}
            {customPathData ? (
              <>
                <Path
                  d={customPathData}
                  fill="none"
                  stroke="#0ea5e9"
                  strokeOpacity={0.25}
                  strokeWidth={8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d={customPathData}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth={3.5}
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            ) : (
              <>
                {allReaders.length > 1 && (
                  <Polyline
                    points={allPoints}
                    fill="none"
                    stroke="#94a3b8"
                    strokeOpacity={0.15}
                    strokeWidth={6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                {passedReaders.length > 1 && (
                  <Polyline
                    points={passedPoints}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth={3.5}
                    strokeDasharray="1 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.85}
                  />
                )}
                {remainingReaders.length > 1 && (
                  <Polyline
                    points={remainingPoints}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth={3.5}
                    strokeDasharray="1 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </>
            )}

            {/* Turn Chevrons */}
            {turnPoints.map((turn) => (
              <G key={`turn-${turn.id}`} transform={turn.transform}>
                <Path
                  d={CHEVRON_PATH}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d={CHEVRON_PATH}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </G>
            ))}

            {/* Reader Markers */}
            {allReaders.map((reader) => {
              if (reader.isWaypoint) return null;

              const cx = px(reader.coords.x);
              const cy = py(reader.coords.y);
              const isPassed = reader.sequence < currentSeq;
              const isCurrent = reader.sequence === currentSeq;
              const isDestination = reader.sequence === destinationReader?.sequence;
              const nodeBg = isCurrent ? '#22c55e' : isPassed ? '#94a3b8' : '#0284c7';

              return (
                <G key={reader.id}>
                  {isCurrent && (
                    <>
                      <Circle cx={cx} cy={cy} r={pulseRadius} fill="#22c55e" fillOpacity={pulseOpacity} />
                      <Circle cx={cx} cy={cy} r={14} fill="#22c55e" fillOpacity={0.3} />
                      <Circle cx={cx} cy={cy} r={9} fill="none" stroke="#22c55e" strokeWidth={2.5} />
                    </>
                  )}

                  {isDestination && !isCurrent && !cabinType?.includes("Final Destination") && (
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

                  <Circle
                    cx={cx}
                    cy={cy}
                    r={isCurrent ? 4.5 : isDestination ? 4 : 3}
                    fill={isDestination && !isPassed ? '#dc2626' : nodeBg}
                    stroke="#ffffff"
                    strokeWidth={isCurrent ? 1.5 : 1}
                  />
                </G>
              );
            })}

            {/* Explicitly Render Red Destination Target for Colo 2 */}
            {cabinType === "Final Destination (Colo 2)" && (
              <G>
                <Circle
                  cx={px(49.5)}
                  cy={py(35)}
                  r={12}
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                />
                <Circle
                  cx={px(49.5)}
                  cy={py(35)}
                  r={5}
                  fill="#dc2626"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                />
              </G>
            )}

            {/* Explicitly Render Red Destination Target for Colo 3 */}
            {cabinType === "Final Destination (Colo 3)" && (
              <G>
                <Circle
                  cx={px(11)}
                  cy={py(35)}
                  r={12}
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                />
                <Circle
                  cx={px(11)}
                  cy={py(35)}
                  r={5}
                  fill="#dc2626"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                />
              </G>
            )}

            {/* Current Direction Arrow */}
            {currPt && nextPt && (
              <G
                transform={`translate(${px(currPt.x)}, ${py(currPt.y)}) rotate(${leadArrowAngle})`}
              >
                <Polygon points="-9,7 0,-16 9,7 0,2" fill="#0284c7" stroke="#ffffff" strokeWidth={2} />
              </G>
            )}
          </Svg>
        </Animated.View>

        {/* Zoom Controls */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton} activeOpacity={0.7} onPress={handleZoomIn}>
            <ZoomIn size={18} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} activeOpacity={0.7} onPress={handleZoomOut}>
            <ZoomOut size={18} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} activeOpacity={0.7} onPress={handleReset}>
            <RotateCcw size={17} color="#1f2937" />
          </TouchableOpacity>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard} pointerEvents="none">
          <View style={styles.statusDot} />
          <View style={styles.statusTextContainer}>
            <Text style={styles.statusLabel}>CURRENT LOCATION</Text>
            <Text style={styles.statusLocation} numberOfLines={1}>
              {currentReader?.location || 'Unknown'}
            </Text>
          </View>
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>
              {currentStopIndex} / {totalStops}
            </Text>
          </View>
        </View>

        {/* Path Legend */}
        <View style={styles.legend} pointerEvents="none">
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: '#94a3b8' }]} />
            <Text style={styles.legendText}>Completed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: '#0284c7' }]} />
            <Text style={styles.legendText}>Remaining Path</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MB1Native2DMap;

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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    zIndex: 20,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
    marginRight: 10,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  statusLocation: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 1,
  },
  counterBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  counterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284c7',
  },
  legend: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 6,
    zIndex: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendLine: {
    width: 16,
    height: 3,
    borderRadius: 1.5,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#475569',
  },
});