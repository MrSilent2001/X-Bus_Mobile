import axios from "axios";
import {API_URL} from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

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


export const getDailyRouteSchedules = async (date: Date | null, route: string | null) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const params ={ date: date, route: route };

        const response = await axios.get(`${API_URL}/schedule/getDailyRouteSchedule`,{
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: params
        });

        if (response.status === 200) {
            return response.data;
        }

    }catch (error){
        console.log(error);
    }
}