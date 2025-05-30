"use client";

import AddressSelector from "@/components/AddressSelector";
import { Header } from "@/components/Header";
import { useAuth } from "@/components/providers";
import { useCart } from "@/providers/CartProvider";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

interface DeliveryInfo {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  instructions?: string;
}

export default function CheckoutPage() {
  const { session, loading } = useAuth();
  const { items, total, checkout } = useCart();
  const [selectedAddress, setSelectedAddress] = useState<DeliveryInfo | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!loading && !session) {
      redirect("/sign-in");
    }
  }, [session, loading]);

  useEffect(() => {
    // If cart is empty, redirect to cart page
    if (!loading && items.length === 0) {
      redirect("/cart");
    }
  }, [items, loading]);

  const handleAddressSelected = (address: DeliveryInfo) => {
    setSelectedAddress(address);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      return;
    }

    setIsProcessing(true);
    try {
      await checkout(selectedAddress);
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const deliveryFee = 2.99;
  const finalTotal = total + deliveryFee;

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

  if (!session || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Address Selection */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              {!selectedAddress ? (
                <AddressSelector
                  onAddressSelected={handleAddressSelected}
                  onCancel={() => redirect("/cart")}
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Delivery Address Confirmed
                    </h3>
                    <button
                      onClick={() => setSelectedAddress(null)}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Change Address
                    </button>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <span className="text-green-600">✓</span>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">
                          {selectedAddress.customerName}
                        </p>
                        <p className="text-gray-600">
                          📞 {selectedAddress.phone}
                        </p>
                        <p className="text-gray-600">
                          {selectedAddress.address}
                        </p>
                        <p className="text-gray-600">
                          {[
                            selectedAddress.city,
                            selectedAddress.province,
                            selectedAddress.postalCode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        <p className="text-gray-600">
                          {selectedAddress.country}
                        </p>
                        {selectedAddress.instructions && (
                          <p className="text-gray-600 text-sm mt-2">
                            <strong>Instructions:</strong>{" "}
                            {selectedAddress.instructions}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🍕</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <div className="bg-white rounded-lg shadow p-6">
              <button
                onClick={handlePlaceOrder}
                disabled={!selectedAddress || isProcessing}
                className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
                  selectedAddress && !isProcessing
                    ? "bg-primary-600 hover:bg-primary-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {isProcessing
                  ? "Processing..."
                  : selectedAddress
                  ? `Place Order - $${finalTotal.toFixed(2)}`
                  : "Please select delivery address"}
              </button>

              {selectedAddress && !isProcessing && (
                <p className="text-sm text-gray-600 text-center mt-3">
                  You will be redirected to payment processing
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
