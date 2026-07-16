import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/Ui/colors/colors.types';

const useStyles = (colors: ColorsType) => StyleSheet.create({
    container: {
        height: 52,
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        flexDirection: 'row'
    },
    containerDisabled: {
        backgroundColor: colors.disabledPrimaryButton,
    },
    title: {
        fontSize: 16,
        color: colors.primaryCtaText,
        lineHeight: 25,
        textAlign: 'center',
    },
    titleDisabled: {
        opacity: 0.4,
    },
});

export default useStyles;