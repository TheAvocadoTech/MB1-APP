import { StyleProp, Text, TextStyle, TouchableOpacity } from 'react-native';
import React from 'react';
import { useStyles } from './TextWithLinkButton.styles';
import { useTheme } from '../../../theme/ThemeProvider';

interface Props {
  text?: string
  textStyle?: StyleProp<TextStyle>
  link?: string
  linkStyle?: StyleProp<TextStyle>
  onPress: () => void
  disabled?: boolean
}

const TextWithLinkButton = ({ text, textStyle, link, linkStyle, onPress, disabled }: Props) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress} disabled={disabled}>
      <Text style={[styles.text, textStyle]}>{text}</Text>
      <Text style={[styles.link, linkStyle]}>{link}</Text>
    </TouchableOpacity>
  );
};

export default TextWithLinkButton;
