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
            justifyContent: 'space-between',
            width: '100%',
        },
        nameContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            flex: 1,
            marginRight: 16,
        },
        greetTextWrapper: {
            flex: 1,
        },
        bar: {
            width: 7,
            height: 84,
            borderRadius: 11,
            backgroundColor: colors.primary
        },
        greet: {
            fontSize: 24,
            lineHeight: 30,
            color: colors.contentTertiary
        },
        name: {
            fontSize: 32,
            lineHeight: 38,
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
            // width: 186,
            // height: 60,
            flex:1,
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
        floatingButtonContainer: {
            position: 'absolute',
            bottom: 30,
            left: 20,
            right: 20,
            zIndex: 20,
        },
        floatingButton: {
            height: 65,
            backgroundColor: colors.primary,
            borderRadius: 65,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 8,
        },
        floatingButtonText: {
            color: colors.primaryCtaText,
            fontSize: 18,
            fontWeight: 'bold',
        },
        floatingButtonIcon: {
            width: 24,
            height: 24,
            tintColor: colors.primaryCtaText,
        },
        modalButtons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 16,
            marginTop: 24,
            width: '100%',
        },
        cancelBtn: {
            flex: 1,
            height: 50,
            borderRadius: 25,
            borderWidth: 1,
            borderColor: '#E2D6DA',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
        },
        cancelBtnText: {
            color: '#87848A',
            fontSize: 16,
            fontWeight: '600',
        },
        logoutConfirmBtn: {
            flex: 1,
            height: 50,
            borderRadius: 25,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        logoutConfirmBtnText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600',
        },
        warningOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        warningContainer: {
            width: '85%',
            backgroundColor: colors.background_primary,
            borderRadius: 24,
            paddingHorizontal: 24,
            paddingBottom: 24,
            paddingTop: 56,
            alignItems: 'center',
            position: 'relative',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 10,
        },
        circleTimerContainer: {
            position: 'absolute',
            top: -50,
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colors.background_primary,
            borderWidth: 1.5,
            borderColor: '#E2D6DA',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
        },
        circleTimerText: {
            fontSize: 24,
            color: colors.contentPrimary,
        },
        warningTitle: {
            fontSize: 20,
            color: colors.contentPrimary,
            textAlign: 'center',
            marginBottom: 8,
        },
        warningDescription: {
            fontSize: 14,
            color: colors.contentTertiary || '#87848A',
            textAlign: 'center',
            lineHeight: 20,
            marginBottom: 20,
        },
        warningQrContainer: {
            width: 180,
            height: 180,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#EDEDED',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            marginBottom: 24,
            padding: 8,
        },
        warningQrImage: {
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
        },
        warningButtonsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 16,
            width: '100%',
        },
        warningCancelButton: {
            flex: 1,
            height: 50,
            borderRadius: 8,
            backgroundColor: '#F3F3F3',
            justifyContent: 'center',
            alignItems: 'center',
        },
        warningCancelButtonText: {
            color: '#2A2A2A',
            fontSize: 14,
            fontWeight: '600',
        },
        warningExtendButton: {
            flex: 1,
            height: 50,
            borderRadius: 8,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        warningExtendButtonText: {
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: '600',
        },
    });