import { Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './CabinatesTab.styles';
import { ImageSource } from '../../../../constants/assets/images';

const CabinatesTab = () => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const handlePressNavigateBtn = (cabinetName: string) => {
        navigation.navigate('navigationScreen', { cabinetName });
    }

    return (
        <View style={styles.cardContainer}>
            {
                [1, 2, 3, 4, 5, 6].map((item, index) => {
                    const cabinetName = `GR CL1R002${index + 1}`;
                    return (
                        <View style={styles.card} key={index}>
                            <View style={styles.leftSection}>
                                <Image source={ImageSource.Menu} />
                                <Text>{cabinetName}</Text>
                            </View>

                            <TouchableOpacity onPress={() => handlePressNavigateBtn(cabinetName)}>
                                <Image source={ImageSource.RightArrow} style={styles.navigateBtn} />
                            </TouchableOpacity>
                        </View>
                    );
                })
            }
        </View>
    )
}

export default CabinatesTab;