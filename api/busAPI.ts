import api from '@/util/apiInterceptor';

export const getBusById = async (userId: string | null) => {
    try {
        const response = await api.get(`api/bus/getBusById`,{
            params:{
                userId
            }
        });

        if (response.status === 200) {
            return response.data;
        }
    }catch(error) {
        console.log(error);
    }
}

export const getBusRoutes = async () => {
    try {
        const response = await api.get(`api/bus/getBusRoutes`);

        if (response.status === 200) {
            return response.data;
        }
    }catch(error) {
        console.log(error);
    }
}


export const getBusRegNo = async () => {
    try {
        const response = await api.get(`api/bus/getBusRegNo`);

        if (response.status === 200) {
            return response.data;
        }
    }catch(error) {
        console.log(error);
    }
}