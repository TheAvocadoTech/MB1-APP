import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Appearance, StatusBar, StatusBarStyle } from 'react-native';
import { darkColors, lightColors } from '../constants/Ui/colors';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import AsyncStorage from '@react-native-community/async-storage';

const ThemeMode = {
    light: 'light',
    dark: 'dark',
};

type ThemeModeType = keyof typeof ThemeMode;

const ThemeContext = createContext<{
    mode: ThemeModeType;
    colors: typeof lightColors;
    toggleTheme: () => void;
}>({
    mode: 'light',
    colors: lightColors,
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // ✅ Set initial value once
    const colorScheme = Appearance.getColorScheme() as ThemeModeType;
    const [mode, setMode] = useState<ThemeModeType>(colorScheme || 'light');

    const toggleTheme = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
    };

    const colors = mode === 'light' ? lightColors : darkColors;
    const statusBarStyle: StatusBarStyle = mode === 'light' ? 'dark-content' : 'light-content';

    const fetchModeFromStorage = async () => {
        const storedMode = await AsyncStorage.getItem('mode');
        const savedMode: ThemeModeType = storedMode === 'dark' ? 'dark' : 'light';
        setMode(savedMode);
    };

    useEffect(() => {
        fetchModeFromStorage();
    }, []);

    // Update AsyncStorage whenever mode changes
    useEffect(() => {
        AsyncStorage.setItem('mode', mode);
    }, [mode]);

    useEffect(() => {
        SystemNavigationBar.setNavigationColor(colors.card_bg_primary);
    }, [colors.card_bg_primary]);

    return (
        <ThemeContext.Provider value={{ mode, colors, toggleTheme }}>
            <StatusBar backgroundColor={"transparent"} barStyle={mode === 'light' ? 'dark-content' : 'light-content'} animated showHideTransition={'fade'} translucent />
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
