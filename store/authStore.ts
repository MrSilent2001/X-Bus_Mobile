import {create} from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {authType, LoginPayload, User} from "@/types/type";
import {API_URL} from "@/constants/api";
import axios from "axios";

export const useAuthStore = create<authType>((set) => ({
    user: null,
    token: null,
    email: null,
    isLoading: false,

    login: async(payload : LoginPayload) =>{
        set({isLoading: true})

        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                identifier: payload.identifier,
                password: payload.password
            });

            if (response.status === 200) {
                await AsyncStorage.setItem("userId", JSON.stringify(response.data.userId));
                await AsyncStorage.setItem("token", response.data.accessToken);

                set({token: response.data.accessToken, user: response.data.userId, isLoading: false});
            }

            return{success: true}

        }catch (error:any){
            set({isLoading: false});
            return {
                success: false,
                error: error.message,
            }
        }
    },

    signup: async (payload: User) => {
        set({ isLoading: true });

        try {
            const response = await axios.post(`${API_URL}/auth/signup`, {
                name: payload.name,
                nic: payload.nic,
                contactNo: '',
                email: payload.email,
                password: payload.password,
                confirmPassword: payload.confirmPassword,
                role: payload.role,
                profilePicture: payload.profilePicture
            });

            if (response.status === 200) {
                console.log("SignUp Successful:");
            }

            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            };
        } finally {
            set({ isLoading: false });
        }
    },

    checkAuth: async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const userJSON = await AsyncStorage.getItem("userId");
            const user = userJSON ? JSON.parse(userJSON) : null;

            set({user, token});

        }catch (error:any){
            console.log("Auth Check Failed:", error);
        }
    },

    logout: async () => {
        const token = await AsyncStorage.removeItem("token");
        const user = await AsyncStorage.removeItem("userId");

        set({user: null, token: null, email: null})
    }
}));