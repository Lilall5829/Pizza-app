// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import {stripe} from "../_utils/stripe.ts";
console.log("Hello from Functions!")

Deno.serve(async (req) => {
  try{
    const { amount } = await req.json();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency:'usd'
    })
  
  const res = {
    paymentIntent: paymentIntent.client_secret,
    publishableKey: Deno.env.get('EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  }
  
    return new Response(
      JSON.stringify(res),
      { headers: { "Content-Type": "application/json" } },
    )
  }catch(error){
    return new Response(JSON.stringify(error),{
      headers:{'Content-Type':'application/json'},
      status:400,
    })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  Use the following code! not the curl one!!!
  Invoke-WebRequest -Uri 'http://127.0.0.1:54321/functions/v1/payment-sheet' -Method POST `
  -Headers @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
    "Content-Type" = "application/json"
  } `
  -Body '{"amount":"1150"}'


*/
