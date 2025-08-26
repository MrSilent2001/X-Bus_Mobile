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

export const updateUser = async ( payload: Partial<User>) => {
    try {
        console.log(payload)
        const response = await api.patch(`/user/editUser`, payload);

        if (response.status === 200 || response.status === 204) {
            return response.data;
        }
    } catch (error) {
        console.error("Update user error:", error);
        return null;
    }
};
