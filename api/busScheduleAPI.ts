import api from '@/util/apiInterceptor';
import {BusSchedule} from "@/types/type";

export const getAllBusSchedules = async (date?: string, route?: string) => {
    try {
        const params: { date?: string; route?: string } = {};

        if (date) {
            params.date = date;
        }

        if (route) {
            params.route = route;
        }
        const response = await api.get(`api/schedule/getAllSchedules`,{
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
        const params ={ date: date, route: route };

        const response = await api.get(`api/schedule/getDailyRouteSchedule`,{
            params: params
        });

        if (response.status === 200) {
            return response.data;
        }

    }catch (error){
        console.log(error);
    }
}

export const getSchedulesByBusId = async (id: string | null) => {
    try {
        const response = await api.get(`api/schedule/getSchedulesByBusId`,{
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
        const response = await api.post(`api/schedule/newSchedule`, data);

        if (response.status === 200) {
            return response.data;
        }
    }catch(error) {
        console.log(error);
    }
}