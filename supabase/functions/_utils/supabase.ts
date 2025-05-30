import { createClient } from 'npm:@supabase/supabase-js@2';

import { stripe } from "./stripe.ts";
export const createOrRetrieveProfile = async (req: Request) => {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );
    console.log(req.headers);
     
    // Now we can get the session or user object
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    console.log("This is: ", user);
    
		if (!user) throw new Error('No user found');
    
    const {data: profile, error} = await supabaseClient.from("profiles").select('*').eq('id',user.id).single();
    if(error || !profile){
            throw new Error('Profile not found');
    }
    console.log(profile);
    
    if(profile.stripe_customer_id){
            return profile.stripe_customer_id;
    }

    const customer = await stripe.customers.create({
        email:user.email,
        metadata:{uid:user.id},
    });
    console.log(`New customer "${customer.id}" created for user "${profile.id}"`);

    await supabaseClient.from('profiles').update({stripe_customer_id:customer.id}).eq('id', profile.id);
    return customer.id;    
};