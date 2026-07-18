import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/Ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#0F0F10', // Deep dark background
        },
        header: {
            position: 'absolute',
            top: 60,
            left: 0,
            right: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 15,
            zIndex: 10,
        },
        logo: {
            height: 35,
            resizeMode: 'contain',
        },
        logoName: {
            height: 25,
            resizeMode: 'contain',
        },
        camera: {
            ...StyleSheet.absoluteFillObject,
        },
        overlayContainer: {
            ...StyleSheet.absoluteFillObject,
            justifyContent: 'center',
            alignItems: 'center',
        },
        // Mask style: Dim background of the non-scanning area
        maskOutter: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
        },
        maskInner: {
            width: 280,
            height: 280,
            backgroundColor: 'transparent',
            borderRadius: 1,
            position: 'relative',
        },
        maskRow: {
            flexDirection: 'row',
        },
        maskCenterRow: {
            height: 280,
            flexDirection: 'row',
        },
        maskSide: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
        },
        maskTopBottom: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
        },
        // Corner borders
        topLeftCorner: {
            position: 'absolute',
            top: -2,
            left: -2,
            width: 32,
            height: 32,
            borderTopWidth: 5,
            borderLeftWidth: 5,
            borderColor: '#E2231A', // Equinix Red
            borderTopLeftRadius: 4,
        },
        topRightCorner: {
            position: 'absolute',
            top: -2,
            right: -2,
            width: 32,
            height: 32,
            borderTopWidth: 5,
            borderRightWidth: 5,
            borderColor: '#E2231A',
            borderTopRightRadius: 4,
        },
        bottomLeftCorner: {
            position: 'absolute',
            bottom: -2,
            left: -2,
            width: 32,
            height: 32,
            borderBottomWidth: 5,
            borderLeftWidth: 5,
            borderColor: '#E2231A',
            borderBottomLeftRadius: 4,
        },
        bottomRightCorner: {
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: 32,
            height: 32,
            borderBottomWidth: 5,
            borderRightWidth: 5,
            borderColor: '#E2231A',
            borderBottomRightRadius: 4,
        },
        laserLine: {
            height: 5,
            backgroundColor: '#E2231A',
            width: '100%',
            position: 'absolute',
            shadowColor: '#E2231A',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 5,
            elevation: 5,
        },
        footerText: {
            position: 'absolute',
            bottom: 120,
            left: 20,
            right: 20,
            textAlign: 'center',
            color: '#FFFFFF',
            fontSize: 16,
            zIndex: 10,
        },
        errorContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
            backgroundColor: '#0F0F10',
        },
        errorText: {
            color: '#FFFFFF',
            fontSize: 18,
            textAlign: 'center',
            marginBottom: 20,
        },
        backButton: {
            position: 'absolute',
            top: 60,
            left: 20,
            zIndex: 15,
            padding: 10,
        },
        backIcon: {
            width: 24,
            height: 24,
            tintColor: '#FFFFFF',
        },
        rightSection: {
            position: 'absolute',
            top: 60,
            right: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 15,
            zIndex: 15,
        },
        controlButton: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        controlText: {
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: '600',
        },
    });
