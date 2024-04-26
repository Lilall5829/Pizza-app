import {supabase} from './supabase';
import {Alert} from 'react-native';
import {initPaymentSheet, presentPaymentSheet} from '@stripe/stripe-react-native';
import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from '@supabase/supabase-js'

const fetchPaymentSheetParams = async(amount:number)=>{
    const {data, error} = await supabase.functions.invoke('payment-sheet', {body:{amount},});
    if (error instanceof FunctionsHttpError) {
        const errorMessage = await error.context.json()
        console.log('Function returned an error', errorMessage)
      } else if (error instanceof FunctionsRelayError) {
        console.log('Relay error:', error.message)
      } else if (error instanceof FunctionsFetchError) {
        console.log('Fetch error:', error.message)
      }
    if(data){
        return data;
    }
    Alert.alert('Error fetching payment sheet');
    return {};
};

export const initialisePaymentSheet = async (amount:number) => {
    console.log('Init payment sheet, for', amount);
    const { paymentIntent, publishableKey, customer, ephemeralKey } = await fetchPaymentSheetParams(amount);
    console.log(paymentIntent, publishableKey);
    
    if (!paymentIntent || !publishableKey) return;
    const result = await initPaymentSheet({
        merchantDisplayName:"Pizza.dev",
        paymentIntentClientSecret:paymentIntent,
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
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