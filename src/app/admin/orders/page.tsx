"use client";

import AdminAuth from "@/components/AdminAuth";
import { Header } from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

interface Order {
  id: number;
  user_id: string;
  status: "New" | "Cooking" | "Delivering" | "Delivered";
  total: number;
  created_at: string;
  profiles?: {
    username?: string;
  };
  order_items?: {
    id: number;
    quantity: number;
    products: {
      name: string;
      price: number;
    };
  }[];
}

// Get all orders
async function getAllOrders(): Promise<any[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      profiles(username),
      order_items(
        id,
        quantity,
        products(name, price)
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

// Update order status
async function updateOrderStatus(
  orderId: number,
  status: Order["status"]
): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    throw error;
  }
}

const statusColors = {
  New: "bg-yellow-100 text-yellow-800",
  Cooking: "bg-blue-100 text-blue-800",
  Delivering: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
};

const statusEmojis = {
  New: "🆕",
  Cooking: "👨‍🍳",
  Delivering: "🚚",
  Delivered: "✅",
};

export default function AdminOrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const queryClient = useQueryClient();

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getAllOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: number;
      status: Order["status"];
    }) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated successfully!");
    },
    onError: (error) => {
      console.error("Update failed:", error);
      toast.error("Update failed, please try again");
    },
  });

  const handleStatusUpdate = (orderId: number, status: Order["status"]) => {
    updateStatusMutation.mutate({ orderId, status });
  };

  // Filter orders
  const filteredOrders =
    orders?.filter(
      (order) => selectedStatus === "all" || order.status === selectedStatus
    ) || [];

  // Statistics
  const stats = {
    total: orders?.length || 0,
    new: orders?.filter((o) => o.status === "New").length || 0,
    cooking: orders?.filter((o) => o.status === "Cooking").length || 0,
    delivering: orders?.filter((o) => o.status === "Delivering").length || 0,
    delivered: orders?.filter((o) => o.status === "Delivered").length || 0,
  };

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Order Management
            </h1>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Orders</option>
              <option value="New">🆕 New Orders</option>
              <option value="Cooking">👨‍🍳 Cooking</option>
              <option value="Delivering">🚚 Delivering</option>
              <option value="Delivered">✅ Completed</option>
            </select>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.new}
                  </div>
                  <div className="text-sm text-gray-600">🆕 New Orders</div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.cooking}
                  </div>
                  <div className="text-sm text-gray-600">👨‍🍳 Cooking</div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.delivering}
                  </div>
                  <div className="text-sm text-gray-600">🚚 Delivering</div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.delivered}
                  </div>
                  <div className="text-sm text-gray-600">✅ Completed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Order List */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Failed to load
              </h3>
              <p className="text-gray-600">
                Please check your network connection or try again later
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedStatus === "all"
                  ? "No orders yet"
                  : `No orders with ${selectedStatus} status`}
              </h3>
              <p className="text-gray-600">Orders will appear here</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <li key={order.id}>
                    <div className="px-4 py-4">
                      {/* Order Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              Order #{order.id}
                            </h3>
                            <p className="text-sm text-gray-500">
                              User: {order.profiles?.username || "Unknown User"}{" "}
                              | Time:{" "}
                              {new Date(order.created_at).toLocaleString()}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              statusColors[order.status]
                            }`}
                          >
                            {statusEmojis[order.status]} {order.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            ${order.total.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      {order.order_items && order.order_items.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Order Details:
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {order.order_items.map((item) => (
                              <div
                                key={item.id}
                                className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded"
                              >
                                {item.products.name} x {item.quantity} - $
                                {(item.products.price * item.quantity).toFixed(
                                  2
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Status Update Buttons */}
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          Update Status:
                        </span>
                        {(
                          ["New", "Cooking", "Delivering", "Delivered"] as const
                        ).map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(order.id, status)}
                            disabled={
                              order.status === status ||
                              updateStatusMutation.isPending
                            }
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                              order.status === status
                                ? `${statusColors[status]} cursor-not-allowed`
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {statusEmojis[status]} {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </AdminAuth>
  );
}
