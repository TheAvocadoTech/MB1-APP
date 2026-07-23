import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';

import { default as Text } from '../../../../components/Text/MSText';
import { ImageSource } from '../../../../constants/assets/images';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './NavigationScreen.styles';

const HTML_3D_RENDERER = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <style>
        body { margin: 0; overflow: hidden; background-color: #FFFFFF; }
        canvas { width: 100vw; height: 100vh; display: block; }
        #loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: sans-serif;
            font-size: 16px;
            color: #87848A;
        }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
</head>
<body>
    <div id="loading">Loading 3D Map...</div>
    <script>
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 20, 30);

        // PERFORMANCE OPTIMIZATION: Disable antialiasing, medium precision, and high performance preference
        const renderer = new THREE.WebGLRenderer({ 
            antialias: false,
            powerPreference: "high-performance",
            precision: "mediump"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        // PERFORMANCE OPTIMIZATION: Cap pixel ratio to 1.5 instead of 3.0+ on high-DPI screens
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        // PERFORMANCE OPTIMIZATION: Disable expensive dynamic shadows
        renderer.shadowMap.enabled = false;
        document.body.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxPolarAngle = Math.PI / 2 - 0.05;

        // Smooth camera slide state
        let isAnimating = true;
        const targetCameraPos = new THREE.Vector3(0, 20, 30);
        const targetLookAt = new THREE.Vector3(0, 0, 0);

        // Stop auto slide if user starts dragging/zooming
        controls.addEventListener('start', function() {
            isAnimating = false;
        });

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(20, 40, 20);
        scene.add(dirLight);

        // Grid helper
        const gridHelper = new THREE.GridHelper(50, 50, 0xE2D6DA, 0xEDEDED);
        scene.add(gridHelper);

        let currentModel = null;
        let modelShift = new THREE.Vector3(0, 0, 0);
        window.cachedPolyline = null;

        window.loadModel = function(base64Data, cabinetName) {
            const loadingEl = document.getElementById('loading');
            if (loadingEl) loadingEl.style.display = 'none';
            
            // Clean up previous model to prevent overlapping models and memory leaks
            if (currentModel) {
                scene.remove(currentModel);
                currentModel.traverse(function(node) {
                    if (node.isMesh) {
                        if (node.geometry) node.geometry.dispose();
                        if (Array.isArray(node.material)) {
                            node.material.forEach(m => m.dispose());
                        } else if (node.material) {
                            node.material.dispose();
                        }
                    }
                });
                currentModel = null;
            }

            const loader = new THREE.GLTFLoader();
            loader.load(base64Data, function(gltf) {
                currentModel = gltf.scene;
                scene.add(currentModel);

                // Pre-traverse: Hide wireframes, lines, points, helper grids, and large floor slabs
                currentModel.traverse((node) => {
                    const nameLower = (node.name || "").toLowerCase();
                    
                    // Hide any line segments, lines, points, or wireframes (removes wireframe nets/grids)
                    if (node.isLine || node.isLineSegments || node.isPoints || (node.material && node.material.wireframe)) {
                        console.log("Hiding line/wireframe helper:", node.name);
                        node.visible = false;
                        return;
                    }

                    if (node.isMesh) {
                        const tempBox = new THREE.Box3().setFromObject(node);
                        const tempSize = tempBox.getSize(new THREE.Vector3());
                        
                        // Hide grids / helpers by name keywords
                        const isHelperName = nameLower.includes("grid") || nameLower.includes("net") || nameLower.includes("helper") || nameLower.includes("guide") || nameLower.includes("outline") || nameLower.includes("wire");
                        
                        // Baseplates / slabs are large in BOTH horizontal dimensions (X and Z) but very flat in Y (thickness < 0.8)
                        const isBaseplate = tempSize.x > 15 && tempSize.z > 15 && tempSize.y < 0.8;
                        const isFloorKeyword = nameLower.includes("floor") || nameLower.includes("base") || nameLower.includes("plane") || nameLower.includes("slab") || nameLower.includes("ground") || nameLower.includes("plateau");
                        
                        if (isHelperName || isBaseplate || (isFloorKeyword && tempSize.y < 0.8)) {
                            console.log("Hiding helper/baseplate node:", node.name, "size:", tempSize.x, tempSize.y, tempSize.z);
                            node.visible = false;
                        }
                    }
                });
                
                // Auto-center and scale model
                const box = new THREE.Box3().setFromObject(currentModel);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                
                modelShift.set(-center.x, -center.y, -center.z);
                
                currentModel.position.x += modelShift.x;
                currentModel.position.y += modelShift.y;
                currentModel.position.z += modelShift.z;
                
                const maxDim = Math.max(size.x, size.y, size.z);
                
                // Focus camera initially
                targetCameraPos.set(0, maxDim * 1.0, maxDim * 1.3);
                targetLookAt.set(0, 0, 0);
                
                camera.position.copy(targetCameraPos);
                controls.target.copy(targetLookAt);
                controls.update();

                // If cabinetName is provided, focus and slide camera to it
                if (cabinetName) {
                    window.focusOnCabinet(cabinetName);
                }

                // If polyline coordinates were passed before model finished loading, draw them now
                if (window.cachedPolyline) {
                    const c = window.cachedPolyline;
                    window.drawPolyline(c.points, c.mapMeta);
                }
            }, undefined, function(error) {
                if (loadingEl) loadingEl.innerText = 'Failed to load 3D Map';
                console.error('Error loading GLB:', error);
            });
        };

        window.focusOnCabinet = function(cabinetName) {
            console.log("Requesting focus on cabinet:", cabinetName);
            let found = false;
            scene.traverse(function(child) {
                if (!found && child.isMesh && child.name) {
                    const cleanName = child.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                    const cleanTarget = cabinetName.toLowerCase().replace(/[^a-z0-9]/g, '');
                    
                    if (cleanName.includes(cleanTarget) || cleanTarget.includes(cleanName)) {
                        console.log("Found matching 3D node:", child.name);
                        
                        // Flash or highlight target mesh red
                        if (child.material) {
                            child.material = child.material.clone();
                            child.material.color.setHex(0xE2231A);
                        }

                        const worldPos = new THREE.Vector3();
                        child.getWorldPosition(worldPos);
                        
                        targetLookAt.copy(worldPos);
                        targetCameraPos.set(worldPos.x, worldPos.y + 6, worldPos.z + 9);
                        isAnimating = true;
                        found = true;
                    }
                }
            });
        };

        window.convertPixelToWorld = function(pixelX, pixelY, mapMeta) {
            const ppm = mapMeta.ppm || 50.0739;
            const originX = mapMeta.origin_x || 306.45;
            const originY = mapMeta.origin_y || 3856.48;
            
            const worldX = (pixelX - originX) / ppm;
            const worldZ = (originY - pixelY) / ppm;
            
            return { x: worldX, z: worldZ };
        };

        window.drawPolyline = function(points, mapMeta) {
            window.cachedPolyline = { points, mapMeta };
            console.log("Drawing polyline with points:", points, "mapMeta:", mapMeta, "modelShift:", modelShift);
            
            if (window.currentPathLines && window.currentPathLines.length > 0) {
                window.currentPathLines.forEach(line => {
                    scene.remove(line);
                    if (line.geometry) line.geometry.dispose();
                    if (line.material) line.material.dispose();
                });
            }
            window.currentPathLines = [];

            if (!points || points.length < 2 || !mapMeta) return;

            // Define custom Curve for TubeGeometry
            class SegmentCurve extends THREE.Curve {
                constructor(v1, v2) {
                    super();
                    this.v1 = v1;
                    this.v2 = v2;
                }
                getPoint(t, optionalTarget) {
                    const target = optionalTarget || new THREE.Vector3();
                    return target.lerpVectors(this.v1, this.v2, t);
                }
            }

            // Convert points to 3D world coordinates and shift them relative to the centered model
            const convertedPoints = points.map(pt => {
                const world = window.convertPixelToWorld(pt.x, pt.y, mapMeta);
                return new THREE.Vector3(world.x + modelShift.x, 0.3 + modelShift.y, world.z + modelShift.z);
            });

            for (let i = 0; i < convertedPoints.length - 1; i++) {
                const startPoint = convertedPoints[i];
                const endPoint = convertedPoints[i+1];
                
                const curve = new SegmentCurve(startPoint, endPoint);
                const tubeGeom = new THREE.TubeGeometry(curve, 10, 0.25, 8, false); // Radius 0.25 for clear thick path tube
                const tubeMat = new THREE.MeshBasicMaterial({ color: 0x00A3FF, transparent: true, opacity: 0.8 });
                
                const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
                scene.add(tubeMesh);
                window.currentPathLines.push(tubeMesh);
            }
        };

        window.zoomIn = function() {
            isAnimating = false;
            camera.position.multiplyScalar(0.8);
            controls.update();
        };

        window.zoomOut = function() {
            isAnimating = false;
            camera.position.multiplyScalar(1.25);
            controls.update();
        };

        window.selectFloor = function(floor) {
            console.log("Selected floor in 3D scene:", floor);
        };

        function animate() {
            requestAnimationFrame(animate);
            if (isAnimating) {
                camera.position.lerp(targetCameraPos, 0.05);
                controls.target.lerp(targetLookAt, 0.05);
                if (camera.position.distanceTo(targetCameraPos) < 0.01 && 
                    controls.target.distanceTo(targetLookAt) < 0.01) {
                    isAnimating = false;
                }
            }
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    </script>
</body>
</html>
`;

const WebViewComponent = WebView as any;

type RouteParams = {
    NavigationScreen: {
        cabinetName?: string;
    };
};

const NavigationScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute<RouteProp<RouteParams, 'NavigationScreen'>>();
    const cabinetName = route.params?.cabinetName || 'GR CL1 R1 0021';

    // Fetch cabinet data from Redux
    const { cabinetDetails, visitorAssignedCabinet, visitorLocation } = useSelector((state: RootState) => state.cabinet);

    const { colors } = useTheme();
    const styles = useStyles(colors);

    const [selectedFloor, setSelectedFloor] = useState<string>('F2');
    const [modelBase64, setModelBase64] = useState<string | null>(null);
    const [loadingModel, setLoadingModel] = useState<boolean>(true);
    const webViewRef = React.useRef<any>(null);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleGetIntoPhone = async () => {
        const url = 'https://temp-browser.vercel.app/';
        try {
            await Linking.openURL(url);
        } catch (error) {
            Alert.alert('Error', 'Unable to open browser.');
            console.log('Error opening URL:', error);
        }
    };

    const handleZoomIn = () => {
        if (webViewRef.current) {
            webViewRef.current.injectJavaScript(`window.zoomIn(); void(0);`);
        }
    };

    const handleZoomOut = () => {
        if (webViewRef.current) {
            webViewRef.current.injectJavaScript(`window.zoomOut(); void(0);`);
        }
    };

    const handleSelectFloor = (floor: string) => {
        setSelectedFloor(floor);
        if (webViewRef.current) {
            webViewRef.current.injectJavaScript(`window.selectFloor("${floor}"); void(0);`);
        }
    };

    // Load GLB model file as base64 when selectedFloor changes
    useEffect(() => {
        const loadGLB = async () => {
            setLoadingModel(true);
            try {
                const asset = selectedFloor === 'F1' ? ImageSource.GrFloorGlb : ImageSource.MapGlb;
                const source = Image.resolveAssetSource(asset);
                console.log('Fetching local GLB asset URI for floor', selectedFloor, ':', source.uri);
                const response = await fetch(source.uri);
                const blob = await response.blob();
                
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result as string;
                    setModelBase64(base64data);
                    setLoadingModel(false);
                };
                reader.onerror = (err) => {
                    console.log('FileReader error:', err);
                    setLoadingModel(false);
                };
                reader.readAsDataURL(blob);
            } catch (error) {
                console.log('Error loading GLB asset:', error);
                setLoadingModel(false);
            }
        };

        loadGLB();
    }, [selectedFloor]);

    const handleWebViewLoadEnd = () => {
        if (modelBase64 && webViewRef.current) {
            console.log('WebView loaded, injecting 3D model base64...');
            webViewRef.current.injectJavaScript(`window.loadModel("${modelBase64}", "${cabinetName}"); void(0);`);
        }
    };

    useEffect(() => {
        if (modelBase64 && webViewRef.current) {
            console.log('Model base64 updated, injecting to WebView...');
            webViewRef.current.injectJavaScript(`window.loadModel("${modelBase64}", "${cabinetName}"); void(0);`);
        }
    }, [modelBase64, cabinetName]);

    // Draw polyline when coordinates are available
    useEffect(() => {
        if (visitorLocation && webViewRef.current) {
            const points: { x: number; y: number }[] = [];
            
            // 1. Add start location
            if (visitorLocation.location) {
                points.push({
                    x: visitorLocation.location.x,
                    y: visitorLocation.location.y
                });
            }
            
            // 2. Add wayfinding path nodes in sequence
            if (visitorLocation.wayfinding?.route_to_destination?.nodes) {
                visitorLocation.wayfinding.route_to_destination.nodes.forEach((node: any) => {
                    if (node.position) {
                        points.push({
                            x: node.position.x,
                            y: node.position.y
                        });
                    }
                });
            }
            
            // 3. Add target coordinates / end location
            if (visitorLocation.target_coordinates) {
                points.push({
                    x: visitorLocation.target_coordinates.x,
                    y: visitorLocation.target_coordinates.y
                });
            } else if (visitorAssignedCabinet?.cabinet) {
                points.push({
                    x: visitorAssignedCabinet.cabinet.x,
                    y: visitorAssignedCabinet.cabinet.y
                });
            }
            
            if (points.length >= 2 && visitorLocation.map) {
                console.log('Injecting drawPolyline with points:', JSON.stringify(points));
                webViewRef.current.injectJavaScript(`
                    if(window.drawPolyline) {
                        window.drawPolyline(${JSON.stringify(points)}, ${JSON.stringify(visitorLocation.map)});
                    } else {
                        window.cachedPolyline = { points: ${JSON.stringify(points)}, mapMeta: ${JSON.stringify(visitorLocation.map)} };
                    }
                    void(0);
                `);
            }
        }
    }, [visitorLocation, visitorAssignedCabinet]);

    return (
        <SafeAreaView edges={['bottom', 'top']} style={styles.container}>
            {/* Header section with brand indicator */}
            <View style={styles.header}>
                <View style={styles.redIndicator} />
                <View style={styles.logoContainer}>
                    <Image source={ImageSource.Logo} style={styles.logo} />
                    <View style={styles.titleWrapper}>
                        <Text style={styles.logoTitle} varient="bold">
                            {cabinetDetails?.companyName || "AVOCADO"}
                        </Text>
                        <Text style={styles.logoSubtitle}>
                            {cabinetDetails?.cabinetName || "From seed to screen"}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Main datacenter map canvas */}
            <View style={styles.mapContainer}>
                <WebViewComponent
                    ref={webViewRef}
                    originWhitelist={['*']}
                    source={{ html: HTML_3D_RENDERER }}
                    style={{ flex: 1 }}
                    onLoadEnd={handleWebViewLoadEnd}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                />
                
                {loadingModel && (
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255,255,255,0.8)'
                    }}>
                        <ActivityIndicator size="large" color="#E2231A" />
                        <Text style={{ marginTop: 10, color: '#87848A' }}>Preparing 3D Assets...</Text>
                    </View>
                )}

                {/* Zoom controls HUD overlay */}
                <View style={styles.zoomHUD}>
                    <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
                        <Text style={styles.zoomText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
                        <Text style={styles.zoomText}>−</Text>
                    </TouchableOpacity>
                </View>

                {/* HUD Floor level selector overlay */}
                <View style={styles.floorSelectorContainer}>
                    {['F2', 'F1'].map((floor) => (
                        <TouchableOpacity
                            key={floor}
                            style={[
                                styles.floorButton,
                                selectedFloor === floor && styles.floorButtonActive,
                            ]}
                            onPress={() => handleSelectFloor(floor)}
                        >
                            <Text
                                style={[
                                    styles.floorText,
                                    selectedFloor === floor && styles.floorTextActive,
                                ]}
                            >
                                {floor}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Bottom action buttons */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.btnBack} onPress={handleBack}>
                    <Text style={styles.btnBackText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnAction} onPress={handleGetIntoPhone}>
                    <Text style={styles.btnActionText}>Get into my phone</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default NavigationScreen;
