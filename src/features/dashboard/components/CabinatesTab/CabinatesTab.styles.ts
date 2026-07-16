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
            borderColor: colors.border_1,
            color: colors.card_bg_primary,
            paddingHorizontal: 21,
            flexDirection: 'row',
            alignItems: 'center'
        },
        leftSection: {
            flexDirection: "row",
            gap: 24,
            // justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            // backgroundColor: 'green'
        },
        navigateBtn: {
            width: 20,
            height: 20
        },
    });