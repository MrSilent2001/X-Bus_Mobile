import api from '@/util/apiInterceptor';

export const addNewFeedback = async (data: {
    passengerName: string;
    busRegNo: string | null;
    message: string;
    userId: number;
}) => {
    try {
        const response = await api.post(`api/feedback/addNewFeedback`, data);
        return response;
    }catch(error) {
        console.log(error);
    }
};


export const getAllFeedbacks = async (busRegNo: string, filter?: string | null) => {
    try {
        const response = await api.get(`apiURL}/feedback/getAllFeedbacks`, {
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



