import { Text, TextProps } from 'react-native'
import React, { ReactNode } from 'react'
import { getFontFamily } from '../../utils/getFontFamily'

interface props extends TextProps {
    children?: ReactNode,
    fontSize?: number,
    varient?: "regular" | "medium" | "semiBold" | "bold",
}

const MSText = ({ children, fontSize = 14, varient = "regular", style, ...rest }: props) => {
    return (
        <Text style={[{ fontSize, fontFamily: getFontFamily(varient) }, style]} {...rest}>{children}</Text>
    )
}

export default MSText

// const styles = StyleSheet.create({

// })