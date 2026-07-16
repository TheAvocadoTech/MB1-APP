import React, { ReactNode } from 'react';
import { Modal, TouchableOpacity, View, StyleProp, ViewStyle, Image } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import useStyles from './CenterContentModal.styles';
import MSText from '../../Text/MSText';

interface CenterContentModalProps {
    visible: boolean;
    onClose?: () => void;
    icon?: any;
    title?: string;
    description?: string;
    children?: ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    modalContentStyle?: StyleProp<ViewStyle>;
    closeOnBackdropPress?: boolean;
}

const CenterContentModal: React.FC<CenterContentModalProps> = ({
    visible,
    onClose,
    icon,
    title,
    description,
    children,
    containerStyle,
    modalContentStyle,
    closeOnBackdropPress = true,
}) => {
    const { colors } = useTheme();
    const styles = useStyles(colors);

    const handleBackdropPress = () => {
        if (closeOnBackdropPress && onClose) {
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={[styles.overlay, containerStyle]}
                activeOpacity={1}
                onPress={handleBackdropPress}
            >
                <TouchableOpacity
                    style={[styles.modalContainer, modalContentStyle]}
                    activeOpacity={1}
                    onPress={(e) => e.stopPropagation()}
                >
                    {icon && (
                        <View style={styles.iconContainer}>
                            <Image source={icon} />
                        </View>
                    )}

                    {title && (
                        <View style={styles.titleContainer}>
                            {typeof title === 'string' ? (
                                <MSText varient="bold" style={styles.titleText}>{title}</MSText>
                            ) : (
                                title
                            )}
                        </View>
                    )}

                    {description && (
                        <View style={styles.descriptionContainer}>
                            {typeof description === 'string' ? (
                                <MSText varient="regular" style={styles.descriptionText}>{description}</MSText>
                            ) : (
                                description
                            )}
                        </View>
                    )}

                    {children && (
                        <View style={styles.childrenContainer}>
                            {children}
                        </View>
                    )}
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default CenterContentModal;

