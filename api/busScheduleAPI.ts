import axios from "axios";
import {API_URL} from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {BusSchedule} from "@/types/type";

export const getAllBusSchedules = async (date?: string, route?: string) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const params: { date?: string; route?: string } = {};

        if (date) {
            params.date = date;
        }

        if (route) {
            params.route = route;
        }
        const response = await axios.get(`${API_URL}/schedule/getAllSchedules`,{
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: params
        });

        if (response.status === 200) {
            return response.data;
        }
    }catch(error) {
        console.log(error);
    }
}

export const getSchedulesByBusId = async (id: string | null) => {
    try {
        const token = await AsyncStorage.getItem("token");

        const response = await axios.get(`${API_URL}/schedule/getSchedulesByBusId`,{
            headers: {
                Authorization: `Bearer ${token}`
            },
            params:{
                id: id
            }
        });

        if (response.status === 200) {
            return response.data;
        }
    }catch(error) {
        console.log(error);
    }
}


export const addNewSchedule = async (data: BusSchedule) => {
    try {
        const token = await AsyncStorage.getItem("token");

        const response = await axios.post(`${API_URL}/schedule/newSchedule`, data,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            return response.data;
        }
    }catch(error) {
        console.log(error);
    }
}