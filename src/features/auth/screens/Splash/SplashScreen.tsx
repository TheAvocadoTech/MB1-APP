import { Image, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './SplashScreen.styles'
import { ImageSource } from '../../../../constants/assets/images'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

const SplashScreen = () => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('scanQr');
        }, 1500);
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <SafeAreaView edges={['bottom', 'top']} style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={ImageSource.Logo} />
                <Image source={ImageSource.LogoName} />
            </View>
        </SafeAreaView>
    )
}

export default SplashScreen

const styles = StyleSheet.create({})