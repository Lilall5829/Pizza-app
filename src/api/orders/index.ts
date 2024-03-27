import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export const useAdminOrderList = ({archived=false}) => {
    const statuses = archived ? ['Delivered'] : ['New', 'Cooking','Delivering', 'Delivered'];
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
    if(!id) return null;
    return useQuery({
            queryKey: ["orders", {userId: id}],
            queryFn: async () => {
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
        queryKey: ["orders", id],
        queryFn: async () => {
          const { data, error } = await supabase.from("products").select("*").eq('id',id).single();
          if (error) {
            throw new Error(error.message);
          }
          return data;
        },
      });
}