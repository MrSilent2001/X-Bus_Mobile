import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import InputField from "@/components/inputField";

interface DatePickerFieldProps {
    date: Date | null;
    setDate: (date: Date) => void;
    label?: string;
    placeholder?: string;
    mode?: 'date' | 'time' | 'datetime';
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
                                                             date,
                                                             setDate,
                                                             label = 'Date',
                                                             placeholder = 'Select a date',
                                                             mode = 'date',
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
            <TouchableOpacity onPress={() => setShowDate(true)}>
                <InputField
                    label={label}
                    placeholder={placeholder}
                    icon="calendar-outline"
                    value={date ? formatDate(date) : ""}
                    editable={false}
                />
            </TouchableOpacity>

            {showDate && (
                <DateTimePicker
                    value={date || new Date()}
                    mode={mode}
                    display="default"
                    onChange={handleConfirm}
                />
            )}
        </View>
    );
};

export default DatePickerField;
