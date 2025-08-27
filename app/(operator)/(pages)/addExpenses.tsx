import React, { useState } from "react";
import { Alert, Text, View, Image, TouchableOpacity } from "react-native";
import InputField from "@/components/inputField";
import TextArea from "@/components/textarea";
import CustomButton from "@/components/customButton";
import * as ImagePicker from "expo-image-picker";
import { createExpenses } from "@/api/paymentAPI";

const AddExpenses = () => {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [proof, setProof] = useState<{ uri: string; name: string; type: string } | null>(null);
    const [error, setError] = useState("");

    // Pick image from library
    const handleImagePick = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets.length > 0) {
                const asset = result.assets[0];
                setProof({
                    uri: asset.uri,
                    name: asset.uri.split("/").pop() || "proof.jpg",
                    type: "image/jpeg",
                });
            }
        } catch (err) {
            console.log("Error picking image: ", err);
        }
    };

    // Submit expense
    const handleSubmit = async () => {
        if (!description.trim() || !amount.trim() || !proof) {
            Alert.alert("Error", "Please fill all fields and upload proof.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("description", description);
            formData.append("amount", amount);
            formData.append("proof", {
                uri: proof.uri,
                name: proof.name,
                type: proof.type,
            } as any);

            const response = await createExpenses(formData);

            if (response.status === 201) {
                Alert.alert("Success", "Expense submitted successfully!");
                setDescription("");
                setAmount("");
                setProof(null);
                setError("");
            } else {
                Alert.alert("Error", "Failed to submit expense.");
            }
        } catch (err) {
            console.log(err);
            Alert.alert("Error", "Something went wrong while submitting.");
        }
    };

    const handleCancel = () => {
        setDescription("");
        setAmount("");
        setProof(null);
        setError("");
    };

    return (
        <View className="mx-5 my-5">
            <Text className="text-2xl font-bold text-center my-3">
                Add New Expense
            </Text>

            {/* Description */}
            <View className="mt-3">
                <Text className="text-lg font-JakartaSemiBold mx-2">Description</Text>
                <TextArea
                    placeholder="Enter expense description"
                    value={description}
                    onChangeText={setDescription}
                    error={error}
                    className="text-gray-800"
                    rows={5}
                />
            </View>

            {/* Amount */}
            <View className="mt-3">
                <Text className="text-lg font-JakartaSemiBold mx-2">Amount</Text>
                <InputField
                    label="Amount"
                    placeholder="Enter amount"
                    icon="cash-outline"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                />
            </View>

            {/* Proof Upload */}
            <View className="mt-3">
                <Text className="text-lg font-JakartaSemiBold mx-2 mb-2">
                    Upload Proof
                </Text>
                <TouchableOpacity
                    onPress={handleImagePick}
                    className="w-full h-40 border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center"
                >
                    {proof ? (
                        <Image
                            source={{ uri: proof.uri }}
                            className="w-full h-full rounded-xl"
                            resizeMode="cover"
                        />
                    ) : (
                        <Text className="text-gray-500">Tap to select image</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Buttons */}
            <View className={"mt-5 flex flex-row justify-between"}>
                <View className="w-[48%]">
                    <CustomButton title="Cancel" onPress={handleCancel} />
                </View>
                <View className="w-[48%]">
                    <CustomButton title="Submit" onPress={handleSubmit} />
                </View>
            </View>
        </View>
    );
};

export default AddExpenses;
