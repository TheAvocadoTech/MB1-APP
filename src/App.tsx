
import React, { useEffect, useState } from 'react'
import SplashScreen from './features/auth/screens/Splash/SplashScreen'
import DashboardScreen from './features/dashboard/screens/dashboard/DashboardScreen'
import ScanQr from './features/scan/screens/scanQr/ScanQr'
import CameraScannerScreen from './features/scan/screens/cameraScanner/CameraScannerScreen'
import NavigationScreen from './features/dashboard/screens/navigation/NavigationScreen'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { StackScreen } from 'react-native-screens'
import { Asset } from 'expo-asset'
import { APP_FLAVOR } from './config/flavor'

const Stack = createNativeStackNavigator();
const initialRoute = "splash"

const App = () => {
    // Inside MB1Native3DMap.tsx
const [isAssetsReady, setIsAssetsReady] = useState(false);

  useEffect(() => {
    async function loadAssets() {
      try {
        // Pre-download and cache the 3D model right when the app boots up
        if(APP_FLAVOR==='MB1'){
            await Asset.fromModule(require('./assets/models/mb1-campus.glb')).downloadAsync();
        }
      } catch (e) {
        console.warn('Asset preloading error:', e);
      } finally {
        setIsAssetsReady(true);
      }
    }
    loadAssets();
  }, []);
    return (
        <Provider store={store}>
            <GestureHandlerRootView style={styles.container}>
                <NavigationIndependentTree>
                    <NavigationContainer>
                        <Stack.Navigator
                            screenOptions={{ headerShown: false }}
                            initialRouteName={initialRoute}>
                            <Stack.Screen name="splash" component={SplashScreen} />
                            <Stack.Screen name="dashboard" component={DashboardScreen}/>
                            <Stack.Screen name="scanQr" component={ScanQr} />
                            <Stack.Screen name="cameraScanner" component={CameraScannerScreen} />

                            <Stack.Screen name="navigationScreen" component={NavigationScreen} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </NavigationIndependentTree>
                
            </GestureHandlerRootView>
        </Provider>
    )
}

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});