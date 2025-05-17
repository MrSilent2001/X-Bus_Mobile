import axios from "axios";
import {API_URL} from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getReservedSeats = async (date: string, scheduleId: string | null) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const params ={ date: date, scheduleId: scheduleId };

        const response = await axios.get(`${API_URL}/reservation/getReservedSeats`,{
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