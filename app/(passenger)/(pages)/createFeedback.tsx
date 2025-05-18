import {Alert, ScrollView, Text, View} from "react-native";
import InputField from "@/components/inputField";
import React, {useEffect, useState} from "react";
import {Feedback} from "@/types/type";
import TextArea from "@/components/textarea";
import CustomButton from "@/components/customButton";
import DropdownMenu from "@/components/dropdown";
import {getBusRegNo} from "@/api/busAPI";
import {addNewFeedback} from "@/api/feedbackAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateFeedback = () => {
    const [feedback, setFeedback] = useState<Feedback>({
        passengerName: '',
        message:''
    });
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
    const [selectedBus, setSelectedBus] = useState<string | null>(null);

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const response = await getBusRegNo();
                if (response && response.length > 0) {
                    const formattedResponse = response.map((regNo: string) => ({
                        label: regNo,
                        value: regNo,
                    }));
                    setOptions(formattedResponse);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchBuses();
    }, []);
    const handleBlur = () => {
        if (description.trim() === '') {
            setError('Description is required.');
        } else {
            setError('');
        }
    };

    const handleFeedback = async() => {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
            Alert.alert("Error", "User not logged in.");
            return;
        }

        const data = {
            ...feedback,
            userId: Number(userId),
            message: description,
            busRegNo: selectedBus
        }

        try{
            const response: any = await addNewFeedback(formData, description, userId);
            if(response.status === 201) {
                Alert.alert("Success", "Your feedback has been submitted successfully!");

                setFeedback({ passengerName: '', message: '' });
                setSelectedBus(null);
                setDescription('');
                setError('');
            }

        }catch (error){
            console.log(error);
        }
    }

    return(
        <View className="mx-5 my-5">
            <Text className="text-2xl font-bold text-center my-3">Feedback / Complaints</Text>

            <View className="mt-3">
                <Text className="text-lg font-JakartaSemiBold mx-2">Name</Text>
                <InputField
                    label="Email"
                    placeholder="Enter your name"
                    icon="person-outline"
                    value={feedback.passengerName}
                    onChangeText={(value) => setFeedback({...feedback, passengerName: value})}
                    keyboardType="email-address"
                />
            </View>

            <View className="mt-3">
                <Text className="text-lg font-JakartaSemiBold mx-2 mb-3">Bus Reg. No.</Text>
                <DropdownMenu
                    placeholder="Select a bus"
                    options={options}
                    selectedValue={selectedBus}
                    onSelect={(value) => setSelectedBus(value)}
                    zIndex={2000}
                    open={dropdownOpen}
                    setOpen={setDropdownOpen}
                />
            </View>

            <View className="mt-5">
                <Text className="text-lg font-JakartaSemiBold mx-2">Message</Text>
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

            <View className={"mt-5"}>
                <CustomButton
                    title="Send"
                    onPress={handleFeedback}
                />
            </View>
        </View>
    );
}

export default CreateFeedback;