import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/Ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
    StyleSheet.create({
        container: {
            flex: 1,
            height: 199,
            borderWidth: 1,
            borderRadius: 11,
            backgroundColor: colors.background_primary,
            borderColor: "#B4B4B44D ",
            padding: 28,
            overflow: 'hidden'
        },
        title: {
            fontSize: 22,
            lineHeight: 18,
        },
        circle: {
            width: 273,
            height: 273,
            borderRadius: 273,
            backgroundColor: "#FEF4F5",
            alignSelf: "flex-end",
            position: "absolute",
            right: -60,
            bottom: -120
        },
        absoluteImage: {
            position: "absolute",
            top: 20,
            right: 70
        }
    });