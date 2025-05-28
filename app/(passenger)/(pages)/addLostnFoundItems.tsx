import {Alert, ScrollView, Text, View} from "react-native";
import InputField from "@/components/inputField";
import React, {useEffect, useState} from "react";
import {Feedback, LostnFoundData} from "@/types/type";
import TextArea from "@/components/textarea";
import CustomButton from "@/components/customButton";
import DropdownMenu from "@/components/dropdown";
import {getBusRegNo} from "@/api/busAPI";
import {addNewFeedback} from "@/api/feedbackAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DatePickerField from "@/components/datepicker";
import TimePickerField from "@/components/timepicker";
import {addNewItem} from "@/api/lostnfoundAPI";

const AddItemInfo = () => {
    const [formData, setFormData] = useState<LostnFoundData>({
        userName: '',
        contactNo:'',
        date: '',
        time: '',
        status: ''
    });
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const statusOptions = [
        { label: "Lost", value: "Lost" },
        { label: "Found", value: "Found" }
    ];
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);

    const handleBlur = () => {
        if (description.trim() === '') {
            setError('Description is required.');
        } else {
            setError('');
        }
    };

    const handleSubmit = async () => {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
            Alert.alert("Error", "User not logged in.");
            return;
        }

        if (!selectedStatus) {
            Alert.alert("Error", "Please select a status.");
            return;
        }

        const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
        const formattedTime = selectedTime
            ? `${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}:00`
            : '';

        const dataToSend: LostnFoundData = {
            ...formData,
            status: selectedStatus,
            date: formattedDate,
            time: formattedTime,
        };

        try {
            const response: any = await addNewItem(dataToSend, description, userId);
            if (response?.status === 201) {
                Alert.alert("Success", "Your request has been submitted successfully!");
                setFormData({
                    userName: '',
                    contactNo: '',
                    date: '',
                    time: '',
                    status: ''
                });
                setSelectedStatus(null);
                setSelectedDate(null);
                setSelectedTime(null);
                setDescription('');
                setError('');
            }
        } catch (error) {
            console.log(error);
        }
    };


    return(
        <ScrollView className="mx-5 my-5">
            <Text className="text-2xl font-bold text-center my-3">Lost & Found Item Info.</Text>

            <View className="my-2">
                <Text className="text-lg font-JakartaSemiBold mx-2">Name</Text>
                <InputField
                    label="Email"
                    placeholder="Enter your name"
                    icon="person-outline"
                    value={formData.userName}
                    onChangeText={(value) => setFormData({...formData, userName: value})}
                    keyboardType="default"
                />
            </View>

            <View className="my-2">
                <Text className="text-lg font-JakartaSemiBold mx-2">Contact no.</Text>
                <InputField
                    label="Email"
                    placeholder="Enter your contact No."
                    icon="call-outline"
                    value={formData.contactNo}
                    onChangeText={(value) => setFormData({...formData, contactNo: value})}
                    keyboardType="numeric"
                />
            </View>

            <View className="my-2">
                <Text className="text-lg font-JakartaSemiBold mx-2 mb-3">Type</Text>
                <DropdownMenu
                    placeholder="Choose the Type"
                    options={statusOptions}
                    selectedValue={selectedStatus}
                    onSelect={(value) => setSelectedStatus(value)}
                    zIndex={2000}
                    open={dropdownOpen}
                    setOpen={setDropdownOpen}
                />
            </View>

            <View className="my-2">
                <Text className="text-lg font-JakartaSemiBold mx-2">Description</Text>
                <TextArea
                    placeholder="Write your message here..."
                    value={description}
                    onChangeText={setDescription}
                    onBlur={handleBlur}
                    error={error}
                    className="text-gray-800"
                    rows={10}
                />
            </View>

            <View className="my-2">
                <Text className="ml-3">Date (Lost/Found)</Text>
                <DatePickerField
                    date={selectedDate}
                    setDate={setSelectedDate}
                    placeholder="Pick your date"
                    mode="date"
                />
            </View>

            <View className="my-2">
                <Text className="ml-3">Time (Lost/Found)</Text>
                <TimePickerField
                    time={selectedTime}
                    setTime={setSelectedTime}
                />
            </View>

            <View className={"mt-5"}>
                <CustomButton
                    title="Submit"
                    onPress={handleSubmit}
                />
            </View>
        </ScrollView>
    );
}

export default AddItemInfo;