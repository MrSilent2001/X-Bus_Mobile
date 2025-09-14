import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    visible: boolean;
    message: string;
    type: ToastType;
    duration?: number;
    onHide: () => void;
}

const Toast: React.FC<ToastProps> = ({
                                         visible,
                                         message,
                                         type,
                                         duration = 3000,
                                         onHide
                                     }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        if (visible) {
            // Show toast
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Hide toast after duration
            const timer = setTimeout(() => {
                hideToast();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onHide();
        });
    };

    const getToastStyle = () => {
        switch (type) {
            case 'success':
                return {
                    backgroundColor: '#10B981',
                    icon: 'checkmark-circle',
                    iconColor: '#FFFFFF',
                };
            case 'error':
                return {
                    backgroundColor: '#EF4444',
                    icon: 'close-circle',
                    iconColor: '#FFFFFF',
                };
            case 'warning':
                return {
                    backgroundColor: '#F59E0B',
                    icon: 'warning',
                    iconColor: '#FFFFFF',
                };
            case 'info':
            default:
                return {
                    backgroundColor: '#3B82F6',
                    icon: 'information-circle',
                    iconColor: '#FFFFFF',
                };
        }
    };

    const toastStyle = getToastStyle();

    if (!visible) return null;

    return (
        <Animated.View
            style={{
                position: 'absolute',
                top: 50,
                left: 16,
                right: 16,
                zIndex: 1000,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
            }}
        >
            <View
                style={{
                    backgroundColor: toastStyle.backgroundColor,
                    borderRadius: 8,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
            >
                <Ionicons
                    name={toastStyle.icon as any}
                    size={24}
                    color={toastStyle.iconColor}
                />
                <Text
                    style={{
                        color: '#FFFFFF',
                        marginLeft: 12,
                        flex: 1,
                        fontSize: 16,
                        fontWeight: '500',
                    }}
                >
                    {message}
                </Text>
                <TouchableOpacity onPress={hideToast}>
                    <Ionicons name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

export default Toast;

