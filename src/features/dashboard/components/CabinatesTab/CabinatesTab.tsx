import { Image, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React from 'react'
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './CabinatesTab.styles';
import { ImageSource } from '../../../../constants/assets/images';
import { default as Text } from '../../../../components/Text/MSText';

interface CabinatesTabProps {
    selectedCabinet: string | null;
    onSelectCabinet: (cabinetName: string, cabinetId: string) => void;
    cabinets: any[];
    loadingCabinets: boolean;
}

const CabinatesTab = ({ selectedCabinet, onSelectCabinet, cabinets, loadingCabinets }: CabinatesTabProps) => {
    const { colors } = useTheme();
    const styles = useStyles(colors);

    if (loadingCabinets) {
        return (
            <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <ActivityIndicator size="small" color="#E2231A" />
                <Text style={{ marginTop: 12, color: '#87848A', fontSize: 14 }} varient="medium">
                    Loading cabinets...
                </Text>
            </View>
        );
    }

    if (!cabinets || cabinets.length === 0) {
        return (
            <View style={{ padding: 35, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <Text style={{ color: '#87848A', fontSize: 14 }} varient="medium">
                    No cabinets found.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.cardContainer}>
            {
                cabinets.map((item, index) => {
                    const cabinetName = item.cabinetName || `Cabinet ${index + 1}`;
                    const isSelected = selectedCabinet === cabinetName;
                    return (
                        <TouchableOpacity 
                            activeOpacity={0.8}
                            style={[styles.card, isSelected && styles.activeCard]} 
                            key={item._id || index}
                            onPress={() => onSelectCabinet(cabinetName, item._id || '')}
                        >
                            <View style={styles.leftSection}>
                                <Image 
                                    source={ImageSource.Menu} 
                                    style={[styles.cardIcon, isSelected && styles.activeCardIcon]} 
                                />
                                <Text style={[styles.cardText, isSelected && styles.activeCardText]} varient="medium">
                                    {cabinetName}
                                </Text>
                            </View>

                            <View>
                                <Image 
                                    source={isSelected ? ImageSource.NavigateWhite : ImageSource.RightArrow} 
                                    style={isSelected ? styles.selectedBtnIcon : styles.navigateBtn} 
                                />
                            </View>
                        </TouchableOpacity>
                    );
                })
            }
        </View>
    )
}

export default CabinatesTab;