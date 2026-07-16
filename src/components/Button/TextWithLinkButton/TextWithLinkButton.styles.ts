import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/Ui/colors/colors.types';


export const useStyles = (colors: ColorsType) => StyleSheet.create({
   container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
   },
   text: {
      // fontFamily: FontFamily.POPPINS_MEDIUM,
      fontSize: 16,
      color: colors.contentSecondary,
   },
   link: {
      // fontFamily: FontFamily.POPPINS_MEDIUM,
      fontSize: 16,
      color: colors.primary,
   },
});
