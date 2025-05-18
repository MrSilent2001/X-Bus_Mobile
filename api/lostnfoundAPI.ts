import axios from "axios";
import {API_URL} from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {LostnFoundData} from "@/types/type";

export const addNewItem = async (formData: LostnFoundData, description: string, userId: string) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const data = {
            ...formData,
            userId: Number(userId),
            description: description,
        };
        const response = await axios.post(`${API_URL}/lostnfound/create`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getAllLostItems = async ( dateFilter: string | null) => {
    try {
        const token = await AsyncStorage.getItem("token");

        const response = await axios.get(`${API_URL}/lostnfound/getAllLostItems`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                filter: dateFilter,
            },
        });

        return response.data;
    } catch (error) {
        console.log(error);
    }
};


export const getAllFoundItems = async ( dateFilter: string | null) => {
    try {
        const token = await AsyncStorage.getItem("token");

        const response = await axios.get(`${API_URL}/lostnfound/getAllFoundItems`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                filter: dateFilter,
            },
        });

        return response.data;
    } catch (error) {
        console.log(error);
    }
};



