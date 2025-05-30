"use client";

import { useMyOrderList } from "@/api/orders";
import { Header } from "@/components/Header";
import OrderListItem from "@/components/OrderListItem";
import { useAuth } from "@/components/providers";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function OrdersPage() {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      redirect("/sign-in");
    }
  }, [session, loading]);

  const { data: orders, isLoading: ordersLoading, error } = useMyOrderList();

  if (loading || ordersLoading) {
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

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-600">
              Failed to load orders. Please try again.
            </p>
          </div>
        )}

        {orders && orders.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start browsing our menu to place your first order!
            </p>
            <a
              href="/menu"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Browse Menu
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders?.map((order) => (
              <OrderListItem key={order.id} order={order} baseUrl="/orders" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
