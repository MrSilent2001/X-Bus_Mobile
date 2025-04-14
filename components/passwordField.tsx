import {
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {useState} from "react";
import {InputFieldProps} from "@/types/type";
import {Ionicons} from "@expo/vector-icons";

const PasswordField = ({
                           labelStyle,
                           label,
                           icon,
                           secureTextEntry = false,
                           containerStyle,
                           inputStyle,
                           iconStyle,
                           ...props
                       }: InputFieldProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    return (
        <View className="my-2 w-full">
            <View
                className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border-2 ${
                    isFocused ? 'border-danger-300' : 'border-neutral-300'
                } ${containerStyle}`}
            >
                <Ionicons
                    name={icon}
                    size={20}
                    color={isFocused ? '#E74C3C' : '#A0A0A0'}
                    style={{marginLeft: 16, ...iconStyle}}
                />

                <TextInput
                    className={`rounded-full p-4 font-JakartaSemiBold text-[15px] flex-1 ${inputStyle} text-left`}
                    secureTextEntry={!showPassword}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />

                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}
                                  className="p-3 focus:? '#E74C3C' : '#A0A0A0'">
                    <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color={isFocused ? '#E74C3C' : '#A0A0A0'}
                        style={{marginRight: 5, ...iconStyle}}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PasswordField;
