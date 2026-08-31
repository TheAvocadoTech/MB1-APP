import { Image, ScrollView, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { default as Text } from '../../../../components/Text/MSText'
import { ImageSource } from '../../../../constants/assets/images'
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './ScanQr.styles'
import PrimaryButton from '../../../../components/Button/PrimaryButton/PrimaryButton'
import { APP_FLAVOR } from '../../../../config/flavor';
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BASE_URL } from '../../../../services/ApiUtility'

const ScanQr = () => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const handlePressScanQR = () => {
        navigation.navigate('cameraScanner');
    }

    return (
        <SafeAreaView edges={["bottom", "top"]} style={{ flex: 1, backgroundColor: colors.background_primary }}>
            <ScrollView showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingVertical: 20, justifyContent: "center", alignItems: "center" }}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Image source={ImageSource.ServerCloud} style={{width: 193, height: 159}} />
                    <Image source={ImageSource.ServerMan} style={styles.serverMan} />
                </View>

                <View style={styles.logoContainer}>
                    <Image source={ImageSource.Logo} />
                    <Image source={ImageSource.LogoName} />
                </View>

                <View style={styles.textContainer}>
                    <Text style={[styles.inactiveText,{fontSize:13}]}>{BASE_URL}</Text>
                    <Text varient='medium' style={styles.inactiveText}>Welcome to EQUINIX Navigation Service </Text>
                    <Text style={styles.inactiveText}>Scan QR to continue your service</Text>
                </View>

                <View style={styles.spacer} />
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <PrimaryButton title='Scan QR' onPress={handlePressScanQR} containerStyle={{ width: 240, height: 65 }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ScanQr;