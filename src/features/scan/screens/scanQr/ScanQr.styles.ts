import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/Ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
    StyleSheet.create({
        serverMan: {
            marginTop: -60
        },
        logoContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: 23,
            justifyContent: "center",
            marginTop: 60,
            marginBottom: 37
        },
        textContainer: {
        },
        inactiveText: {
            fontSize: 16,
            lineHeight: 32,
            textAlign: "center",
            color: colors.contentTertiary
        },
        activeText: {
            color: colors.primary
        },
        spacer: {
            // flex: 1,
            height: 169
        }
    });