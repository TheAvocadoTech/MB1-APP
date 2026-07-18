
import React from 'react'
import SplashScreen from './features/auth/screens/Splash/SplashScreen'
import DashboardScreen from './features/dashboard/screens/dashboard/DashboardScreen'
import ScanQr from './features/scan/screens/scanQr/ScanQr'
import CameraScannerScreen from './features/scan/screens/cameraScanner/CameraScannerScreen'
import NavigationScreen from './features/dashboard/screens/navigation/NavigationScreen'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();
const initialRoute = "cameraScanner"

const App = () => {
    return (
        <GestureHandlerRootView style={styles.container}>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{ headerShown: false }}
                    initialRouteName={initialRoute}
                >
                    <Stack.Screen name="splash" component={SplashScreen} />
                    <Stack.Screen name="dashboard" component={DashboardScreen}/>
                    <Stack.Screen name="scanQr" component={ScanQr} />
                    <Stack.Screen name="cameraScanner" component={CameraScannerScreen} />
                    <Stack.Screen name="navigationScreen" component={NavigationScreen} />
                </Stack.Navigator>
                </NavigationContainer>
        </GestureHandlerRootView>
    )
}

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});