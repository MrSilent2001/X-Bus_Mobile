import React from 'react';
import {Image, Text, View} from 'react-native';
import {images} from "@/constants";
import CustomButton from "@/components/customButton";
import {router} from "expo-router";

const PaymentFailure = () => {

    return(
        <View className="flex-1 bg-white justify-center items-center p-6">
            <Image
                source={images.failure}
                className="w-72 h-64"
                resizeMode="contain"
            />

            <View className="flex flex-col items-center p-6 gap-10">
                <Text className="mt-6 text-3xl font-bold text-red-600 text-center">
                    Reservation Failed!
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
}

export default PaymentFailure;