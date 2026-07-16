import { Dimensions, Image } from "react-native";
const { width: screenWidth } = Dimensions.get('window');

export const getResizeImageHeight = (uri: any, excludeWidth: number) => {
    const { width, height } = Image.resolveAssetSource(uri);

    const newHeight = (height / width) * (screenWidth - excludeWidth);

    return newHeight;
}