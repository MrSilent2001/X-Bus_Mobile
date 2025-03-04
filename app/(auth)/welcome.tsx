import {Image, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import Swiper from "react-native-swiper";
import {useRef, useState} from "react";
import {welcome} from "@/constants";
import CustomButton from "@/components/customButton";

const Welcome = () =>{

    const swiperRef = useRef<Swiper>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const isLastSlide = activeIndex === welcome.length - 1;

    return(
        <SafeAreaView className="flex h-full items-center justify-between bg-white mb-20">
            <TouchableOpacity onPress={()=>{
                router.replace("/(auth)/signup");
            }}
            className="w-full flex items-end justify-end p-5"
            >
                <Text className="text-black text-md font-JakartaBold">Skip</Text>
            </TouchableOpacity>

            <Swiper
                ref={swiperRef}
                loop={false}
                dot={<View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full"/>}
                activeDot={<View className="w-[32px] h-[4px] mx-1 bg-[#0286FF] rounded-full"/>}
                onIndexChanged={(index) => setActiveIndex(index)}
            >
                {welcome.map((item, index) => (
                    <View key={item.id} className="flex items-center justify-center p-5">
                        <Image
                            source={item.image}
                            className="w-full h-[300px]"
                            resizeMode="contain"
                        />

                        <View className="w-full flex flex-row items-center justify-center mt-10">
                            <Text className="text-black text-3xl text-center font-bold mx-10">{item.title}</Text>
                        </View>

                        <Text className="text-lg font-JakartaSemiBold text-[#858585] text-center mx-10 mt-3">
                            {item.description}
                        </Text>

                    </View>
                ))}
            </Swiper>

            <CustomButton
                title={isLastSlide ? "Get Started" : "Next"}
                onPress={() =>{
                    isLastSlide
                        ? router.replace("/(auth)/signup")
                        : swiperRef.current?.scrollBy(1)
                }}
                className="w-11/12 mb-5"
            />
        </SafeAreaView>
    );
}

export default Welcome;