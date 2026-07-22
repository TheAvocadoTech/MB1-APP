import React, { useEffect, useState, useRef } from 'react';
import { View, Animated, TouchableOpacity, Image, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner, CameraPermissionStatus } from 'react-native-vision-camera';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import { default as Text } from '../../../../components/Text/MSText';
import { ImageSource } from '../../../../constants/assets/images';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './CameraScannerScreen.styles';
import { setCredentials } from '../../../../store/slices/authSlice';
import { scanQRToken } from '../../../../services/ApiUtility';

const CameraScannerScreen = () => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const dispatch = useDispatch();

    const [cameraPos, setCameraPos] = useState<'back' | 'front'>('back');
    const [torchOn, setTorchOn] = useState<boolean>(false);
    const { hasPermission, requestPermission } = useCameraPermission();
    const [permissionStatus, setPermissionStatus] = useState<CameraPermissionStatus>(() => Camera.getCameraPermissionStatus());
    const [isActive, setIsActive] = useState<boolean>(true);
    const [scanned, setScanned] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const device = useCameraDevice(cameraPos);
    const scanValue = useRef(new Animated.Value(0)).current;

    // Request camera permission on mount
    // useEffect(() => {
    //     if (permissionStatus === 'not-determined') {
    //         requestPermission().then((granted) => {
    //             setPermissionStatus(granted ? 'granted' : 'denied');
    //         });
    //     }
    // }, [permissionStatus, requestPermission]);

    useEffect(() => {
        if (!hasPermission) requestPermission();
    }, [hasPermission, requestPermission]);

    // Set up loop animation for the scanning laser line
    useEffect(() => {
        if (hasPermission && device && !scanned) {
            const startAnimation = () => {
                scanValue.setValue(0);
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(scanValue, {
                            toValue: 1,
                            duration: 2500,
                            useNativeDriver: true,
                        }),
                        Animated.timing(scanValue, {
                            toValue: 0,
                            duration: 2500,
                            useNativeDriver: true,
                        })
                    ])
                ).start();
            };
            startAnimation();
        } else {
            scanValue.stopAnimation();
        }
    }, [hasPermission, device, scanned, scanValue]);

    // Setup built-in code scanner to scan QR codes
    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: (codes) => {
            if (scanned || loading || codes.length === 0) return;

            const firstCode = codes[0];
            const codeValue = firstCode.value;
            if (codeValue) {
                setScanned(true);
                setIsActive(false);
                setLoading(true);
                console.log('QR Code Scanned, verifying: ', codeValue);

                scanQRToken(codeValue)
                    .then((res) => {
                        console.log("This is the response of scanQr: ", res);
                        setLoading(false);
                        if (res && res.success && res.isValid && res.data) {
                            // Save user token and details to AsyncStorage
                            Promise.all([
                                AsyncStorage.setItem('user_token', codeValue),
                                AsyncStorage.setItem('user_visitor', JSON.stringify(res.data)),
                            ]).then(() => {
                                // Update Redux state
                                dispatch(setCredentials({ token: codeValue, visitor: res.data }));
                                // Navigate to dashboard
                                navigation.replace('dashboard');
                            });
                        } else {
                            Alert.alert(
                                'Invalid QR Code',
                                res?.message || 'QR code is invalid or expired.',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => {
                                            setScanned(false);
                                            setIsActive(true);
                                        },
                                    },
                                ]
                            );
                        }
                    })
                    .catch((err) => {
                        setLoading(false);
                        console.log('Error verifying QR token:', err);
                        Alert.alert(
                            'Verification Error',
                            'Unable to connect to the verification server. Please try again.',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        setScanned(false);
                                        setIsActive(true);
                                    },
                                },
                            ]
                        );
                    });
            }
        }
    });

    const toggleFlash = () => {
        setTorchOn((prev) => !prev);
    };

    const toggleCameraPos = () => {
        setCameraPos((prev) => (prev === 'back' ? 'front' : 'back'));
    };

    const handleBack = () => {
        setIsActive(false);
        navigation.goBack();
    };

    // Interpolate vertical movement for the laser line (height of box is 280, laser line is 5)
    const translateY = scanValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 275],
    });

    // Render loading or error states
    if (permissionStatus === 'not-determined') {
        return (
            <View style={styles.errorContainer}>
                <ActivityIndicator size="large" color="#E2231A" />
                <Text style={{ color: '#FFFFFF', marginTop: 15 }}>Initializing Camera...</Text>
            </View>
        );
    }

    if (!hasPermission) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Camera permission was denied. Please enable camera access in your system settings to scan the QR code.</Text>
                <TouchableOpacity onPress={handleBack} style={{ padding: 15, backgroundColor: '#E2231A', borderRadius: 8 }}>
                    <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!device) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No camera device found on this device.</Text>
                <TouchableOpacity onPress={handleBack} style={{ padding: 15, backgroundColor: '#E2231A', borderRadius: 8 }}>
                    <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header with Logo */}
            <View style={styles.header}>
                <Image source={ImageSource.Logo} style={styles.logo} />
                <Image source={ImageSource.LogoNameWhite} style={styles.logoName} />
            </View>

            {/* Back Button */}
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Text fontSize={28} style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{"\u2190"}</Text>
            </TouchableOpacity>

            {/* Camera Preview */}
            <Camera
                style={styles.camera}
                device={device}
                isActive={isActive}
                codeScanner={codeScanner}
                torch={torchOn && cameraPos === 'back' ? 'on' : 'off'}
            />

            {/* Right Section Controls */}
            <View style={styles.rightSection}>
                {device?.hasTorch && cameraPos === 'back' && (
                    <TouchableOpacity onPress={toggleFlash} style={styles.controlButton}>
                        <Text style={styles.controlText}>{torchOn ? '⚡ On' : '⚡ Off'}</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={toggleCameraPos} style={styles.controlButton}>
                    <Text style={styles.controlText}>🔄 Flip</Text>
                </TouchableOpacity>
            </View>

            {/* Transparent mask overlay and custom scanning box */}
            <View style={styles.overlayContainer}>
                {/* Top Half-Transparent Layer */}
                <View style={styles.maskTopBottom} />

                <View style={styles.maskRow}>
                    {/* Left Half-Transparent Layer */}
                    <View style={styles.maskSide} />

                    {/* Central Scanning Box Frame */}
                    <View style={styles.maskInner}>
                        {/* Brackets around the scanning frame */}
                        <View style={styles.topLeftCorner} />
                        <View style={styles.topRightCorner} />
                        <View style={styles.bottomLeftCorner} />
                        <View style={styles.bottomRightCorner} />

                        {/* Animated Laser Scanning Line */}
                        <Animated.View style={[styles.laserLine, { transform: [{ translateY }] }]} />
                    </View>

                    {/* Right Half-Transparent Layer */}
                    <View style={styles.maskSide} />
                </View>

                {/* Bottom Half-Transparent Layer */}
                <View style={styles.maskTopBottom} />
            </View>

            {/* Align QR Code help text */}
            <Text style={styles.footerText} varient="medium">
                Align QR Code within frame to Scan
            </Text>

            {/* Verification Loading Overlay */}
            {loading && (
                <View style={[StyleSheet.absoluteFillObject, { justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 100 }]}>
                    <ActivityIndicator size="large" color="#E2231A" />
                    <Text style={{ color: '#FFFFFF', marginTop: 15, fontWeight: 'bold' }}>Verifying QR Code...</Text>
                </View>
            )}
        </View>
    );
};

export default CameraScannerScreen;
