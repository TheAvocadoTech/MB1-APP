import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/Ui/colors/colors.types';

const useStyles = (colors: ColorsType) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        // Note: For blur effect, consider using @react-native-community/blur
        // or @react-native-blur/blur library
    },
    modalContainer: {
        backgroundColor: colors.card_bg_primary,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#007AFF', // Blue border color
        padding: 24,
        paddingTop: 32,
        minWidth: 300,
        maxWidth: '85%',
        alignItems: 'center',
        shadowColor: colors.primaryShadow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    iconContainer: {
        position: 'absolute',
        top: -30,
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.card_bg_primary,
        borderWidth: 1,
        borderColor: '#007AFF',
        zIndex: 1,
    },
    titleContainer: {
        width: '100%',
        marginBottom: 12,
        alignItems: 'center',
    },
    titleText: {
        fontSize: 18,
        color: colors.contentPrimary,
        textAlign: 'center',
        lineHeight: 24,
    },
    descriptionContainer: {
        width: '100%',
        marginBottom: 20,
        alignItems: 'center',
    },
    descriptionText: {
        fontSize: 14,
        color: colors.contentPrimary,
        textAlign: 'center',
        lineHeight: 20,
    },
    childrenContainer: {
        width: '100%',
    },
});

export default useStyles;

