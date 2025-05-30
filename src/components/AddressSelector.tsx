"use client";

import { useAuth } from "@/components/providers";
import { useState } from "react";
import AddressForm from "./AddressForm";

interface AddressData {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  instructions?: string;
}

interface AddressSelectorProps {
  onAddressSelected: (address: AddressData) => void;
  onCancel?: () => void;
}

export default function AddressSelector({
  onAddressSelected,
  onCancel,
}: AddressSelectorProps) {
  const { profile } = useAuth();
  const [mode, setMode] = useState<"select" | "new">("select");

  // 检查用户是否有默认地址
  const hasDefaultAddress = profile?.default_address;

  const handleUseDefaultAddress = () => {
    if (profile) {
      onAddressSelected({
        customerName: profile.full_name || "",
        phone: profile.phone || "",
        address: profile.default_address || "",
        city: profile.default_city || "",
        province: profile.default_province || "ON",
        postalCode: profile.default_postal_code || "",
        country: profile.default_country || "Canada",
        instructions: "",
      });
    }
  };

  const formatAddress = (profile: any) => {
    const parts = [
      profile.default_address,
      profile.default_city,
      profile.default_province,
      profile.default_postal_code,
    ].filter(Boolean);
    return parts.join(", ");
  };

  if (mode === "new") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Enter Delivery Address
          </h3>
          {hasDefaultAddress && (
            <button
              onClick={() => setMode("select")}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              ← Back to address selection
            </button>
          )}
        </div>

        <AddressForm
          initialData={
            profile
              ? {
                  customerName: profile.full_name || "",
                  phone: profile.phone || "",
                  city: profile.default_city || "",
                  province: profile.default_province || "ON",
                  country: profile.default_country || "Canada",
                }
              : {}
          }
          onSubmit={onAddressSelected}
          onCancel={hasDefaultAddress ? () => setMode("select") : onCancel}
          submitText="Use This Address"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        Select Delivery Address
      </h3>

      {hasDefaultAddress ? (
        <div className="space-y-4">
          {/* Default Address Option */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                    Default Address
                  </span>
                </div>
                <p className="font-medium text-gray-900">
                  {profile.full_name || "Your Name"}
                </p>
                <p className="text-gray-600">{formatAddress(profile)}</p>
                {profile.phone && (
                  <p className="text-gray-600">📞 {profile.phone}</p>
                )}
              </div>
              <button
                onClick={handleUseDefaultAddress}
                className="ml-4 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Use This Address
              </button>
            </div>
          </div>

          {/* Add New Address Option */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  ➕ Use a different address
                </p>
                <p className="text-gray-600 text-sm">
                  Enter a new delivery address for this order
                </p>
              </div>
              <button
                onClick={() => setMode("new")}
                className="ml-4 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                Enter New Address
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="mb-4">
            <p className="text-gray-600">
              You don't have a default address saved yet.
            </p>
            <p className="text-gray-600 text-sm">
              Please enter your delivery address to continue.
            </p>
          </div>
          <button
            onClick={() => setMode("new")}
            className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
          >
            Enter Delivery Address
          </button>
        </div>
      )}

      {onCancel && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
}
