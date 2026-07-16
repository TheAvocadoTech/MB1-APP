import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/Ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: "center",
            backgroundColor: colors.background_primary
        },
        logoContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: 23
        }
    });