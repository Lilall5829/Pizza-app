"use client";

import { Header } from "@/components/Header";
import OrderItemListItem from "@/components/OrderItemListItem";
import { useAuth } from "@/components/providers";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

// Get order details with items
async function getOrderDetails(id: number) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        *,
        products (*)
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

interface OrderDetailPageProps {
  params: {
    id: string;
  };
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

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const router = useRouter();
  const { session, loading } = useAuth();
  const orderId = parseInt(params.id);

  useEffect(() => {
    if (!loading && !session) {
      redirect("/sign-in");
    }
  }, [session, loading]);

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderDetails(orderId),
    enabled: !isNaN(orderId) && !!session,
  });

  if (loading || isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (isNaN(orderId)) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Invalid Order
            </h1>
            <button
              onClick={() => router.push("/orders")}
              className="text-primary-600 hover:text-primary-800"
            >
              ← Back to Orders
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Order Not Found
            </h1>
            <p className="text-gray-600 mb-4">
              The order you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
            <button
              onClick={() => router.push("/orders")}
              className="text-primary-600 hover:text-primary-800"
            >
              ← Back to Orders
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Calculate order totals
  const subtotal =
    order.order_items?.reduce(
      (sum, item) => sum + item.products.price * item.quantity,
      0
    ) || 0;
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push("/orders")}
          className="text-gray-600 hover:text-gray-800 mb-6 flex items-center"
        >
          ← Back to Orders
        </button>

        <div className="space-y-6">
          {/* Order Header */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Order #{order.id}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Placed on {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[order.status as keyof typeof statusColors]
                  }`}
                >
                  {statusEmojis[order.status as keyof typeof statusEmojis]}{" "}
                  {order.status}
                </span>
              </div>
            </div>

            {/* Order Status Timeline */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Order Status
              </h3>
              <div className="flex items-center space-x-4">
                {(["New", "Cooking", "Delivering", "Delivered"] as const).map(
                  (status, index) => {
                    const isCompleted =
                      ["New", "Cooking", "Delivering", "Delivered"].indexOf(
                        order.status
                      ) >= index;
                    const isCurrent = order.status === status;

                    return (
                      <div key={status} className="flex items-center">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                            isCompleted
                              ? "bg-primary-600 text-white"
                              : "bg-gray-200 text-gray-500"
                          } ${isCurrent ? "ring-4 ring-primary-200" : ""}`}
                        >
                          {statusEmojis[status]}
                        </div>
                        <span
                          className={`ml-2 text-sm ${
                            isCompleted ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {status}
                        </span>
                        {index < 3 && (
                          <div
                            className={`w-8 h-0.5 mx-4 ${
                              isCompleted ? "bg-primary-600" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          {(order.delivery_address || order.customer_name) && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Delivery Information
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Customer Details
                    </h4>
                    <div className="text-sm text-gray-600">
                      {order.customer_name && (
                        <p className="font-medium text-gray-900">
                          {order.customer_name}
                        </p>
                      )}
                      {order.delivery_phone && <p>📞 {order.delivery_phone}</p>}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Delivery Address
                    </h4>
                    <div className="text-sm text-gray-600">
                      {order.delivery_address && (
                        <p>{order.delivery_address}</p>
                      )}
                      {(order.delivery_city ||
                        order.delivery_province ||
                        order.delivery_postal_code) && (
                        <p>
                          {[
                            order.delivery_city,
                            order.delivery_province,
                            order.delivery_postal_code,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                      {order.delivery_country && (
                        <p>{order.delivery_country}</p>
                      )}
                    </div>
                  </div>
                </div>

                {order.delivery_instructions && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Delivery Instructions
                    </h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {order.delivery_instructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
            </div>
            <div className="px-6 py-4">
              {order.order_items && order.order_items.length > 0 ? (
                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <OrderItemListItem key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No items found in this order.</p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Order Summary
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
