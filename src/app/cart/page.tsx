"use client";

import Button from "@/components/Button";
import CartListItem from "@/components/CartListItem";
import { Header } from "@/components/Header";
import { useAuth } from "@/components/providers";
import { useCart } from "@/providers/CartProvider";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CartPage() {
  const { items, updateQuantity, total } = useCart();
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      redirect("/sign-in");
    }
  }, [session, loading]);

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      return;
    }
    router.push("/checkout");
  };

  if (loading) {
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-8">
              <span className="text-6xl">🛒</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Add some delicious pizzas to your cart to get started!
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Cart Items ({items.length})
                  </h2>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <CartListItem key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg sticky top-4">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Order Summary
                  </h2>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery</span>
                      <span>$2.99</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>${(total + 2.99).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleProceedToCheckout}
                    disabled={items.length === 0}
                    className="w-full"
                    text="Proceed to Checkout"
                  />

                  <div className="mt-4 text-center">
                    <Link
                      href="/menu"
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
