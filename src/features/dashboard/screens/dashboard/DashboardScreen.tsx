import { Image, ScrollView, TouchableOpacity, View, Modal, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './DashboardScreen.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { default as Text } from '../../../../components/Text/MSText'
import { ImageSource } from '../../../../constants/assets/images';
import CabinatesTab from '../../components/CabinatesTab/CabinatesTab';
import CommonTab from '../../components/CommonTab/CommonTab';
import CenterContentModal from '../../../../components/Modal/CenterContentModal/CenterContentModal';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { clearCredentials, setCredentials } from '../../../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../../../store/store';
import { regenerateQR, fetchVisitorDashboard, fetchCabinetsList, updateVisitorCabinet } from '../../../../services/ApiUtility';
import { getCabinetDetails, getVisitorAssignedCabinet, getVisitorLocation } from '../../../../store/slices/cabinetSlice';
import { APP_FLAVOR } from '../../../../config/flavor';

const DashboardScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const dispatch = useDispatch<AppDispatch>();
    
    // Redux auth details
    const { visitor, token } = useSelector((state: RootState) => state.auth);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = React.useState<'cabinets' | 'common'>('cabinets');
    const [selectedCabinet, setSelectedCabinet] = useState<string | null>(null);

    // Dynamic cabinets list states
    const [cabinets, setCabinets] = useState<any[]>([]);
    const [loadingCabinets, setLoadingCabinets] = useState<boolean>(false);

    // Expiry timer and QR regeneration states
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [showTimeoutWarning, setShowTimeoutWarning] = useState<boolean>(false);
    const [warningCountdown, setWarningCountdown] = useState<number>(30);
    const [qrCodeToken, setQrCodeToken] = useState<string>('');

    const { colors } = useTheme();
    const styles = useStyles(colors);

    const handleSelectCabinet = async (cabinetName: string, cabinetId: string) => {
        setSelectedCabinet(cabinetName);
        if (!cabinetId) return;

        if (APP_FLAVOR === 'MB1') {
            return;
        }
        
        try {
            console.log('Fetching details for cabinet ID:', cabinetId);
            
            // Safely extract visitor ID (handle cases where it might be _id or nested in data)
            const vis = visitor as any;
            const visId = visitor?.id || vis?._id || vis?.visitor?.id || '6a61054d9407ddaf4317ed64';
            const idNumber = 'Tag1';
            
            console.log('Updating visitor assigned cabinet on backend via PUT for visitor:', visId);
            const putRes = await updateVisitorCabinet(visId, idNumber);
            console.log('updateVisitorCabinet PUT Response:', JSON.stringify(putRes, null, 2));

            if (putRes && putRes.success && putRes.data) {
                // Sync visitor cabinet state in Redux and AsyncStorage
                const updatedVisitor = { ...visitor, ...putRes.data };
                dispatch(setCredentials({ token: token || '', visitor: updatedVisitor }));
                await AsyncStorage.setItem('user_visitor', JSON.stringify(updatedVisitor));
                console.log('Successfully updated visitor credentials in Redux and storage');
            }

            // Dispatch cabinet details regardless of visitor state
            dispatch(getCabinetDetails(cabinetId));
            
            console.log('Dispatching APIs for visitor:', visId);
            await dispatch(getVisitorAssignedCabinet({ visitorId: visId, idNumber })).unwrap();
            dispatch(getVisitorLocation(visId));
            
            console.log('Successfully dispatched all cabinet data requests');
        } catch (error) {
            console.log('Error dispatching cabinet data requests:', error);
        }
    };

    // Sync initial QR token
    useEffect(() => {
        if (token) {
            setQrCodeToken(token);
        }
    }, [token]);

    // Fetch fresh dashboard data on mount
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!token || APP_FLAVOR === 'MB1') return;
            try {
                console.log('Fetching latest dashboard data...');
                const res = await fetchVisitorDashboard(token);
                if (res && res.success && res.data) {
                    dispatch(setCredentials({ token, visitor: res.data }));
                    await AsyncStorage.setItem('user_visitor', JSON.stringify(res.data));
                }
            } catch (error) {
                console.log('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, [token, dispatch]);



    // Fetch cabinet list when cabinets tab is selected or visitor idNumber changes
    useEffect(() => {
        if (selectedTab === 'cabinets') {
            const getCabinets = async () => {
                setLoadingCabinets(true);
                try {
                    if (APP_FLAVOR === 'MB1') {
                        setCabinets([{ _id: 'mb1_static', cabinetName: 'MB1:GF:010010:0515' }]);
                        setLoadingCabinets(false);
                        return;
                    }
                    const idNumber = visitor?.idNumber || 'Tag1';
                    console.log('Fetching cabinets list for ID:', idNumber);
                    const res = await fetchCabinetsList(idNumber);
                    console.log("Fetch cabinate >>>", res)
                    if (res && res.success && res.cabinets) {
                        setCabinets(res.cabinets);
                    } else {
                        setCabinets([]);
                    }
                } catch (error) {
                    console.log('Error fetching cabinets:', error);
                    setCabinets([]);
                } finally {
                    setLoadingCabinets(false);
                }
            };
            getCabinets();
        }
    }, [selectedTab, visitor]);

    const handlePressTab = (type: 'cabinets' | 'common') => {
        setSelectedTab(type);
        setSelectedCabinet(null);
    }

    const handleLogoutPress = () => {
        setShowModal(true);
    }

    const handleLogoutConfirm = async () => {
        setShowModal(false);
        try {
            await Promise.all([
                AsyncStorage.removeItem('user_token'),
                AsyncStorage.removeItem('user_visitor'),
            ]);
        } catch (e) {
            console.log('Error clearing storage:', e);
        }
        dispatch(clearCredentials());
        navigation.replace('scanQr');
    };

    const handleAutoLogout = async () => {
        setShowTimeoutWarning(false);
        try {
            await Promise.all([
                AsyncStorage.removeItem('user_token'),
                AsyncStorage.removeItem('user_visitor'),
            ]);
        } catch (e) {
            console.log('Error clearing storage:', e);
        }
        dispatch(clearCredentials());
        navigation.replace('scanQr');
    };

    const handleRegenerateQR = async () => {
        if (!visitor || !visitor.id) return;
        try {
            console.log('Regenerating QR for visitor ID:', visitor.id);
            const res = await regenerateQR(visitor.id);
            if (res && res.success && res.data) {
                const newToken = res.data.qrToken || res.data.qrCodeId || token || '';
                setQrCodeToken(newToken);
                return res.data;
            }
        } catch (error) {
            console.log('Error regenerating QR:', error);
        }
        return null;
    };

    const handleExtendSession = async () => {
        if (!visitor || !visitor.id) return;
        
        let newExpiresAt: string;
        if (APP_FLAVOR === 'MB1') {
            newExpiresAt = new Date(Date.now() + 3600 * 1000).toISOString();
        } else {
            // Call regenerate-qr API
            const data = await handleRegenerateQR();
            if (data && data.qrExpiresAt) {
                newExpiresAt = data.qrExpiresAt;
            } else {
                newExpiresAt = new Date(Date.now() + 3600 * 1000).toISOString();
            }
        }

        // Save updated session to AsyncStorage and Redux
        const updatedVisitor = { ...visitor, qrExpiresAt: newExpiresAt };
        try {
            await AsyncStorage.setItem('user_visitor', JSON.stringify(updatedVisitor));
        } catch (e) {
            console.log('Error saving updated visitor:', e);
        }
        dispatch(setCredentials({ token: qrCodeToken || token || '', visitor: updatedVisitor }));
        
        // Close warning modal
        setShowTimeoutWarning(false);
    };

    // Active session checker timer
    useEffect(() => {
        if (!visitor || !visitor.qrExpiresAt || APP_FLAVOR === 'MB1') return;
        const qrExpiresAt = visitor.qrExpiresAt;

        const interval = setInterval(() => {
            const expiryTime = new Date(qrExpiresAt).getTime();
            const now = new Date().getTime();
            const diffSeconds = Math.max(0, Math.floor((expiryTime - now) / 1000));
            
            setTimeRemaining(diffSeconds);

            // Pop up warning modal when <= 120 seconds (2 minutes) remaining
            if (diffSeconds <= 120 && diffSeconds > 0) {
                if (!showTimeoutWarning) {
                    setShowTimeoutWarning(true);
                    setWarningCountdown(30);
                    if (APP_FLAVOR !== 'MB1') {
                        handleRegenerateQR();
                    }
                }
            }

            // Expiry logout
            if (diffSeconds === 0) {
                clearInterval(interval);
                handleAutoLogout();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [visitor?.qrExpiresAt, showTimeoutWarning]);

    // Modal countdown timer
    useEffect(() => {
        if (!showTimeoutWarning) return;

        const interval = setInterval(() => {
            setWarningCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleAutoLogout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [showTimeoutWarning]);

    const formatWarningTime = (seconds: number) => {
        const secs = seconds % 60;
        const secsStr = secs < 10 ? `0${secs}` : `${secs}`;
        return `00:${secsStr}`;
    };

    const handlePressStartNavigation = () => {
        if (selectedCabinet) {
            navigation.navigate('navigationScreen', { cabinetName: selectedCabinet });
        }
    };

    return (
        <SafeAreaView edges={["bottom", "top"]} style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
                {/* header section */}
                <View style={styles.header}>
                    <View style={styles.nameContainer}>
                        <View style={styles.bar} />
                        <View style={styles.greetTextWrapper}>
                            <Text style={styles.greet} varient='semiBold'>Welcome Back</Text>
                            <Text style={styles.name} varient='bold' numberOfLines={1} adjustsFontSizeToFit>{visitor?.visitorName || 'John Doe'}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.exitBtn} onPress={handleLogoutPress}>
                        <Image source={ImageSource.Exit} />
                    </TouchableOpacity>
                </View>
                {/* label container */}
                <View style={styles.labelContainer}>
                    <Text style={styles.labelRegular} varient='medium' >Kindly select the below cabinets belonging to <Text style={[styles.labelRegular, styles.labelBold]} varient='semiBold'>{visitor?.company || 'Avocado Tech PVT'}</Text></Text>
                </View>

                <View style={styles.rowContainer}>
                    <View style={styles.tabWrapper}>
                        <View style={styles.tabsContainer}>
                            <TouchableOpacity style={[styles.tab, selectedTab === 'cabinets' && styles.activeTab]} onPress={() => handlePressTab('cabinets')}>
                                <Text varient='medium' style={[styles.tabText, selectedTab === 'cabinets' && styles.activeTabText]}>Cabinets</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tab, selectedTab === 'common' && styles.activeTab]} onPress={() => handlePressTab('common')}>
                                <Text varient='medium' style={[styles.tabText, selectedTab === 'common' && styles.activeTabText]}>Common</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        selectedTab === 'cabinets' ? (
                            <CabinatesTab 
                                selectedCabinet={selectedCabinet}
                                onSelectCabinet={handleSelectCabinet}
                                cabinets={cabinets}
                                loadingCabinets={loadingCabinets}
                            />
                        ) : <CommonTab />
                    }

                </View>

                {/* Spacer so content doesn't hide behind floating button */}
                {selectedCabinet && <View style={{ height: 100 }} />}

                <CenterContentModal 
                    visible={showModal} 
                    onClose={() => setShowModal(false)}
                    icon={ImageSource.ExitImage} 
                    title='Are you sure you want to Log Out!' 
                    description='You are logout, you need to input your details'
                >
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                            <Text style={styles.cancelBtnText} varient="medium">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.logoutConfirmBtn} onPress={handleLogoutConfirm}>
                            <Text style={styles.logoutConfirmBtnText} varient="medium">Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </CenterContentModal>
            </ScrollView>

            {/* Floating Navigation Button */}
            {selectedCabinet && (
                <View style={styles.floatingButtonContainer}>
                    <TouchableOpacity style={styles.floatingButton} onPress={handlePressStartNavigation}>
                        <Text style={styles.floatingButtonText} varient="semiBold">Start Navigation</Text>
                        <Image source={ImageSource.NavigateWhite} style={styles.floatingButtonIcon} />
                    </TouchableOpacity>
                </View>
            )}

            {/* Session Timeout Warning Modal */}
            <Modal
                visible={showTimeoutWarning}
                transparent
                animationType="fade"
            >
                <View style={styles.warningOverlay}>
                    <View style={styles.warningContainer}>
                        {/* Circular Countdown Timer */}
                        <View style={styles.circleTimerContainer}>
                            <Text style={styles.circleTimerText} varient="bold">
                                {formatWarningTime(warningCountdown)}
                            </Text>
                        </View>

                        <Text style={styles.warningTitle} varient="bold">
                            Session Timeout Warning
                        </Text>
                        <Text style={styles.warningDescription} varient="regular">
                            Your session is about to expire.{"\n"}
                            Scan the QR below or extend your time to stay logged in.
                        </Text>

                        {/* QR Code Container */}
                        <View style={styles.warningQrContainer}>
                            {visitor?.qrCode ? (
                                <Image
                                    source={{ uri: visitor.qrCode }}
                                    style={styles.warningQrImage}
                                />
                            ) : qrCodeToken ? (
                                <Image
                                    source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrCodeToken}` }}
                                    style={styles.warningQrImage}
                                />
                            ) : (
                                <ActivityIndicator size="large" color="#E2231A" />
                            )}
                        </View>

                        {/* Buttons */}
                        <View style={styles.warningButtonsContainer}>
                            <TouchableOpacity
                                style={styles.warningCancelButton}
                                onPress={() => setShowTimeoutWarning(false)}
                            >
                                <Text style={styles.warningCancelButtonText} varient="medium">
                                    CANCEL
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.warningExtendButton}
                                onPress={handleExtendSession}
                            >
                                <Text style={styles.warningExtendButtonText} varient="medium">
                                    1Hr EXTEND
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default DashboardScreen;