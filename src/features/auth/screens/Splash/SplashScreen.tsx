import { Image, StyleSheet, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './SplashScreen.styles'
import { ImageSource } from '../../../../constants/assets/images'

const SplashScreen = () => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
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