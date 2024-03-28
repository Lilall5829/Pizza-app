import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { InsertTables } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export const useAdminOrderList = ({archived=false}) => {
    const statuses = archived ? ['Delivered'] : ['New', 'Cooking','Delivering'];
    return useQuery({
        // The queryKey must be unique for each query. If two queries have the same queryKey, react-query will consider them the same and will try to fetch and cache the data only once for both.
            queryKey: ["orders", {archived}],
            queryFn: async () => {
              const { data, error } = await supabase.from("orders").select("*").in('status', statuses);
              if (error) {
                console.log(error);
                
                throw new Error(error.message);
              }
              return data;
            },
  });
}

export const useMyOrderList = () => {
    const {session} = useAuth();
    const id = session?.user.id;
    return useQuery({
            queryKey: ["orders", {userId: id}],
            queryFn: async () => {
              if(!id) return null;

              const { data, error } = await supabase.from("orders").select("*").eq('user_id',id);
              if (error) {
                throw new Error(error.message);
              }
              return data;
            },
  });
}

export const useOrderDetails = (id:number) =>{
    return useQuery({
        queryKey: ['orders', id],
        queryFn: async () => {
          const { data, error } = await supabase.from('orders').select('*').eq('id',id).single();
          if (error) {
            throw new Error(error.message);
          }
          return data;
        },
      });
}

export const useInsertOrder = () =>{
    const queryClient = useQueryClient();
    const {session} = useAuth();
    const userId = session?.user.id;
    return useMutation({
      async mutationFn(data:InsertTables<'orders'>){
       const {error, data: newProduct} = await supabase.from('orders').insert({...data, user_id: userId}).select()
        .single();
  
        if (error) {
          throw new Error(error.message);
        }
        return newProduct;
      },
      // show new item immediately
      async onSuccess(){
      await queryClient.invalidateQueries(['orders']);
      },
    });
  }