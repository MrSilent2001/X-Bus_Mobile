import React from 'react';
import { Image, View, Text } from 'react-native';
import { images } from "@/constants";
import { router } from "expo-router";
import CustomButton from "@/components/customButton";

const PaymentSuccess = () => {
    return (
        <View className="flex-1 bg-white justify-center items-center p-6">
            <Image
                source={images.success}
                className="w-72 h-64"
                resizeMode="contain"
            />

            <View className="flex flex-col items-center p-6 gap-10">
                <Text className="mt-6 text-3xl font-bold text-green-600 text-center">
                    Reservation Successful!
                </Text>

                <CustomButton
                    title="Close"
                    onPress={() => {
                        router.push("/(passenger)/(tabs)/home");
                    }}
                    className="w-40 mt-8"
                />
            </View>
        </View>
    );
};

export default PaymentSuccess;
