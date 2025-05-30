// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { stripe } from "../_utils/stripe.ts";
import { createOrRetrieveProfile } from '../_utils/supabase.ts';

console.log("Payment Sheet Function started!")

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    // Parse request body
    const body = await req.json();
    console.log('Request body:', body);
    
    const { amount } = body;
    
    // Validate amount
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      throw new Error('Invalid amount provided');
    }

    console.log(`Processing payment for amount: $${amount / 100}`);

    // Get or create customer
    const customer = await createOrRetrieveProfile(req);
    console.log('Customer ID:', customer);

    // Create ephemeral key for customer
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer },
      { apiVersion: "2020-08-27" }
    );

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      customer: customer,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('Payment Intent created:', paymentIntent.id);

    // Response data
    const responseData = {
      paymentIntent: paymentIntent.client_secret,
      publishableKey: Deno.env.get('EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY') || Deno.env.get('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
      customer: customer,
      ephemeralKey: ephemeralKey.secret,
    };

    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      },
    );

  } catch (error) {
    console.error('Payment sheet error:', error);
    
    const errorResponse = {
      error: error.message || 'Internal server error',
      details: error instanceof Error ? error.stack : String(error),
    };

    return new Response(
      JSON.stringify(errorResponse),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        status: 400,
      }
    );
  }
});

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
