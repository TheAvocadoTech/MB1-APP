import { Image, ImageStyle, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './CommonTabCard.styles';
import { default as Text } from '../../../../components/Text/MSText'

interface IProps {
    title: string,
    imageUri: any,
    imageStyle?: ImageStyle,
    onPress?: () => void
}

const CommonTabCard = ({ title, imageUri, imageStyle, onPress }: IProps) => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.85}>
            <Text varient='semiBold' style={styles.title}>{title}</Text>
            <View style={styles.circle}>
                <Image source={imageUri} style={[styles.absoluteImage, imageStyle]} />
            </View>
        </TouchableOpacity>
    )
}

export default CommonTabCard
