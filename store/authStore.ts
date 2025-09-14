import {create} from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {authType, LoginPayload, User} from "@/types/type";
import {API_URL} from "@/constants/api";
import axios from "axios";

export const useAuthStore = create<authType>((set, get) => ({
    user: null,
    token: null,
    isLoading: false,
    isInitialized: false,

    setUser: (user: User) => set({ user }),

    initializeAuth: async () => {
        try {
            set({ isLoading: true });
            const token = await AsyncStorage.getItem("token");
            const userJSON = await AsyncStorage.getItem("userId");

            if (token && userJSON) {
                const user = JSON.parse(userJSON);
                set({ user, token, isInitialized: true, isLoading: false });
                return { isAuthenticated: true, user, token };
            } else {
                set({ user: null, token: null, isInitialized: true, isLoading: false });
                return { isAuthenticated: false };
            }
        } catch (error: any) {
            console.log("Auth Initialization Failed:", error);
            set({ user: null, token: null, isInitialized: true, isLoading: false });
            return { isAuthenticated: false };
        }
    },

    login: async(payload : LoginPayload) =>{
        set({isLoading: true})

        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                identifier: payload.identifier,
                password: payload.password
            });

            if (response.status === 200) {
                const { accessToken, userId } = response.data;

                // Store authentication data
                await AsyncStorage.setItem("userId", JSON.stringify(userId));
                await AsyncStorage.setItem("token", accessToken);
                await AsyncStorage.setItem("isLoggedIn", "true");

                set({
                    token: accessToken,
                    user: userId,
                    isLoading: false
                });

                return { success: true, user: userId, token: accessToken };
            }

            return { success: false, error: "Login failed" };

        }catch (error:any){
            set({isLoading: false});
            const errorMessage = error.response?.data?.message || error.message || "Login failed";
            return {
                success: false,
                error: errorMessage,
            }
        }
    },

    signup: async (payload: User) => {
        set({ isLoading: true });
        console.log(API_URL)
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
                return { success: true };
            }

            return { success: false, error: "Signup failed" };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Signup failed";
            return {
                success: false,
                error: errorMessage,
            };
        } finally {
            set({ isLoading: false });
        }
    },

    checkAuth: async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const userJSON = await AsyncStorage.getItem("userId");
            const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");

            if (token && userJSON && isLoggedIn === "true") {
                const user = JSON.parse(userJSON);
                set({user, token, isInitialized: true});
                return { isAuthenticated: true, user, token };
            } else {
                set({ isInitialized: true });
                return { isAuthenticated: false };
            }

        }catch (error:any){
            console.log("Auth Check Failed:", error);
            set({ isInitialized: true });
            return { isAuthenticated: false };
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("userId");
            await AsyncStorage.removeItem("isLoggedIn");

            set({user: null, token: null, isInitialized: true});
            return { success: true };
        } catch (error) {
            console.log("Logout Failed:", error);
            return { success: false, error: "Logout failed" };
        }
    },

    clearAuthData: async () => {
        try {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("userId");
            await AsyncStorage.removeItem("isLoggedIn");
            set({user: null, token: null});
        } catch (error) {
            console.log("Clear Auth Data Failed:", error);
        }
    },
}));