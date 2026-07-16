import { Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './CabinatesTab.styles';
import { ImageSource } from '../../../../constants/assets/images';

const CabinatesTab = () => {
    const { colors } = useTheme();
    const styles = useStyles(colors);


    const handlePressNavigateBtn = () => {

    }

    return (
        <View style={styles.cardContainer}>
            {
                [1, 2, 3, 4, 5, 6].map((item, index) => <View style={styles.card} key={index}>
                    <View style={styles.leftSection}>
                        <Image source={ImageSource.Menu} />
                        <Text>GR CL1R0021</Text>
                    </View>

                    <TouchableOpacity onPress={handlePressNavigateBtn}>
                        <Image source={ImageSource.RightArrow} style={styles.navigateBtn} />
                    </TouchableOpacity>
                </View>)
            }
        </View>
    )
}

export default CabinatesTab;