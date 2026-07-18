import { Image, ScrollView, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
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

const DashboardScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = React.useState<'cabinets' | 'common'>('cabinets');
    const [selectedCabinet, setSelectedCabinet] = useState<string | null>(null);
    const { colors } = useTheme();
    const styles = useStyles(colors);

    const handlePressTab = (type: 'cabinets' | 'common') => {
        setSelectedTab(type);
        setSelectedCabinet(null);
    }

    const handleLogoutPress = () => {
        setShowModal(true);
    }

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
                        <View>
                            <Text style={styles.greet} varient='semiBold'>Welcome Back</Text>
                            <Text style={styles.name} varient='bold'>John Doe</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.exitBtn} onPress={handleLogoutPress}>
                        <Image source={ImageSource.Exit} />
                    </TouchableOpacity>
                </View>
                {/* label container */}
                <View style={styles.labelContainer}>
                    <Text style={styles.labelRegular} varient='medium' >Kindly select the below cabinets belonging to <Text style={[styles.labelRegular, styles.labelBold]} varient='semiBold'>Avocado Tech PVT</Text></Text>
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
                                onSelectCabinet={setSelectedCabinet}
                            />
                        ) : <CommonTab />
                    }

                </View>

                {/* Spacer so content doesn't hide behind floating button */}
                {selectedCabinet && <View style={{ height: 100 }} />}

                <CenterContentModal visible={showModal} icon={ImageSource.ExitImage} title='Are you sure you want to Log Out!' description='You are logout, you need to input your desstails'/>
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
        </SafeAreaView>
    )
}

export default DashboardScreen;