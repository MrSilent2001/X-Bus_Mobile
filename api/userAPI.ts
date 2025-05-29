import api from '@/util/apiInterceptor';

export const getUserById = async (id: string | null) => {
    try {
        const response = await api.get(`api/user/getUserById`,{
            params: {
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