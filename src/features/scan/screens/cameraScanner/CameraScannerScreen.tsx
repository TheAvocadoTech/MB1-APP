import React, { useEffect, useState, useRef } from 'react';
import { View, Animated, TouchableOpacity, Image, ActivityIndicator, Alert, StyleSheet, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner, CameraPermissionStatus } from 'react-native-vision-camera';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import { default as Text } from '../../../../components/Text/MSText';
import { ImageSource } from '../../../../constants/assets/images';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './CameraScannerScreen.styles';
import { setCredentials, clearCredentials } from '../../../../store/slices/authSlice';
import { scanQRToken } from '../../../../services/ApiUtility';
import { APP_FLAVOR } from '../../../../config/flavor';
import { RootState } from '../../../../store/store';
import { getVisitorLocation } from '../../../../store/slices/cabinetSlice';

const CameraScannerScreen = () => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute<any>();
    const dispatch = useDispatch<any>();

    const { visitor } = useSelector((state: RootState) => state.auth);
    const { visitorLocation } = useSelector((state: RootState) => state.cabinet);

    const fromNavigation = route.params?.fromNavigation;
    const [timeLeft, setTimeLeft] = useState<number>(20);

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

    const handleLogoutAndExit = () => {
        Promise.all([
            AsyncStorage.removeItem('user_token'),
            AsyncStorage.removeItem('user_visitor'),
        ]).then(() => {
            dispatch(clearCredentials());
            navigation.reset({
                index: 0,
                routes: [{ name: 'scanQr' }],
            });
        });
    };

    // Polling hook when displaying QR code
    useEffect(() => {
        if (!fromNavigation) return;
        const visitorId = visitor?.id || '6a624b4560e3cc3ce7496ccd';
        
        const poll = () => {
            console.log('Polling visitor location from QR screen for visitor:', visitorId);
            dispatch(getVisitorLocation(visitorId));
        };
        
        poll();
        const interval = setInterval(poll, 2000);
        return () => clearInterval(interval);
    }, [dispatch, fromNavigation, visitor?.id]);

    // Detect visitor checkout / scanning from the 2nd device
    useEffect(() => {
        if (!fromNavigation) return;
        
        // In real backend, once checkedIn changes to false, trigger logout
        if (visitorLocation && (visitorLocation.visitor?.checkedIn === false || visitorLocation.checkedIn === false)) {
            console.log('Detecting checkedIn is false on 1st device, logging out...');
            handleLogoutAndExit();
        }
    }, [visitorLocation, fromNavigation]);

    // Countdown simulation timer (for testing MB1 mode offline)
    useEffect(() => {
        if (!fromNavigation || APP_FLAVOR !== 'MB1') return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleLogoutAndExit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [fromNavigation]);

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

                // If navigated from navigation screen, open hardcoded URL in browser
                if (route.params?.fromNavigation) {
                    const targetUrl = 'https://equinix-temp.avocadotech.in/';
                    console.log('Navigating to hardcoded URL on browser:', targetUrl);
                    
                    // Clear credentials and storage first (logout)
                    Promise.all([
                        AsyncStorage.removeItem('user_token'),
                        AsyncStorage.removeItem('user_visitor'),
                    ])
                    .then(() => {
                        dispatch(clearCredentials());
                        // Replace or reset the stack to scanQr so when the user returns to the app,
                        // they are completely logged out and see the scanQr screen.
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'scanQr' }],
                        });
                        
                        // Open browser URL
                        return Linking.openURL(targetUrl);
                    })
                    .catch((err) => {
                        console.log('Error during logout or opening browser:', err);
                        setScanned(false);
                        setIsActive(true);
                    });
                    return;
                }

                setLoading(true);
                console.log('QR Code Scanned, verifying: ', codeValue);

                if (APP_FLAVOR === 'MB1') {
                    const staticVisitor = {
                        id: 'static-mb1',
                        visitorName: 'Nirav patel',
                        company: 'Equinix',
                        idNumber: 'Tag1',
                        phoneNumber: '1234567890',
                        qrCode: 'dummy_qr',
                        qrExpiresAt: new Date(Date.now() + 40 * 1000).toISOString(),
                        checkedIn: true
                    };
                    Promise.all([
                        AsyncStorage.setItem('user_token', codeValue),
                        AsyncStorage.setItem('user_visitor', JSON.stringify(staticVisitor)),
                    ]).then(() => {
                        dispatch(setCredentials({ token: codeValue, visitor: staticVisitor }));
                        navigation.replace('dashboard');
                    });
                    return;
                }

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

    const qrValue = APP_FLAVOR === 'MB1'
        ? 'http://192.168.20.10:3000/'
        : 'https://equinix-temp.avocadotech.in/';

    // Render loading or error states
    if (permissionStatus === 'not-determined' && !fromNavigation) {
        return (
            <View style={styles.errorContainer}>
                <ActivityIndicator size="large" color="#E2231A" />
                <Text style={{ color: '#FFFFFF', marginTop: 15 }}>Initializing Camera...</Text>
            </View>
        );
    }

    if (!hasPermission && !fromNavigation) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Camera permission was denied. Please enable camera access in your system settings to scan the QR code.</Text>
                <TouchableOpacity onPress={handleBack} style={{ padding: 15, backgroundColor: '#E2231A', borderRadius: 8 }}>
                    <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!device && !fromNavigation) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No camera device found on this device.</Text>
                <TouchableOpacity onPress={handleBack} style={{ padding: 15, backgroundColor: '#E2231A', borderRadius: 8 }}>
                    <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (fromNavigation) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#1C1A22' }]}>
                {/* Header with Logo */}
                <View style={[styles.header, { position: 'absolute', top: 40, width: '100%', paddingHorizontal: 24 }]}>
                    <Image source={ImageSource.Logo} style={styles.logo} />
                    <Image source={ImageSource.LogoNameWhite} style={styles.logoName} />
                </View>

                {/* Back Button */}
                <TouchableOpacity onPress={handleBack} style={[styles.backButton, { position: 'absolute', top: 45, left: 20 }]}>
                    <Text fontSize={28} style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{"\u2190"}</Text>
                </TouchableOpacity>

                {/* Main QR Card */}
                <View style={{
                    width: '85%',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 24,
                    padding: 24,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 16,
                    elevation: 10,
                    marginTop: 80
                }}>
                    <Text style={{ fontSize: 20, color: '#333333', fontWeight: 'bold', marginBottom: 6 }}>
                        Get into my phone
                    </Text>
                    <Text style={{ fontSize: 13, color: '#666666', textAlign: 'center', marginBottom: 20, lineHeight: 18 }}>
                        Scan the QR code below from your second device's camera to transfer the navigation map session.
                    </Text>

                    <Image
                        source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrValue)}` }}
                        style={{ width: 220, height: 220, marginBottom: 15 }}
                        resizeMode="contain"
                    />

                    <Text style={{ fontSize: 12, color: '#888888', marginBottom: 5 }}>
                        Link: {qrValue}
                    </Text>

                    <Text style={{ fontSize: 13, color: '#E2231A', fontWeight: '500', marginTop: 10 }}>
                        {APP_FLAVOR === 'MB1'
                            ? `Waiting for scan... (Simulation logout in ${timeLeft}s)`
                            : 'Waiting for scan...'}
                    </Text>
                </View>

                {/* Action Buttons */}
                <View style={{ width: '85%', marginTop: 24, gap: 12 }}>
                    {APP_FLAVOR === 'MB1' && (
                        <TouchableOpacity
                            onPress={handleLogoutAndExit}
                            style={{
                                width: '100%',
                                height: 50,
                                borderRadius: 25,
                                backgroundColor: '#E2231A',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' }}>
                                Simulate Scan (Logout)
                            </Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={handleBack}
                        style={{
                            width: '100%',
                            height: 50,
                            borderRadius: 25,
                            borderWidth: 1,
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' }}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
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
                device={device!}
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
