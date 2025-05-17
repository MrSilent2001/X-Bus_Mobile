import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import InputField from "@/components/inputField";

interface TimePickerFieldProps {
    time: Date | null;
    setTime: (time: Date) => void;
    label?: string;
    placeholder?: string;
}

const TimePickerField: React.FC<TimePickerFieldProps> = ({
                                                             time,
                                                             setTime,
                                                             label = 'Time',
                                                             placeholder = 'Select a time',
                                                         }) => {
    const [showTime, setShowTime] = useState(false);

    const handleConfirm = (event: any, selectedTime?: Date) => {
        setShowTime(false);
        if (selectedTime) {
            setTime(selectedTime);
        }
    };

    const formatTime = (time: Date) => {
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View>
            <TouchableOpacity onPress={() => setShowTime(true)}>
                <InputField
                    label={label}
                    placeholder={placeholder}
                    icon="time-outline"
                    value={time ? formatTime(time) : ""}
                    editable={false}
                />
            </TouchableOpacity>

            {showTime && (
                <DateTimePicker
                    value={time || new Date()}
                    mode="time"
                    display="default"
                    onChange={handleConfirm}
                />
            )}
        </View>
    );
};

export default TimePickerField;