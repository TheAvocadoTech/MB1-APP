import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/Ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
    StyleSheet.create({
        container: {
            flex: 1,
            gap: 20,
            marginVertical: 29
        },
        cradContainer: {
            flexDirection: "row",
            flexWrap: 'wrap',
            gap: 20,
        },
        washRoomImage: {
            width: 160,
            height: 114
        },
        keyImage: {
            width: 122,
            height: 139
        },
        loadingAreaImage: {
            width: 159,
            height: 151
        },
        nocRoomImage: {
            width: 120,
            height: 120
        }

    });