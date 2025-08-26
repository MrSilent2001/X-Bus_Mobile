import api from '@/util/apiInterceptor';
import {User} from "@/types/type";

export const getUserById = async (id: string | null) => {
    try {
        const response = await api.get(`/user/getUserById`,{
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

export const updateUser = async (id: User | null, payload: Partial<User>) => {
    try{
        const response = await api.patch(`/user/updateUser`,
            payload,{
            params: {
                id: id,
            }
        })

        if (response.status === 204) {
            return response.data;
        }
    }catch(error) {
        console.log(error);
    }
}