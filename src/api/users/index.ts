import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Get all users/profiles
export const useUserList = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          username,
          group,
          created_at,
          updated_at,
          phone,
          default_address,
          default_city,
          default_province,
          default_postal_code,
          default_country
        `)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

// Get user by ID
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!id,
  });
};

// Update user role
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update({ 
          group: role,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId)
        .select();

      if (error) {
        throw error;
      }

      // Check if any rows were updated
      if (!data || data.length === 0) {
        throw new Error("User not found or you don't have permission to update this user");
      }

      // Return the first (and should be only) updated record
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User role updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update user role");
    },
  });
};

// Delete user (admin only)
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      // First delete the profile record
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (profileError) {
        throw profileError;
      }

      // Note: Deleting from auth.users requires admin privileges
      // This would typically be done via a Supabase Edge Function
      // For now, we'll just delete the profile
      
      return { userId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete user");
    },
  });
};

// Get user statistics
export const useUserStats = () => {
  return useQuery({
    queryKey: ["users", "stats"],
    queryFn: async () => {
      // Get user count by role
      const { data: users, error: usersError } = await supabase
        .from("profiles")
        .select("group");

      if (usersError) {
        throw usersError;
      }

      // Get total orders
      const { count: ordersCount, error: ordersError } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      if (ordersError) {
        throw ordersError;
      }

      const stats = {
        totalUsers: users.length,
        adminUsers: users.filter(u => u.group === "ADMIN").length,
        customerUsers: users.filter(u => u.group !== "ADMIN").length,
        totalOrders: ordersCount || 0,
      };

      return stats;
    },
  });
}; 