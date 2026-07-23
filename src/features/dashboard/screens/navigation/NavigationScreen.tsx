import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { default as Text } from '../../../../components/Text/MSText';
import { ImageSource } from '../../../../constants/assets/images';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './NavigationScreen.styles';
import CenterContentModal from '../../../../components/Modal/CenterContentModal/CenterContentModal';

type RouteParams = {
    NavigationScreen: {
        cabinetName?: string;
    };
};

const NavigationScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute<RouteProp<RouteParams, 'NavigationScreen'>>();
    const cabinetName = route.params?.cabinetName || 'GR CL1R0021';

    const { colors } = useTheme();
    const styles = useStyles(colors);

    const [selectedFloor, setSelectedFloor] = useState<string>('F2');
    const [zoomScale, setZoomScale] = useState<number>(1.0);
    const [containerLayout, setContainerLayout] = useState<{ width: number; height: number } | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleGetIntoPhone = () => {
        setShowSuccessModal(true);
    };

    const onContainerLayout = (event: any) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerLayout({ width, height });
    };

    const handleZoomIn = () => {
        setZoomScale(prev => Math.min(prev + 0.25, 2.5));
    };

    const handleZoomOut = () => {
        setZoomScale(prev => Math.max(prev - 0.25, 1.0));
    };

    const renderPath = (w: number, h: number) => {
        // Start from bottom-left entrance, go up-right main corridor, turn up-left to rack row, end at target cabinet.
        const p0 = { x: w * 0.32, y: h * 0.78 };
        const p1 = { x: w * 0.65, y: h * 0.50 };
        const p2 = { x: w * 0.45, y: h * 0.35 };
        const p3 = { x: w * 0.55, y: h * 0.27 };

        const segments = [
            { from: p0, to: p1 },
            { from: p1, to: p2 },
            { from: p2, to: p3 },
        ];

        return (
            <View style={styles.routeOverlay} pointerEvents="none">
                {segments.map((seg, index) => {
                    const dx = seg.to.x - seg.from.x;
                    const dy = seg.to.y - seg.from.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx);
                    const midX = (seg.from.x + seg.to.x) / 2;
                    const midY = (seg.from.y + seg.to.y) / 2;

                    return (
                        <View
                            key={index}
                            style={{
                                position: 'absolute',
                                left: midX - distance / 2,
                                top: midY - 4, // Center vertical position relative to height
                                width: distance,
                                height: 8,
                                backgroundColor: '#00A3FF',
                                borderRadius: 4,
                                transform: [{ rotate: `${angle}rad` }],
                            }}
                        />
                    );
                })}

                {/* Arrow head pointing in the direction of the final path segment (p2 -> p3) */}
                {(() => {
                    const dx = p3.x - p2.x;
                    const dy = p3.y - p2.y;
                    const angle = Math.atan2(dy, dx) + Math.PI / 2;

                    return (
                        <View
                            style={[
                                styles.arrowHead,
                                {
                                    left: p3.x - 10,
                                    top: p3.y - 9,
                                    transform: [{ rotate: `${angle}rad` }],
                                },
                            ]}
                        />
                    );
                })()}

                {/* Glowing Concentric Target Indicator at target endpoint (p3) */}
                <View
                    style={[
                        styles.targetCircle,
                        {
                            left: p3.x - 16,
                            top: p3.y - 16,
                        },
                    ]}
                >
                    <View style={styles.targetDot} />
                </View>
            </View>
        );
    };

    const mapWidth = containerLayout ? containerLayout.width * zoomScale : 350;
    const mapHeight = containerLayout ? containerLayout.height * zoomScale : 466;

    return (
        <SafeAreaView edges={['bottom', 'top']} style={styles.container}>
            {/* Header section with brand indicator */}
            <View style={styles.header}>
                <View style={styles.redIndicator} />
                <View style={styles.logoContainer}>
                    <Image source={ImageSource.Logo} style={styles.logo} />
                    <View style={styles.titleWrapper}>
                        <Text style={styles.logoTitle} varient="bold">AVOCADO</Text>
                        <Text style={styles.logoSubtitle}>From seed to screen</Text>
                    </View>
                </View>
            </View>

            {/* Main datacenter map canvas */}
            <View style={styles.mapContainer} onLayout={onContainerLayout}>
                {containerLayout ? (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ width: mapWidth }}
                    >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ height: mapHeight }}
                        >
                            <View style={{ width: mapWidth, height: mapHeight, position: 'relative' }}>
                                <Image source={ImageSource.DatacenterMap} style={styles.mapImage} />

                                {/* Draw Corridor Path Routing */}
                                {renderPath(mapWidth, mapHeight)}
                            </View>
                        </ScrollView>
                    </ScrollView>
                ) : (
                    <ActivityIndicator size="large" color="#E2231A" style={{ alignSelf: 'center', marginTop: 100 }} />
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
                    {['F4', 'F3', 'F2', 'F1'].map((floor) => (
                        <TouchableOpacity
                            key={floor}
                            style={[
                                styles.floorButton,
                                selectedFloor === floor && styles.floorButtonActive,
                            ]}
                            onPress={() => setSelectedFloor(floor)}
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

            <CenterContentModal
                visible={showSuccessModal}
                icon={ImageSource.ServerCloud}
                title="Navigation Sync Complete"
                description={`Corridor route to cabinet ${cabinetName} on level ${selectedFloor} has been successfully downloaded for offline access.`}
            />
        </SafeAreaView>
    );
};

export default NavigationScreen;
