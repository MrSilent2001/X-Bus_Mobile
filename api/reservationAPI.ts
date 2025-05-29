import api from '@/util/apiInterceptor';

export const getReservedSeats = async (date: string, scheduleId: string | null) => {
    try {
        const params ={ date: date, scheduleId: scheduleId };

        const response = await api.get(`api/reservation/getReservedSeats`,{
            params: params
        });

        if (response.status === 200) {
            return response.data;
        }
    }catch(error) {
        console.log(error);
    }
}

export const getReservationsByUserId = async (userId: string) => {
    try{
        const response = await api.get(`api/reservation/getReservationsByUserId`,{
            params:{
                userId: userId
            }
        });

        if (response.status === 200) {
            return response.data;
        }
    }catch (error){
        console.log(error);
    }
}