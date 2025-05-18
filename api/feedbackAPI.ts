import axios from "axios";
import {API_URL} from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const addNewFeedback = async (data: {
    passengerName: string;
    busRegNo: string | null;
    message: string;
    userId: number;
}) => {
    try {
        const token = await AsyncStorage.getItem("token");

        const response = await axios.post(`${API_URL}/feedback/addNewFeedback`, data,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response;
    }catch(error) {
        console.log(error);
    }
};


export const getAllFeedbacks = async (busRegNo: string, filter?: string | null) => {
    try {
        const token = await AsyncStorage.getItem("token");

        const response = await axios.get(`${API_URL}/feedback/getAllFeedbacks`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                filter: filter,
                busRegNo: busRegNo,
            },
        });

        return response.data;
    } catch (error) {
        console.log(error);
    }
};



