import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/Ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
    StyleSheet.create({
        cardContainer: {
            marginVertical: 29,
            gap: 16
        },
        card: {
            height: 69,
            borderRadius: 65,
            borderWidth: 1,
            borderColor: colors.border_2 || colors.border_1,
            backgroundColor: colors.card_bg_primary,
            paddingHorizontal: 21,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 2,
            elevation: 2,
        },
        activeCard: {
            borderColor: colors.primary, // Equinix Red
            borderWidth: 1.5,
            backgroundColor: colors.background_primary,
        },
        leftSection: {
            flexDirection: "row",
            gap: 24,
            alignItems: 'center',
            flex: 1,
        },
        cardText: {
            fontSize: 20,
            color: colors.contentPrimary,
        },
        activeCardText: {
            color: colors.primary, // Equinix Red
            fontWeight: 'bold',
        },
        cardIcon: {
            width: 24,
            height: 24,
            resizeMode: 'contain',
            tintColor: colors.primaryIconColor,
        },
        activeCardIcon: {
            tintColor: colors.primary, // Equinix Red
        },
        navigateBtn: {
            width: 24,
            height: 24,
            resizeMode: 'contain',
            tintColor: colors.primaryIconColor,
        },
        selectedBtnIcon: {
            width: 24,
            height: 24,
            resizeMode: 'contain',
            tintColor: colors.primary, // Equinix Red
        },
    });