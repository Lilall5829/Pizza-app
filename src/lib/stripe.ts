import {supabase} from './supabase';
import {Alert} from 'react-native';
import {initPaymentSheet, presentPaymentSheet} from '@stripe/stripe-react-native';

const fetchPaymentSheetParams = async(amount:number)=>{
    const {data,error} = await supabase.functions.invoke('payment-sheet', {body:{amount},});
    if(data){
        return data;
    }
    Alert.alert('Error fetching payment sheet');
    return {};
};

export const initialisePaymentSheet = async (amount:number) => {
    console.log('Init payment sheet, for', amount);
    const { paymentIntent, publishableKey } = await fetchPaymentSheetParams(amount);
    if (!paymentIntent || !publishableKey) return;
    await initPaymentSheet({
        merchantDisplayName:"Pizza.dev",
        paymentIntentClientSecret:paymentIntent,
        defaultBillingDetails:{
            name:"Lila",
        },
    })
};

export const openPaymentSheet = async () =>{
    const {error} = await presentPaymentSheet();
    if(error){
        Alert.alert(error.message);
        return false;
    }
    return true;
}