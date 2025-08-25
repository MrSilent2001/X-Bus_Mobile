import api from '@/util/apiInterceptor';
import {User} from "@/types/type";
import {PaymentIntent} from "@stripe/stripe-react-native";

export const fetchPaymentSheetParams = async (busFare: number, selectedSchedule: string, selectedDate: Date, user: User | null)=> {
    const response = await api.post(`/payment/payment-sheet`,{
        user: user,
        amount: busFare,
        scheduleId: selectedSchedule,
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : null,
    });
    const { paymentIntent} = await response.data;

    return {
        paymentIntent
    };
}

export const savePaymentToDatabase = async (paymentIntent: string) => {
    try {
        const response = await api.post('/payment/save-payment', {
            data: paymentIntent
        });

        return response;
    } catch (error) {
        console.log("Failed to save payment:", error);
    }
};


