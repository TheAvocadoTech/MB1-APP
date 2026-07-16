import { Image, ImageStyle, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './CommonTabCard.styles';
import { default as Text } from '../../../../components/Text/MSText'

interface IProps {
    title: string,
    imageUri: any,
    imageStyle?: ImageStyle
}

const CommonTabCard = ({ title, imageUri, imageStyle }: IProps) => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    return (
        <View style={styles.container}>
            <Text varient='semiBold' style={styles.title}>{title}</Text>
            <View style={styles.circle}>
                <Image source={imageUri} style={[styles.absoluteImage, imageStyle]} />
            </View>
        </View>
    )
}

export default CommonTabCard
