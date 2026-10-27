import { View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './CommonTab.styles';
import CommonTabCard from '../CommonTabCard/CommonTabCard';
import { ImageSource } from '../../../../constants/assets/images';

const CommonTab = () => {
    const { colors } = useTheme();
    
    const styles = useStyles(colors);
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const handlePressCard = (title: string) => {
        navigation.navigate('commonsNavigationScreen', { cabinetName: title });
    };

    return (
        <View style={styles.container}>
            
            <View style={styles.cradContainer}>
                <CommonTabCard title='Wash Room' imageUri={ImageSource.WashRoom} imageStyle={styles.washRoomImage} onPress={() => handlePressCard('Wash Room')} />
                <CommonTabCard title='Key Cabin' imageUri={ImageSource.KeyCabin} imageStyle={styles.keyImage} onPress={() => handlePressCard('Key Cabin')} />
            </View>
            <View style={styles.cradContainer}>
                <CommonTabCard title='NOC Room' imageUri={ImageSource.NOCRoom} imageStyle={styles.nocRoomImage} onPress={() => handlePressCard('NOC Room')} />
                <CommonTabCard title='Loading Area' imageUri={ImageSource.LoadingArea} imageStyle={styles.loadingAreaImage} onPress={() => handlePressCard('Loading Area')} />
            </View>
              <View style={styles.cradContainer}>
                <CommonTabCard title='Final Destination Colo-1' imageUri={ImageSource.Menu} imageStyle={styles.coloImage} onPress={() => handlePressCard('Final Destination (Colo 1)')} />
                <CommonTabCard title='Final Destination Colo-2' imageUri={ImageSource.Menu} imageStyle={styles.coloImage} onPress={() => handlePressCard('Final Destination (Colo 2)')} />
            </View>
            <View style={{justifyContent:"flex-start",flexDirection:"row",width:160}}>

                <CommonTabCard title='Final Destination Colo-3' imageUri={ImageSource.Menu} imageStyle={styles.coloImage} onPress={() => handlePressCard('Final Destination (Colo 3)')} />
              
            </View>
        </View>
    )
}

export default CommonTab;