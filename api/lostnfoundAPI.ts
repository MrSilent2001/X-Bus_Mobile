import api from '@/util/apiInterceptor';
import {LostnFoundData} from "@/types/type";

export const addNewItem = async (formData: LostnFoundData, description: string, userId: string) => {
    try {
        const data = {
            ...formData,
            userId: Number(userId),
            description: description,
        };
        const response = await api.post(`api/lostnfound/create`, data);
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getAllLostItems = async ( dateFilter: string | null) => {
    try {
        const response = await api.get(`api/lostnfound/getAllLostItems`, {
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
        const response = await api.get(`api/lostnfound/getAllFoundItems`, {
            params: {
                filter: dateFilter,
            },
        });

        return response.data;
    } catch (error) {
        console.log(error);
    }
};



