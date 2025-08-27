import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import InputField from "@/components/inputField";

interface DatePickerFieldProps {
    date: Date | null;
    setDate: (date: Date) => void;
    label?: string;
    placeholder?: string;
    mode?: 'date' | 'time' | 'datetime';
    disabled?: boolean;
    errorText?: string;
    helperText?: string;
    minimumDate?: Date;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
                                                             date,
                                                             setDate,
                                                             label = 'Date',
                                                             placeholder = 'Select a date',
                                                             mode = 'date',
                                                             disabled,
                                                             errorText,
                                                             helperText,
                                                             minimumDate,
                                                         }) => {
    const [showDate, setShowDate] = useState(false);

    const handleConfirm = (event: any, selectedDate?: Date) => {
        setShowDate(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const formatDate = (date: Date) => {
        return date.toISOString().split("T")[0];
    };

    return (
        <View>
            <TouchableOpacity onPress={() => !disabled && setShowDate(true)} activeOpacity={disabled ? 1 : 0.7}>
                <InputField
                    label={label}
                    placeholder={placeholder}
                    icon="calendar-outline"
                    value={date ? formatDate(date) : ""}
                    editable={false}
                    disabled={disabled}
                    errorText={errorText}
                    helperText={helperText}
                />
            </TouchableOpacity>

            {showDate && (
                <DateTimePicker
                    value={date || new Date()}
                    mode={mode}
                    display="default"
                    onChange={handleConfirm}
                    minimumDate={minimumDate}
                />
            )}
        </View>
    );
};

export default DatePickerField;
