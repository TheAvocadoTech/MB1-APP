import { isIOS } from "../../../utils/platformUtil";

export const FontFamilies = {
    regular: isIOS() ? 'InstrumentSans-Regular' : 'InstrumentSansRegular',
    medium: isIOS() ? 'InstrumentSans-Medium' : 'InstrumentSansMedium',
    semiBold: isIOS() ? 'InstrumentSans-SemiBold' : 'InstrumentSansSemiBold',
    bold: isIOS() ? 'InstrumentSans-Bold' : 'InstrumentSansBold',
};