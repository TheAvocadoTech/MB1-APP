import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/Ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background_primary
        },
        contentContainer: {
            paddingHorizontal: 32,
            paddingVertical: 76
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: 'space-between'
        },
        nameContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: 16
        },
        bar: {
            width: 7,
            height: 84,
            borderRadius: 11,
            backgroundColor: colors.primary
        },
        greet: {
            fontSize: 36,
            lineHeight: 51,
            color: colors.contentTertiary
        },
        name: {
            fontSize: 42,
            lineHeight: 51,
            color: colors.primary
        },
        exitBtn: {
            width: 50,
            height: 50,
            borderRadius: 50,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center'
        },
        labelContainer: {
            marginTop: 12
        },
        labelRegular: {
            fontSize: 20,
            lineHeight: 40,
            color: colors.subtitle
        },
        labelBold: {
            color: colors.contentPrimary
        },
        tabWrapper: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        },
        tabsContainer: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: '#EEEEEE',
            borderRadius: 63,
        },

        rowContainer: {
            flex: 1,
            backgroundColor: colors.background_lightGray,
            paddingHorizontal: 16,
            paddingVertical: 19,
            marginTop: 44
        },
        tab: {
            width: 186,
            height: 60,
            borderRadius: 63,
            backgroundColor: "#EEEEEE",
            justifyContent: "center",
            alignItems: 'center',
        },
        activeTab: {
            backgroundColor: colors.primary
        },
        tabText: {
            color: '#B4B4B4',
            fontSize: 16,
            lineHeight: 18,
        },
        activeTabText: {
            color: colors.primaryCtaText
        },
    });