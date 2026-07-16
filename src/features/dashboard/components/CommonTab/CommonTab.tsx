import { View } from 'react-native'
import React from 'react'
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './CommonTab.styles';
import CommonTabCard from '../CommonTabCard/CommonTabCard';
import { ImageSource } from '../../../../constants/assets/images';

const CommonTab = () => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    return (
        <View style={styles.container}>
            <View style={styles.cradContainer}>
                <CommonTabCard title='Wash Room' imageUri={ImageSource.WashRoom} imageStyle={styles.washRoomImage} />
                <CommonTabCard title='Wash Room' imageUri={ImageSource.KeyCabin} imageStyle={styles.keyImage} />
            </View>
            <View style={styles.cradContainer}>
                <CommonTabCard title='Wash Room' imageUri={ImageSource.NOCRoom} imageStyle={ImageSource.NOCRoom} />
                <CommonTabCard title='Wash Room' imageUri={ImageSource.LoadingArea} imageStyle={styles.loadingAreaImage} />
            </View>
        </View>
    )
}

export default CommonTab;