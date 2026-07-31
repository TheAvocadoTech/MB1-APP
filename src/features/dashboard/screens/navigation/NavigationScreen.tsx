import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../store/store';
import { getVisitorLocation } from '../../../../store/slices/cabinetSlice';
import { getNavigationRoute, getMapDetails } from '../../../../services/ApiUtility';

import { default as Text } from '../../../../components/Text/MSText';
import { ImageSource } from '../../../../constants/assets/images';
import { MAP_BASE64_DATA } from '../../../../constants/assets/images/mapBase64Data';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './NavigationScreen.styles';
import { APP_FLAVOR } from '../../../../config/flavor';
import { MB1_MAP_BASE64 } from '../../../../constants/assets/images/mb1MapBase64Data';

/*
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

        // Tap a visible model surface to obtain its GLB-local coordinate. This
        // is used to calibrate API map nodes to the 3D model accurately.
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        let pointerDown = null;

        function sendToNative(payload) {
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify(payload));
            }
        }

        renderer.domElement.addEventListener('pointerdown', function(event) {
            pointerDown = { x: event.clientX, y: event.clientY };
        });

        renderer.domElement.addEventListener('pointerup', function(event) {
            if (!currentModel || !pointerDown) return;
            const movement = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
            pointerDown = null;
            if (movement > 8) return; // OrbitControls drag, not a coordinate pick.

            const rect = renderer.domElement.getBoundingClientRect();
            pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
            const hit = raycaster.intersectObject(currentModel, true)[0];
            if (!hit) return;

            const localPoint = currentModel.worldToLocal(hit.point.clone());
            sendToNative({
                type: 'MODEL_COORDINATE',
                x: localPoint.x,
                y: localPoint.y,
                z: localPoint.z,
                meshName: hit.object.name || 'Unnamed mesh',
            });
        });

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(20, 40, 20);
        scene.add(dirLight);

        // Grid helper
        // const gridHelper = new THREE.GridHelper(50, 50, 0xE2D6DA, 0xEDEDED);
        // scene.add(gridHelper);

        let currentModel = null;
        let modelShift = new THREE.Vector3(0, 0, 0);
        let modelBounds = null;
        let baseModelPosition = null;
        let baseModelScale = null;
        let fittedMapId = null;
        window.cachedPolyline = null;
        window.cachedNavigationNodes = null;
        window.navigationNodeObjects = [];

        function disposeSceneObject(object) {
            object.traverse(function(child) {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (child.material.map) child.material.map.dispose();
                    child.material.dispose();
                }
            });
        }

        window.clearNavigationNodes = function() {
            window.navigationNodeObjects.forEach(function(object) {
                scene.remove(object);
                disposeSceneObject(object);
            });
            window.navigationNodeObjects = [];
        };

        window.loadModel = function(base64Data, cabinetName) {
            const loadingEl = document.getElementById('loading');
            if (loadingEl) loadingEl.style.display = 'none';
            
            // Clean up previous model to prevent overlapping models and memory leaks
            if (currentModel) {
                window.clearNavigationNodes();
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
                modelBounds = null;
                baseModelPosition = null;
                baseModelScale = null;
                fittedMapId = null;
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
                currentModel.updateMatrixWorld(true);
                modelBounds = new THREE.Box3().setFromObject(currentModel);
                baseModelPosition = currentModel.position.clone();
                baseModelScale = currentModel.scale.clone();
                
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
                if (window.cachedNavigationNodes) {
                    const c = window.cachedNavigationNodes;
                    window.drawNavigationNodes(c.nodes, c.routeNodeNames, c.mapMeta);
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
            const ppm = Number(mapMeta.ppm);
            const originX = Number(mapMeta.origin_x);
            const originY = Number(mapMeta.origin_y);

            if (!Number.isFinite(pixelX) || !Number.isFinite(pixelY) ||
                !Number.isFinite(ppm) || ppm <= 0 ||
                !Number.isFinite(originX) || !Number.isFinite(originY)) {
                return null;
            }
            
            const worldX = (pixelX - originX) / ppm;
            const worldZ = (originY - pixelY) / ppm;
            
            return { x: worldX, z: worldZ };
        };

        window.convertPixelToModel = function(pixelX, pixelY, mapMeta) {
            const world = window.convertPixelToWorld(pixelX, pixelY, mapMeta);
            return world
                ? {
                    x: world.x,
                    // Draw on a dedicated layer above the tallest GLB mesh.
                    // This guarantees the route is never buried below a floor
                    // slab after the model has been calibrated to map bounds.
                    y: modelBounds ? modelBounds.max.y + 1.25 : 0.8 + modelShift.y,
                    z: world.z,
                }
                : null;
        };

        window.fitModelToMap = function(mapMeta) {
            if (!currentModel || !baseModelPosition || !baseModelScale) return false;

            const mapWidth = Number(mapMeta.width);
            const mapHeight = Number(mapMeta.height);
            const mapId = String(mapMeta.id || mapMeta.name || 'active-map');
            const mapBottomLeft = window.convertPixelToWorld(0, mapHeight, mapMeta);
            const mapTopRight = window.convertPixelToWorld(mapWidth, 0, mapMeta);

            if (!mapBottomLeft || !mapTopRight || !Number.isFinite(mapWidth) || mapWidth <= 0 ||
                !Number.isFinite(mapHeight) || mapHeight <= 0) return false;
            if (fittedMapId === mapId) return true;

            // Reset first: a floor can be re-used for a different API map.
            currentModel.position.copy(baseModelPosition);
            currentModel.scale.copy(baseModelScale);
            currentModel.updateMatrixWorld(true);

            const sourceBounds = new THREE.Box3().setFromObject(currentModel);
            const sourceSize = sourceBounds.getSize(new THREE.Vector3());
            const targetWidth = mapTopRight.x - mapBottomLeft.x;
            const targetDepth = mapTopRight.z - mapBottomLeft.z;

            if (sourceSize.x <= 0 || sourceSize.z <= 0 || targetWidth <= 0 || targetDepth <= 0) return false;

            // Scale and translate the GLB to the same meter coordinate system
            // returned by the API. The route can then use API node positions
            // directly, without stretching or re-shaping the polyline.
            currentModel.scale.set(
                baseModelScale.x * (targetWidth / sourceSize.x),
                baseModelScale.y,
                baseModelScale.z * (targetDepth / sourceSize.z),
            );
            currentModel.updateMatrixWorld(true);

            const scaledBounds = new THREE.Box3().setFromObject(currentModel);
            currentModel.position.x += mapBottomLeft.x - scaledBounds.min.x;
            currentModel.position.z += mapBottomLeft.z - scaledBounds.min.z;
            currentModel.updateMatrixWorld(true);
            modelBounds = new THREE.Box3().setFromObject(currentModel);
            fittedMapId = mapId;
            return true;
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

            if (!points || points.length < 2 || !mapMeta || !currentModel) return;
            if (!window.fitModelToMap(mapMeta)) return;

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
            const convertedPoints = points
                .map(pt => {
                    const modelPoint = window.convertPixelToModel(Number(pt.x), Number(pt.y), mapMeta);
                    return modelPoint
                        ? new THREE.Vector3(modelPoint.x, modelPoint.y, modelPoint.z)
                        : null;
                })
                .filter(Boolean);

            if (convertedPoints.length < 2) return;

            for (let i = 0; i < convertedPoints.length - 1; i++) {
                const startPoint = convertedPoints[i];
                const endPoint = convertedPoints[i+1];
                
                const curve = new SegmentCurve(startPoint, endPoint);
                // Keep the path above the floor and draw it last so the GLB's
                // floor/ceiling meshes cannot hide it from the camera.
                const glowGeometry = new THREE.TubeGeometry(curve, 16, 0.48, 8, false);
                const glowMaterial = new THREE.MeshBasicMaterial({
                    color: 0x006DFF,
                    transparent: true,
                    opacity: 0.28,
                    depthTest: false,
                    depthWrite: false,
                });
                const pathGeometry = new THREE.TubeGeometry(curve, 16, 0.25, 8, false);
                const pathMaterial = new THREE.MeshBasicMaterial({
                    color: 0x006DFF,
                    transparent: true,
                    opacity: 1,
                    depthTest: false,
                    depthWrite: false,
                });

                const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
                const pathMesh = new THREE.Mesh(pathGeometry, pathMaterial);
                glowMesh.renderOrder = 999;
                pathMesh.renderOrder = 1000;
                glowMesh.frustumCulled = false;
                pathMesh.frustumCulled = false;
                scene.add(glowMesh, pathMesh);
                window.currentPathLines.push(glowMesh, pathMesh);
            }

            // Visible start/end anchors also make a very short route (such as
            // the supplied 119 px "Close" route) easy to spot on the model.
            [convertedPoints[0], convertedPoints[convertedPoints.length - 1]].forEach((point, index) => {
                const marker = new THREE.Mesh(
                    new THREE.SphereGeometry(index === 0 ? 0.75 : 0.95, 16, 16),
                    new THREE.MeshBasicMaterial({
                        color: 0x006DFF,
                        depthTest: false,
                        depthWrite: false,
                    }),
                );
                marker.position.copy(point);
                marker.renderOrder = 1001;
                marker.frustumCulled = false;
                scene.add(marker);
                window.currentPathLines.push(marker);
            });

            // Center the 3D camera on the route. This makes a valid route
            // immediately visible even when the model has been panned to a
            // cabinet or the route lies near the edge of the floor plan.
            const routeBounds = new THREE.Box3().setFromPoints(convertedPoints);
            const routeCenter = routeBounds.getCenter(new THREE.Vector3());
            const routeSize = routeBounds.getSize(new THREE.Vector3());
            const routeSpan = Math.max(routeSize.x, routeSize.z, 12);
            targetLookAt.copy(routeCenter);
            targetCameraPos.set(
                routeCenter.x,
                routeCenter.y + routeSpan * 1.2,
                routeCenter.z + routeSpan * 1.5,
            );
            isAnimating = true;
        };

        function createNodeLabel(name) {
            const canvas = document.createElement('canvas');
            canvas.width = 160;
            canvas.height = 48;
            const context = canvas.getContext('2d');
            context.fillStyle = 'rgba(0, 24, 58, 0.88)';
            context.fillRect(0, 0, 160, 48);
            context.fillStyle = '#FFFFFF';
            context.font = 'bold 26px sans-serif';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(name, 80, 25);

            const texture = new THREE.CanvasTexture(canvas);
            const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
                map: texture,
                depthTest: false,
                depthWrite: false,
            }));
            sprite.scale.set(3.5, 1.05, 1);
            sprite.renderOrder = 1002;
            return sprite;
        }

        window.drawNavigationNodes = function(nodes, routeNodeNames, mapMeta) {
            window.cachedNavigationNodes = { nodes, routeNodeNames, mapMeta };
            window.clearNavigationNodes();

            if (!currentModel || !Array.isArray(nodes) || !mapMeta || !window.fitModelToMap(mapMeta)) return;

            const activeRouteNodes = new Set(routeNodeNames || []);
            nodes.forEach(function(node) {
                const position = node && node.position;
                const modelPoint = position && window.convertPixelToModel(Number(position.x), Number(position.y), mapMeta);
                if (!modelPoint) return;

                const isOnRoute = activeRouteNodes.has(node.name);
                const marker = new THREE.Mesh(
                    new THREE.SphereGeometry(isOnRoute ? 0.55 : 0.38, 16, 16),
                    new THREE.MeshBasicMaterial({
                        color: isOnRoute ? 0x006DFF : 0xFFB000,
                        depthTest: false,
                        depthWrite: false,
                    }),
                );
                marker.position.set(modelPoint.x, modelPoint.y + 0.2, modelPoint.z);
                marker.renderOrder = 1001;
                marker.frustumCulled = false;

                const label = createNodeLabel(node.name || 'Node');
                label.position.set(modelPoint.x, modelPoint.y + 1.45, modelPoint.z);
                label.frustumCulled = false;

                scene.add(marker, label);
                window.navigationNodeObjects.push(marker, label);
            });
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
*/



const MB1_HTML_PDF_RENDERER = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
    <style>
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: #f1f5f9; }
        #viewport { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }
        /* Keep the canvas in its natural horizontal orientation */
        canvas { max-width: 100%; max-height: 100%; }
        #loading { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: sans-serif; font-size: 16px; color: #87848A; text-align: center; }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
</head>
<body>
    <div id="loading">Loading PDF Map...</div>
    <div id="viewport">
        <canvas id="pdf-canvas"></canvas>
    </div>
    <script>
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        
        window.loadModel = function(payload) {
            if (!payload || !payload.modelBase64) return;
            const url = payload.modelBase64;
            
            let pdfParams = url;
            if (url.startsWith('data:application/pdf;base64,')) {
                const base64 = url.split(',')[1];
                const raw = window.atob(base64);
                const rawLength = raw.length;
                const array = new Uint8Array(new ArrayBuffer(rawLength));
                for(let i = 0; i < rawLength; i++) {
                    array[i] = raw.charCodeAt(i);
                }
                pdfParams = { data: array };
            }

            const loadingTask = pdfjsLib.getDocument(pdfParams);
            loadingTask.promise.then(function(pdf) {
                document.getElementById('loading').style.display = 'none';
                pdf.getPage(1).then(function(page) {
                    const viewport = page.getViewport({scale: 2.0});
                    const canvas = document.getElementById('pdf-canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    page.render(renderContext);
                });
            }).catch(function(error) {
                document.getElementById('loading').innerText = 'Error loading PDF:\\n' + error.message;
            });
        };

        window.updateLocation = function(payload) {
            // No-op for MB1 since polylines are pre-drawn in PDF
        };
    </script>
</body>
</html>
`;

const HTML_2D_RENDERER = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
    <style>
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: #FFFFFF; }
        #viewport { width: 100%; height: 100%; position: relative; cursor: grab; }
        svg { position: absolute; top: 0; left: 0; transform-origin: 0 0; will-change: transform; }
        #loading { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: sans-serif; font-size: 16px; color: #87848A; }
        @keyframes path-dash { to { stroke-dashoffset: -40; } }
        .path-animated { stroke-dasharray: 8 6; animation: path-dash 1.5s linear infinite; }
        @keyframes ble-beacon-pulse { 0% { r: 12px; opacity: 0.8; } 100% { r: 34px; opacity: 0; } }
        .ble-pulse-aura { animation: ble-beacon-pulse 2s cubic-bezier(0, 0.2, 0.8, 1) infinite; }
    </style>
</head>
<body>
    <div id="loading">Loading 2D Map...</div>
    <div id="viewport">
        <svg id="map-svg" viewBox="0 0 600 900" width="600" height="900">
            <defs>
                <marker id="routeArrow" markerWidth="3" markerHeight="3" refX="2" refY="1.5" orient="auto">
                    <path d="M 0 0 L 3 1.5 L 0 3 z" fill="#0085ff" />
                </marker>
                <marker id="proposedRouteArrow" markerWidth="3" markerHeight="3" refX="2" refY="1.5" orient="auto">
                    <path d="M 0 0 L 3 1.5 L 0 3 z" fill="#062835" />
                </marker>
                <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" stroke-width="0.8" opacity="0.4" />
                </pattern>
            </defs>
            <g id="map-rotation-group" transform="translate(0, 900) rotate(-90)">
                <rect width="900" height="600" fill="#f1f5f9" />
                <rect width="900" height="600" fill="url(#gridPattern)" />
                <rect x="35" y="35" width="830" height="530" fill="#ffffff" stroke="#cbd5e1" stroke-width="2.5" rx="18" />
                <g id="image-calibration-group">
                    <image id="map-image" x="35" y="35" width="830" height="530" preserveAspectRatio="none" />
                </g>
                <g id="edges-group"></g>
                <g id="polyline-group"></g>
                <g id="nodes-group"></g>
            </g>
        </svg>
    </div>

    <script>
        (function() {
            const logOriginal = console.log;
            console.log = function() {
                logOriginal.apply(console, arguments);
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'LOG',
                        message: Array.from(arguments).map(x => typeof x === 'object' ? JSON.stringify(x) : x).join(' ')
                    }));
                }
            };
            const errorOriginal = console.error;
            console.error = function() {
                errorOriginal.apply(console, arguments);
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'ERROR',
                        message: Array.from(arguments).map(x => typeof x === 'object' ? JSON.stringify(x) : x).join(' ')
                    }));
                }
            };
        })();

        const svg = document.getElementById('map-svg');
        const viewport = document.getElementById('viewport');
        const mapImage = document.getElementById('map-image');
        const loading = document.getElementById('loading');

        let scale = 3.2;
        let pointX = -320;
        let pointY = 0;
        let start = { x: 0, y: 0 };
        let isPanning = false;

        const SVG_WIDTH = 900;
        const SVG_HEIGHT = 600;

        const FLOORPLAN_CALIBRATION = {
            GR: { rotation: 0, scale: 0.9, offsetX: -15, offsetY: 0 },
            F1: { rotation: 0, scale: 0.9, offsetX: -12, offsetY: 0 }
        };

        const LIFT_COORDINATES = { x: 5220.46912942509, y: 1681.3904907165097 };
        const F1_LIFT_COORDINATES = { x: 5720.46912942509, y: 1681.3904907165097 };
        const CABINET_COORDINATES = { x: 5620.3, y: 2200.84 };
        const TEMP_DOT_COORDINATES = { x: 5480.0, y: 2200.84 };
        const GR_PROPOSED_START_COORDINATES = { x: 5700.0, y: 1448.69 };

        function setTransform() {
            svg.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
        }

        function transformCoords(x, y, mapWidth, mapHeight) {
            if (x === undefined || y === undefined || x === null || y === null) {
                return { svgX: SVG_WIDTH / 2, svgY: SVG_HEIGHT / 2 };
            }
            const padding = 50;
            const scaleX = (SVG_WIDTH - padding * 2) / mapWidth;
            const scaleY = (SVG_HEIGHT - padding * 2) / mapHeight;
            const uScale = Math.min(scaleX, scaleY);
            const offsetX = (SVG_WIDTH - mapWidth * uScale) / 2;
            const offsetY = (SVG_HEIGHT - mapHeight * uScale) / 2;
            return { svgX: offsetX + x * uScale, svgY: offsetY + y * uScale };
        }

        function normalizeGraphNodes(rawNodes) {
            if (!rawNodes) return [];
            let list = Array.isArray(rawNodes) ? rawNodes : Object.keys(rawNodes).map(k => Object.assign({ name: rawNodes[k].name || rawNodes[k].id || k }, rawNodes[k]));
            return list.map((item, idx) => {
                const name = item.name || item.id || ("N" + (idx + 1));
                let posX = item.position?.x ?? item.x;
                let posY = item.position?.y ?? item.y;
                return {
                    name,
                    position: (posX !== undefined && !isNaN(posX) && posY !== undefined && !isNaN(posY)) ? { x: Number(posX), y: Number(posY) } : null,
                    edges: item.edges || item.connections || {}
                };
            }).filter(n => n.position !== null);
        }

        function extractWaypoints(rawRoute) {
            if (!rawRoute) return [];
            let list = Array.isArray(rawRoute) ? rawRoute : (rawRoute.nodes || rawRoute.waypoints || rawRoute.path || Object.values(rawRoute));
            if (!Array.isArray(list) && typeof list === 'object') list = Object.values(list);
            return list.map(item => {
                if (!item) return null;
                let posX = Array.isArray(item) ? item[0] : (item.position?.x ?? item.x);
                let posY = Array.isArray(item) ? item[1] : (item.position?.y ?? item.y);
                return (posX !== undefined && !isNaN(posX) && posY !== undefined && !isNaN(posY)) ? { x: Number(posX), y: Number(posY) } : null;
            }).filter(pt => pt !== null);
        }

        window.loadModel = function(payload) {
            if (!payload) return;
            loading.style.display = 'none';
            if (payload.modelBase64) mapImage.setAttribute('href', payload.modelBase64);
            const floor = payload.floor || 'GR';
            const appFlavor = payload.appFlavor || 'MB3';

            const svgEl = document.getElementById('map-svg');
            const rotationGroup = document.getElementById('map-rotation-group');
            if (appFlavor === 'MB1') {
                if (svgEl) {
                    svgEl.setAttribute('viewBox', '0 0 900 600');
                    svgEl.setAttribute('width', '900');
                    svgEl.setAttribute('height', '600');
                }
                if (rotationGroup) {
                    rotationGroup.setAttribute('transform', 'translate(0, 0) rotate(0)');
                }
                scale = 1.0;
                pointX = 0;
                pointY = 0;
            } else {
                if (svgEl) {
                    svgEl.setAttribute('viewBox', '0 0 600 900');
                    svgEl.setAttribute('width', '600');
                    svgEl.setAttribute('height', '900');
                }
                if (rotationGroup) {
                    rotationGroup.setAttribute('transform', 'translate(0, 900) rotate(-90)');
                }
                scale = 3.2;
                pointX = -320;
                pointY = 0;
            }

            const calib = FLOORPLAN_CALIBRATION[floor] || FLOORPLAN_CALIBRATION.GR;
            const imageGroup = document.getElementById('image-calibration-group');
            if (imageGroup) {
                imageGroup.setAttribute('transform', 'translate(' + (SVG_WIDTH / 2 + calib.offsetX) + ', ' + (SVG_HEIGHT / 2 + calib.offsetY) + ') rotate(' + calib.rotation + ') scale(' + calib.scale + ') translate(' + (-SVG_WIDTH / 2) + ', ' + (-SVG_HEIGHT / 2) + ')');
            }
            setTransform();
            renderMapElements(payload);
        };

        window.updateLocation = function(payload) {
            if (!payload) return;
            renderMapElements(payload);
        };

        function renderMapElements(payload) {
            const floor = payload.floor || 'GR';
            const visitorLocation = payload.visitorLocation;
            const mapMeta = visitorLocation?.map || { width: 6400, height: 5120 };
            const mapWidth = mapMeta.width || 6400;
            const mapHeight = mapMeta.height || 5120;
            const activeWayfinding = visitorLocation?.wayfinding;
            const activeRoute = visitorLocation?.wayfinding?.route_to_destination;
            const appFlavor = payload.appFlavor;

            const getSvgCoords = (x, y) => transformCoords(x, y, mapWidth, mapHeight);

            const rawNodes = activeWayfinding?.nodes || mapMeta?.wayfinding_path?.nodes || [];
            const allGraphNodes = normalizeGraphNodes(rawNodes);

            const edgesGroup = document.getElementById('edges-group');
            if (edgesGroup) {
                edgesGroup.innerHTML = '';
                if (appFlavor !== 'MB1') {
                    const nodeMap = new Map();
                    allGraphNodes.forEach(n => { if (n.name && n.position) nodeMap.set(n.name, getSvgCoords(n.position.x, n.position.y)); });
                    const drawn = new Set();
                    allGraphNodes.forEach(n => {
                        const srcPt = nodeMap.get(n.name);
                        if (srcPt && n.edges) {
                            Object.keys(n.edges).forEach(tName => {
                                const tgtPt = nodeMap.get(tName);
                                const edgeKey = [n.name, tName].sort().join("---");
                                if (tgtPt && !drawn.has(edgeKey)) {
                                    drawn.add(edgeKey);
                                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                                    line.setAttribute('x1', srcPt.svgX); line.setAttribute('y1', srcPt.svgY);
                                    line.setAttribute('x2', tgtPt.svgX); line.setAttribute('y2', tgtPt.svgY);
                                    line.setAttribute('stroke', '#cbd5e1'); line.setAttribute('stroke-width', '2');
                                    line.setAttribute('stroke-dasharray', '4 4');
                                    edgesGroup.appendChild(line);
                                }
                            });
                        }
                    });
                }
            }

            const nodesGroup = document.getElementById('nodes-group');
            if (nodesGroup) {
                nodesGroup.innerHTML = '';
                allGraphNodes.forEach((n, idx) => {
                    if (!n.position) return;
                    const pt = getSvgCoords(n.position.x, n.position.y);
                    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    c.setAttribute('cx', pt.svgX); c.setAttribute('cy', pt.svgY); c.setAttribute('r', '4');
                    c.setAttribute('fill', '#334155'); c.setAttribute('stroke', '#ffffff'); c.setAttribute('stroke-width', '1.2');
                    g.appendChild(c);
                    if (n.name) {
                        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                        t.setAttribute('x', pt.svgX); t.setAttribute('y', pt.svgY + 12);
                        t.setAttribute('fill', '#1e293b'); t.setAttribute('font-size', '8px');
                        t.setAttribute('font-weight', '800'); t.setAttribute('text-anchor', 'middle');
                        t.textContent = n.name;
                        g.appendChild(t);
                    }
                    nodesGroup.appendChild(g);
                });
            }

            const polylineGroup = document.getElementById('polyline-group');
            if (polylineGroup) {
                polylineGroup.innerHTML = '';
                const appFlavor = payload.appFlavor || 'MB3';
                const defaultBleLoc = appFlavor === 'MB1' ? { x: 623.59, y: 2055.50 } : { x: 5004.59, y: 2313.4 };
                const bleLoc = visitorLocation?.location || defaultBleLoc;
                const blePos = getSvgCoords(bleLoc.x, bleLoc.y);
                const startPos = floor === "F1" ? getSvgCoords(F1_LIFT_COORDINATES.x, F1_LIFT_COORDINATES.y) : getSvgCoords(bleLoc.x, bleLoc.y);
                const targetCoords = visitorLocation?.target_coordinates;
                const defaultTargetCoords = appFlavor === 'MB1' ? { x: 6141.01, y: 2441.60 } : (floor === "GR" ? LIFT_COORDINATES : CABINET_COORDINATES);
                const destPos = (targetCoords && targetCoords.x !== undefined && targetCoords.y !== undefined)
                    ? getSvgCoords(targetCoords.x, targetCoords.y)
                    : getSvgCoords(defaultTargetCoords.x, defaultTargetCoords.y);

                if (floor === "F1") {
                    const tempPt = getSvgCoords(TEMP_DOT_COORDINATES.x, TEMP_DOT_COORDINATES.y);
                    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    c.setAttribute('cx', tempPt.svgX); c.setAttribute('cy', tempPt.svgY); c.setAttribute('r', '4');
                    c.setAttribute('fill', '#0085ff'); c.setAttribute('stroke', '#ffffff'); c.setAttribute('stroke-width', '1.2');
                    polylineGroup.appendChild(c);
                }

                if (floor === "GR") {
                    const propStart = getSvgCoords(GR_PROPOSED_START_COORDINATES.x, GR_PROPOSED_START_COORDINATES.y);
                    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    const aura = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    aura.setAttribute('cx', propStart.svgX); aura.setAttribute('cy', propStart.svgY); aura.setAttribute('r', '6');
                    aura.setAttribute('fill', '#38bdf8'); aura.setAttribute('opacity', '0.4'); g.appendChild(aura);
                    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    dot.setAttribute('cx', propStart.svgX); dot.setAttribute('cy', propStart.svgY); dot.setAttribute('r', '4');
                    dot.setAttribute('fill', '#38bdf8'); dot.setAttribute('stroke', '#ffffff'); dot.setAttribute('stroke-width', '0.8'); g.appendChild(dot);
                    polylineGroup.appendChild(g);
                }

                const rawWaypoints = activeRoute?.nodes || activeRoute?.path || activeRoute?.waypoints || [];
                const backendWaypoints = extractWaypoints(rawWaypoints);

                if (appFlavor === 'MB1') {
                    // Do nothing for MB1, polyline is pre-drawn in the map image itself.
                } else {
                    const refPts = [];
                    if (floor === "F1") {
                        refPts.push(startPos);
                        const n48 = allGraphNodes.find(n => n.name && (n.name.toUpperCase() === "N48" || n.name === "48"));
                        refPts.push(n48?.position ? getSvgCoords(n48.position.x, n48.position.y) : getSvgCoords(5454.1586, 1711.6878));
                        refPts.push(getSvgCoords(TEMP_DOT_COORDINATES.x, TEMP_DOT_COORDINATES.y));
                        refPts.push(destPos);
                    } else {
                        refPts.push(startPos);
                        backendWaypoints.forEach(pt => refPts.push(getSvgCoords(pt.x, pt.y)));
                        refPts.push(destPos);
                    }

                if (refPts.length >= 2) {
                    const pathD = refPts.reduce((acc, pt, idx) => idx === 0 ? 'M ' + pt.svgX + ' ' + pt.svgY : acc + ' L ' + pt.svgX + ' ' + pt.svgY, '');
                    const pathBg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    pathBg.setAttribute('d', pathD); pathBg.setAttribute('fill', 'none');
                    pathBg.setAttribute('stroke', floor === "F1" ? "rgba(6, 40, 53, 0.25)" : "rgba(0, 133, 255, 0.2)");
                    pathBg.setAttribute('stroke-width', '6'); pathBg.setAttribute('stroke-linecap', 'round'); pathBg.setAttribute('stroke-linejoin', 'round');
                    polylineGroup.appendChild(pathBg);

                    const pathFg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    pathFg.setAttribute('d', pathD); pathFg.setAttribute('fill', 'none');
                    pathFg.setAttribute('stroke', floor === "F1" ? "#062835" : "#0085ff");
                    pathFg.setAttribute('stroke-width', '3'); pathFg.setAttribute('stroke-linecap', 'round'); pathFg.setAttribute('stroke-linejoin', 'round');
                    if (floor === "F1") {
                        pathFg.setAttribute('stroke-dasharray', '6 6'); pathFg.setAttribute('marker-end', 'url(#proposedRouteArrow)');
                    } else {
                        pathFg.setAttribute('marker-end', 'url(#routeArrow)');
                    }
                    polylineGroup.appendChild(pathFg);

                    if (floor === "GR") {
                        const pathCore = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        pathCore.setAttribute('d', pathD); pathCore.setAttribute('fill', 'none');
                        pathCore.setAttribute('stroke', '#ffffff'); pathCore.setAttribute('stroke-width', '1.2');
                        pathCore.setAttribute('stroke-linecap', 'round');
                        pathCore.setAttribute('class', 'path-animated');
                        polylineGroup.appendChild(pathCore);
                    }
                }
                }

                if (appFlavor !== 'MB1' && floor === "GR") {
                    const propPts = [];
                    propPts.push(getSvgCoords(GR_PROPOSED_START_COORDINATES.x, GR_PROPOSED_START_COORDINATES.y));
                    const n9 = allGraphNodes.find(n => n.name && (n.name.toUpperCase() === "N9" || n.name === "9"));
                    propPts.push(n9?.position ? getSvgCoords(n9.position.x, n9.position.y) : getSvgCoords(5854.67, 3646.69));
                    const n13 = allGraphNodes.find(n => n.name && (n.name.toUpperCase() === "N13" || n.name === "13"));
                    propPts.push(n13?.position ? getSvgCoords(n13.position.x, n13.position.y) : getSvgCoords(6362.34, 3470.36));
                    propPts.push(destPos);

                    if (propPts.length >= 2) {
                        const pathD = propPts.reduce((acc, pt, idx) => idx === 0 ? 'M ' + pt.svgX + ' ' + pt.svgY : acc + ' L ' + pt.svgX + ' ' + pt.svgY, '');
                        const pathBg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        pathBg.setAttribute('d', pathD); pathBg.setAttribute('fill', 'none'); pathBg.setAttribute('stroke', 'rgba(56, 189, 248, 0.25)');
                        pathBg.setAttribute('stroke-width', '6'); pathBg.setAttribute('stroke-linecap', 'round'); pathBg.setAttribute('stroke-linejoin', 'round');
                        polylineGroup.appendChild(pathBg);

                        const pathFg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        pathFg.setAttribute('d', pathD); pathFg.setAttribute('fill', 'none'); pathFg.setAttribute('stroke', '#062835');
                        pathFg.setAttribute('stroke-width', '3'); pathFg.setAttribute('stroke-linecap', 'round'); pathFg.setAttribute('stroke-linejoin', 'round');
                        pathFg.setAttribute('stroke-dasharray', '6 6'); pathFg.setAttribute('marker-end', 'url(#proposedRouteArrow)');
                        polylineGroup.appendChild(pathFg);
                    }
                }

                if (appFlavor !== 'MB1' && floor === "F1") {
                    const f1Pts = [];
                    f1Pts.push(blePos);
                    backendWaypoints.forEach(pt => f1Pts.push(getSvgCoords(pt.x, pt.y)));
                    f1Pts.push(destPos);

                    if (f1Pts.length >= 2) {
                        const pathD = f1Pts.reduce((acc, pt, idx) => idx === 0 ? 'M ' + pt.svgX + ' ' + pt.svgY : acc + ' L ' + pt.svgX + ' ' + pt.svgY, '');
                        const pathBg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        pathBg.setAttribute('d', pathD); pathBg.setAttribute('fill', 'none'); pathBg.setAttribute('stroke', 'rgba(0, 133, 255, 0.2)');
                        pathBg.setAttribute('stroke-width', '6'); pathBg.setAttribute('stroke-linecap', 'round'); pathBg.setAttribute('stroke-linejoin', 'round');
                        polylineGroup.appendChild(pathBg);

                        const pathFg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        pathFg.setAttribute('d', pathD); pathFg.setAttribute('fill', 'none'); pathFg.setAttribute('stroke', '#0085ff');
                        pathFg.setAttribute('stroke-width', '3'); pathFg.setAttribute('stroke-linecap', 'round'); pathFg.setAttribute('stroke-linejoin', 'round');
                        pathFg.setAttribute('marker-end', 'url(#routeArrow)');
                        polylineGroup.appendChild(pathFg);

                        const pathCore = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        pathCore.setAttribute('d', pathD); pathCore.setAttribute('fill', 'none');
                        pathCore.setAttribute('stroke', '#ffffff'); pathCore.setAttribute('stroke-width', '1.2');
                        pathCore.setAttribute('stroke-linecap', 'round');
                        pathCore.setAttribute('class', 'path-animated');
                        polylineGroup.appendChild(pathCore);
                    }
                }

                if (blePos) {
                    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    const aura = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    aura.setAttribute('cx', blePos.svgX); aura.setAttribute('cy', blePos.svgY);
                    aura.setAttribute('r', '6');
                    aura.setAttribute('fill', '#0085ff');
                    aura.setAttribute('opacity', '0.8');
                    aura.setAttribute('class', 'ble-pulse-aura');
                    g.appendChild(aura);
                    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    dot.setAttribute('cx', blePos.svgX); dot.setAttribute('cy', blePos.svgY); dot.setAttribute('r', '4');
                    dot.setAttribute('fill', '#0085ff'); dot.setAttribute('stroke', '#ffffff'); dot.setAttribute('stroke-width', '0.5'); g.appendChild(dot);
                    const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    center.setAttribute('cx', blePos.svgX); center.setAttribute('cy', blePos.svgY); center.setAttribute('r', '1');
                    center.setAttribute('fill', '#ffffff'); g.appendChild(center);
                    polylineGroup.appendChild(g);
                }

                if (destPos) {
                    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    g.setAttribute('transform', 'translate(' + destPos.svgX + ',' + destPos.svgY + ')');
                    const aura = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    aura.setAttribute('r', '8'); aura.setAttribute('fill', floor === "GR" ? '#9333ea' : '#ea580c'); aura.setAttribute('opacity', '0.3'); g.appendChild(aura);
                    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    dot.setAttribute('r', '5'); dot.setAttribute('fill', floor === "GR" ? '#9333ea' : '#ea580c'); dot.setAttribute('stroke', '#ffffff'); dot.setAttribute('stroke-width', '0.5'); g.appendChild(dot);

                    if (floor === "GR") {
                        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                        t.setAttribute('x', '0'); t.setAttribute('y', '2.5'); t.setAttribute('fill', '#ffffff'); t.setAttribute('font-size', '7.5px'); t.setAttribute('text-anchor', 'middle');
                        t.textContent = '🛗'; g.appendChild(t);
                    } else {
                        if (startPos) {
                            const lg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                            lg.setAttribute('transform', 'translate(' + startPos.svgX + ',' + startPos.svgY + ')');
                            const laura = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                            laura.setAttribute('r', '8'); laura.setAttribute('fill', '#9333ea'); laura.setAttribute('opacity', '0.25'); lg.appendChild(laura);
                            const ldot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                            ldot.setAttribute('r', '5'); ldot.setAttribute('fill', '#9333ea'); ldot.setAttribute('stroke', '#ffffff'); ldot.setAttribute('stroke-width', '0.5'); lg.appendChild(ldot);
                            const lt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                            lt.setAttribute('x', '0'); lt.setAttribute('y', '2.5'); lt.setAttribute('fill', '#ffffff'); lt.setAttribute('font-size', '7.5px'); lt.setAttribute('text-anchor', 'middle');
                            lt.textContent = '🛗'; lg.appendChild(lt);
                            polylineGroup.appendChild(lg);
                        }
                        const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        center.setAttribute('r', '2'); center.setAttribute('fill', '#ffffff'); g.appendChild(center);
                    }
                    polylineGroup.appendChild(g);
                }
            }
        }

        viewport.addEventListener('mousedown', (e) => {
            e.preventDefault();
            start = { x: e.clientX - pointX, y: e.clientY - pointY };
            isPanning = true;
            viewport.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isPanning) return;
            pointX = e.clientX - start.x;
            pointY = e.clientY - start.y;
            setTransform();
        });

        window.addEventListener('mouseup', () => {
            isPanning = false;
            viewport.style.cursor = 'grab';
        });

        let touchStartDist = 0;
        let touchStartScale = 1;

        viewport.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isPanning = true;
                const touch = e.touches[0];
                start = { x: touch.clientX - pointX, y: touch.clientY - pointY };
            } else if (e.touches.length === 2) {
                isPanning = false;
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                touchStartDist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
                touchStartScale = scale;
            }
        });

        viewport.addEventListener('touchmove', (e) => {
            if (isPanning && e.touches.length === 1) {
                const touch = e.touches[0];
                pointX = touch.clientX - start.x;
                pointY = touch.clientY - start.y;
                setTransform();
            } else if (e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
                const midX = (touch1.clientX + touch2.clientX) / 2;
                const midY = (touch1.clientY + touch2.clientY) / 2;
                const svgX = (midX - pointX) / scale;
                const svgY = (midY - pointY) / scale;
                const factor = dist / touchStartDist;
                scale = Math.max(0.7, Math.min(5.0, touchStartScale * factor));
                pointX = midX - svgX * scale;
                pointY = midY - svgY * scale;
                setTransform();
            }
        });

        viewport.addEventListener('touchend', () => { isPanning = false; });

        viewport.addEventListener('wheel', (e) => {
            e.preventDefault();
            const xs = (e.clientX - pointX) / scale;
            const ys = (e.clientY - pointY) / scale;
            const delta = -e.deltaY;
            const zoomFactor = delta > 0 ? 1.1 : 1 / 1.1;
            scale = Math.max(0.7, Math.min(5.0, scale * zoomFactor));
            pointX = e.clientX - xs * scale;
            pointY = e.clientY - ys * scale;
            setTransform();
        });

        window.zoomIn = function() {
            const viewWidth = viewport.clientWidth;
            const viewHeight = viewport.clientHeight;
            const centerX = viewWidth / 2;
            const centerY = viewHeight / 2;
            const xs = (centerX - pointX) / scale;
            const ys = (centerY - pointY) / scale;
            scale = Math.min(5.0, scale + 0.35);
            pointX = centerX - xs * scale;
            pointY = centerY - ys * scale;
            setTransform();
        };

        window.zoomOut = function() {
            const viewWidth = viewport.clientWidth;
            const viewHeight = viewport.clientHeight;
            const centerX = viewWidth / 2;
            const centerY = viewHeight / 2;
            const xs = (centerX - pointX) / scale;
            const ys = (centerY - pointY) / scale;
            scale = Math.max(0.7, scale - 0.35);
            pointX = centerX - xs * scale;
            pointY = centerY - ys * scale;
            setTransform();
        };

        if (window.cachedPayload) {
            window.loadModel(window.cachedPayload);
        }
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

type MapPoint = { x: number; y: number };
type ModelCoordinate = { x: number; y: number; z: number; meshName: string };

const toMapPoint = (value: any): MapPoint | null => {
    const x = Number(value?.x);
    const y = Number(value?.y);

    return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
};

/**
 * The location API supplies the route as map pixels. Keep the order returned by
 * `route_to_destination.nodes`: it is already the shortest path from source to
 * destination. The renderer converts these pixels to the GLB's world space.
 */
const buildRoutePoints = (visitorLocation: any, visitorAssignedCabinet: any): MapPoint[] => {
    const candidates = [
        visitorLocation?.location,
        ...(visitorLocation?.wayfinding?.route_to_destination?.nodes ?? []).map((node: any) => node?.position),
        visitorLocation?.target_coordinates ?? visitorAssignedCabinet?.cabinet,
    ];

    return candidates.reduce<MapPoint[]>((points, candidate) => {
        const point = toMapPoint(candidate);
        const previous = points[points.length - 1];

        // The nearest node can match the current location. Avoid rendering a
        // zero-length tube for that common case.
        if (point && (!previous || previous.x !== point.x || previous.y !== point.y)) {
            points.push(point);
        }
        return points;
    }, []);
};

const LIFT_COORDINATES = { x: 5220.46912942509, y: 1681.3904907165097 };
const F1_LIFT_COORDINATES = { x: 5720.46912942509, y: 1681.3904907165097 };
const CABINET_COORDINATES = { x: 5620.3, y: 2200.84 };
const FLOOR_MAP_IDS = {
    GR: "30141417-44ea-4982-993c-6225c9f08315",
    F1: "cfa55e13-794f-4081-b1b7-e35f1ea67325"
};

const STATIC_MB1_VISITOR_LOCATION = {
    visitor: {
        id: "static-mb1",
        name: "Nirav patel",
        phone: "1234567890",
        email: "nirav@avocadotech.in",
        company: "Equinix",
        idNumber: "Tag1",
        purpose: "Meeting",
        checkedIn: true,
        checkedInAt: null,
        qrExpiresAt: "2026-07-28T08:33:58.062Z"
    },
    location: {
        x: 623.59,
        y: 2055.50,
        name: "Tag1",
        mac: "ea2671f0003d",
        map_id: "mb1-map",
        ap_mac: "c878678a984c",
        last_seen: 1785175442.0751295,
        rssi: -59,
        beam: 1,
        stability: 1,
        is_stable: true
    },
    target_coordinates: {
        x: 6141.01,
        y: 2441.60
    }
};

const NavigationScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute<RouteProp<RouteParams, 'NavigationScreen'>>();
    const cabinetName = route.params?.cabinetName || 'GR CL1 R1 0021';
    const dispatch = useDispatch<any>();

    // Fetch cabinet data from Redux
    const { cabinetDetails, visitorAssignedCabinet, visitorLocation } = useSelector((state: RootState) => state.cabinet);

    // Resolve activeVisitorLocation incorporating MB1 static defaults if null
    const activeVisitorLocation = visitorLocation || (APP_FLAVOR === 'MB1' ? STATIC_MB1_VISITOR_LOCATION : null);

    const { colors } = useTheme();
    const styles = useStyles(colors);

    const [selectedFloor, setSelectedFloor] = useState<string>(APP_FLAVOR === 'MB1' ? 'GR' : 'F1');
    const [modelBase64, setModelBase64] = useState<string | null>(null);
    const [loadingModel, setLoadingModel] = useState<boolean>(true);
    const [pickedModelCoordinate, setPickedModelCoordinate] = useState<ModelCoordinate | null>(null);
    const webViewRef = React.useRef<any>(null);
    const [mergedVisitorLocation, setMergedVisitorLocation] = useState<any>(null);

    // MB3-F00 is the ground-floor map and must use GRFloor.glb. Rendering its
    // route over the first-floor model puts otherwise-correct coordinates in
    // the wrong physical layout.
    useEffect(() => {
        if (APP_FLAVOR === 'MB1') {
            setSelectedFloor('GR');
            return;
        }
        const mapName = activeVisitorLocation?.map?.name?.toUpperCase();

        if (mapName?.includes('F00') || mapName?.includes('GROUND')) {
            setSelectedFloor('GR');
        } else if (mapName?.includes('F01') || mapName?.includes('F02')) {
            setSelectedFloor('F1');
        }
    }, [activeVisitorLocation?.map?.name]);

    // Fetch live location and update every 3 seconds using setInterval
    useEffect(() => {
        const visitorId = activeVisitorLocation?.visitor?.id || activeVisitorLocation?.id;
        if (!visitorId) return;

        const pollLocation = () => {
            console.log('setInterval: Polling visitor location for visitorId:', visitorId);
            dispatch(getVisitorLocation(visitorId));
        };

        pollLocation();

        const interval = setInterval(pollLocation, 3000);
        return () => clearInterval(interval);
    }, [dispatch, activeVisitorLocation?.visitor?.id || activeVisitorLocation?.id]);

    // Watch visitorLocation and selectedFloor, calculate path route dynamically, and merge
    useEffect(() => {
        if (!activeVisitorLocation) {
            setMergedVisitorLocation(null);
            return;
        }

        let isMounted = true;

        const fetchRoute = async () => {
            if (APP_FLAVOR === 'MB1') {
                const staticMb1Route = {
                    waypoints: [
                        { x: 623.59, y: 2055.50 },
                        { x: 848.39, y: 1976.96 },
                        { x: 1435.56, y: 2281.80 },
                        { x: 1850.32, y: 2282.07 },
                        { x: 2226.33, y: 2322.02 },
                        { x: 2967.84, y: 2304.06 },
                        { x: 2895.46, y: 2003.78 },
                        { x: 3368.87, y: 2003.78 },
                        { x: 3776.17, y: 2004.05 },
                        { x: 4204.96, y: 2023.12 },
                        { x: 4137.54, y: 2388.88 },
                        { x: 4610.24, y: 2268.12 },
                        { x: 4929.21, y: 2245.31 },
                        { x: 6141.01, y: 2441.60 }
                    ]
                };
                
                if (isMounted) {
                    const merged = {
                        ...activeVisitorLocation,
                        wayfinding: {
                            ...(activeVisitorLocation?.wayfinding || {}),
                            route_to_destination: staticMb1Route
                        }
                    };
                    setMergedVisitorLocation(merged);
                }
                return;
            }

            const floor = selectedFloor;
            const bleX = activeVisitorLocation?.location?.x;
            const bleY = activeVisitorLocation?.location?.y;
            const targetCoords = activeVisitorLocation?.target_coordinates;

            if (bleX === undefined || bleY === undefined) {
                if (isMounted) setMergedVisitorLocation(activeVisitorLocation);
                return;
            }

            const mapId = floor === 'GR' ? FLOOR_MAP_IDS.GR : FLOOR_MAP_IDS.F1;
            const fromX = bleX;
            const fromY = bleY;
            
            const toX = (targetCoords && targetCoords.x !== undefined && targetCoords.y !== undefined)
                ? targetCoords.x
                : (floor === 'GR' ? LIFT_COORDINATES.x : CABINET_COORDINATES.x);
            
            const toY = (targetCoords && targetCoords.x !== undefined && targetCoords.y !== undefined)
                ? targetCoords.y
                : (floor === 'GR' ? LIFT_COORDINATES.y : CABINET_COORDINATES.y);

            console.log(`Calculating navigation route via API: mapId=${mapId}, from=(${fromX},${fromY}), to=(${toX},${toY})`);
            const routeRes = await getNavigationRoute(mapId, fromX, fromY, toX, toY);
            
            const routePayload = routeRes?.data?.route || routeRes?.route || routeRes?.data || routeRes;
            
            if (isMounted) {
                const merged = {
                    ...activeVisitorLocation,
                    wayfinding: {
                        ...(activeVisitorLocation?.wayfinding || {}),
                        route_to_destination: routePayload
                    }
                };
                setMergedVisitorLocation(merged);
            }
        };

        fetchRoute();

        return () => {
            isMounted = false;
        };
    }, [activeVisitorLocation, selectedFloor]);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleGetIntoPhone = () => {
        navigation.navigate('cameraScanner', { fromNavigation: true });
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

    const handleWebViewMessage = (event: any) => {
        try {
            const message = JSON.parse(event.nativeEvent.data);
            if (message?.type === 'MODEL_COORDINATE') {
                setPickedModelCoordinate({
                    x: Number(message.x),
                    y: Number(message.y),
                    z: Number(message.z),
                    meshName: String(message.meshName || 'Unnamed mesh'),
                });
            } else if (message?.type === 'LOG') {
                console.log('[WebView Log]', message.message);
            } else if (message?.type === 'ERROR') {
                console.error('[WebView Error]', message.message);
            }
        } catch {
            // Ignore non-JSON WebView messages.
        }
    };

    const handleSelectFloor = (floor: string) => {
        setSelectedFloor(floor);
        if (webViewRef.current) {
            webViewRef.current.injectJavaScript(`window.selectFloor("${floor}"); void(0);`);
        }
    };

    // Load 2D Map image file as base64 when selectedFloor changes
    useEffect(() => {
        setLoadingModel(true);
        let base64data = selectedFloor === 'GR' ? MAP_BASE64_DATA.GR : MAP_BASE64_DATA.F1;
        if (APP_FLAVOR === 'MB1') {
            base64data = MB1_MAP_BASE64;
        }
        setModelBase64(base64data);
        setLoadingModel(false);
    }, [selectedFloor]);

    const handleWebViewLoadEnd = () => {
        if (modelBase64 && webViewRef.current) {
            console.log('WebView loaded, injecting initial 2D map and route payload...');
            
            const activeLoc = mergedVisitorLocation || activeVisitorLocation;
            const payload = JSON.stringify({
                modelBase64,
                cabinetName,
                floor: selectedFloor,
                visitorLocation: activeLoc,
                appFlavor: APP_FLAVOR
            });

            webViewRef.current.injectJavaScript(`
                window.loadModel(${payload});
                void(0);
            `);
        }
    };

    // Load or reload the floor plan background image when modelBase64 or floor changes
    useEffect(() => {
        if (modelBase64 && webViewRef.current) {
            console.log('Floor or model image changed, injecting loadModel payload...');
            const activeLoc = mergedVisitorLocation || activeVisitorLocation;
            const payload = JSON.stringify({
                modelBase64,
                cabinetName,
                floor: selectedFloor,
                visitorLocation: activeLoc,
                appFlavor: APP_FLAVOR
            });
            webViewRef.current.injectJavaScript(`
                if (window.loadModel) {
                    window.loadModel(${payload});
                } else {
                    window.cachedPayload = ${payload};
                }
                void(0);
            `);
        }
    }, [modelBase64, selectedFloor]);

    // Push real-time coordinates, route, and marker updates to the WebView
    useEffect(() => {
        const activeLoc = mergedVisitorLocation || activeVisitorLocation;
        if (webViewRef.current && activeLoc) {
            const payload = JSON.stringify({
                cabinetName,
                floor: selectedFloor,
                visitorLocation: activeLoc,
                appFlavor: APP_FLAVOR
            });
            webViewRef.current.injectJavaScript(`
                if (window.updateLocation) {
                    window.updateLocation(${payload});
                } else if (window.loadModel) {
                    window.loadModel(Object.assign({ floor: "${selectedFloor}", visitorLocation: ${JSON.stringify(activeLoc)}, cabinetName: "${cabinetName}", appFlavor: "${APP_FLAVOR}" }, window.cachedPayload || {}));
                }
                void(0);
            `);
        }
    }, [mergedVisitorLocation, activeVisitorLocation, visitorAssignedCabinet, cabinetName]);

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
                    source={{ 
                        html: APP_FLAVOR === 'MB1' ? MB1_HTML_PDF_RENDERER : HTML_2D_RENDERER,
                        baseUrl: typeof MB1_MAP_BASE64 === 'string' && MB1_MAP_BASE64.startsWith('http') ? MB1_MAP_BASE64.substring(0, MB1_MAP_BASE64.indexOf('/', 8)) : 'http://localhost:8081'
                    }}
                    style={{ flex: 1 }}
                    onLoadEnd={handleWebViewLoadEnd}
                    onMessage={handleWebViewMessage}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    mixedContentMode="always"
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
                        <Text style={{ marginTop: 10, color: '#87848A' }}>Preparing 2D Map...</Text>
                    </View>
                )}

                {pickedModelCoordinate && (
                    <View style={styles.coordinateInspector} pointerEvents="none">
                        <Text style={styles.coordinateInspectorTitle}>3D coordinate</Text>
                        <Text style={styles.coordinateInspectorValue}>
                            X {pickedModelCoordinate.x.toFixed(2)} · Y {pickedModelCoordinate.y.toFixed(2)} · Z {pickedModelCoordinate.z.toFixed(2)}
                        </Text>
                        <Text style={styles.coordinateInspectorHint}>
                            {pickedModelCoordinate.meshName} — match this landmark to an API node.
                        </Text>
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
                    {(APP_FLAVOR === 'MB1' ? ['GR'] : ['F1', 'GR']).map((floor) => (
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
