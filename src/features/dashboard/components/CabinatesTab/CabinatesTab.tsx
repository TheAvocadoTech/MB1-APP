import { Image, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './CabinatesTab.styles';
import { ImageSource } from '../../../../constants/assets/images';
import { default as Text } from '../../../../components/Text/MSText';

interface CabinatesTabProps {
    selectedCabinet: string | null;
    onSelectCabinet: (cabinetName: string) => void;
}

const CabinatesTab = ({ selectedCabinet, onSelectCabinet }: CabinatesTabProps) => {
    const { colors } = useTheme();
    const styles = useStyles(colors);

    return (
        <View style={styles.cardContainer}>
            {
                [1, 2, 3, 4, 5, 6].map((item, index) => {
                    const cabinetName = `GR CL1 R1 002${index + 1}`;
                    const isSelected = selectedCabinet === cabinetName;
                    return (
                        <TouchableOpacity 
                            activeOpacity={0.8}
                            style={[styles.card, isSelected && styles.activeCard]} 
                            key={index}
                            onPress={() => onSelectCabinet(cabinetName)}
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