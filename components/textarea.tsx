import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';

interface TextAreaProps extends TextInputProps {
    label?: string;
    error?: string;
    rows: number;
}

const TextArea: React.FC<TextAreaProps> = ({ label, error, className, rows, ...rest }) => {
    return (
        <View className="my-2">
            <TextInput
                multiline
                numberOfLines={rows}
                textAlignVertical="top"
                scrollEnabled
                className={`border rounded-xl p-3 text-base min-h-[200px] bg-white ${
                    error ? 'border-red-500' : 'border-gray-400'
                } ${className}`}
                {...rest}
            />
            {error && <Text className="mt-1 text-red-500 text-sm">{error}</Text>}
        </View>
    );
};

export default TextArea;
