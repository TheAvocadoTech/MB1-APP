import { Image, StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './SplashScreen.styles';
import { ImageSource } from '../../../../constants/assets/images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import { setCredentials, clearCredentials } from '../../../../store/slices/authSlice';
import { fetchVisitorDashboard } from '../../../../services/ApiUtility';

const SplashScreen = () => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const dispatch = useDispatch();

    useEffect(() => {
        let timer: any;
        const checkSession = async () => {
            const STATIC_LOGIN = true; // Set to false to enable production QR scanner flow

            if (STATIC_LOGIN) {
                console.log('Static login is active. Logging in with mock details...');
                const mockToken = 'dev_static_token';
                const mockVisitor = {
                    id: '6a5b94931ae29a1c7f808125', // Matches your Postman visitor ID
                    visitorName: 'Developer Guest',
                    phoneNumber: '9999999999',
                    email: 'developer@equinix.com',
                    company: 'Equinix Dev Team',
                    purpose: 'Screen Development',
                    checkedIn: true,
                    qrExpiresAt: new Date(Date.now() + 150000).toISOString(), // Expires in 2.5 minutes
                };
                dispatch(setCredentials({ token: mockToken, visitor: mockVisitor }));
                
                timer = setTimeout(() => {
                    navigation.replace('dashboard');
                }, 1000);
                return;
            }

            try {
                const savedToken = await AsyncStorage.getItem('user_token');

                if (savedToken) {
                    console.log('Found saved token, fetching dashboard...');
                    const res = await fetchVisitorDashboard(savedToken);

                    if (res && res.success && res.data) {
                        console.log('Session is valid, auto-logging in...');
                        dispatch(setCredentials({ token: savedToken, visitor: res.data }));
                        await AsyncStorage.setItem('user_visitor', JSON.stringify(res.data));
                        navigation.replace('dashboard');
                        return;
                    }
                }
            } catch (error) {
                console.log('Error verifying session:', error);
            }

            // Clear credentials and route to onboarding scan if check failed or no token found
            try {
                await Promise.all([
                    AsyncStorage.removeItem('user_token'),
                    AsyncStorage.removeItem('user_visitor'),
                ]);
            } catch (e) {
                console.log('Error cleaning storage:', e);
            }
            dispatch(clearCredentials());

            // Navigate to scanQr after a short delay
            timer = setTimeout(() => {
                navigation.replace('scanQr');
            }, 1000);
        };

        checkSession();
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [navigation, dispatch]);

    return (
        <SafeAreaView edges={['bottom', 'top']} style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={ImageSource.Logo} />
                <Image source={ImageSource.LogoName} />
            </View>
        </SafeAreaView>
    );
};

export default SplashScreen;