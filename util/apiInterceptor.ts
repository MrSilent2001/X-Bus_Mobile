import axios from 'axios';
import {API_URL} from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error?.response?.status;
        const originalRequest = error?.config || {};

        if (status === 401 && !originalRequest._handled401) {
            originalRequest._handled401 = true;
            // Clear credentials once to stop further unauthorized requests attaching stale token
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userId');
            return Promise.reject({ message: 'Unauthorized', status: 401 });
        }

        const message = error?.response?.data?.message || error.message || 'Request failed';
        return Promise.reject({ message, status });
    }
);

export default api;