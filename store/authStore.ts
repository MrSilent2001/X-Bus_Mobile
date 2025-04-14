import {create} from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthResponse {
    success: boolean;
    error?: string;
}

interface authType{
    user: any
    token: any
    isLoading: boolean

    register: (email: string, password: string) => Promise<AuthResponse>
}

export const useAuthStore = create<authType>((set) => ({
    user: null,
    token: null,
    isLoading: false,

    register: async(email, password) =>{
        set({isLoading: true})

        try {
            const response = await fetch("http://10.0.2.2:8080/auth/login",{
                method: "POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Something went Wrong");

            await AsyncStorage.setItem("userId", JSON.stringify(data.userId));
            await AsyncStorage.setItem("token", data.accessToken);

            set({token: data.accessToken, user: data.userId, isLoading: false});

            return{
                success: true,
            }
        }catch (error:any){
            set({isLoading: false});
            return {
                success: false,
                error: error.message,
            }
        }
    }
}));