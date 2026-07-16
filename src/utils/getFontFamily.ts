import { FontFamilies } from "../constants/Ui/fonts/FontFamilies";

export const getFontFamily = (
    weight: 'regular' | 'medium' | 'semiBold' | 'bold',
) => {

    return FontFamilies[weight];
};