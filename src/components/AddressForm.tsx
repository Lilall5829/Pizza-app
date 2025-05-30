"use client";

import Button from "@/components/Button";
import { useState } from "react";

interface AddressFormData {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  instructions?: string;
}

interface AddressFormProps {
  initialData?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => void;
  onCancel?: () => void;
  submitText?: string;
  loading?: boolean;
}

// 加拿大省份列表
const CANADIAN_PROVINCES = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "YT", label: "Yukon" },
];

export default function AddressForm({
  initialData = {},
  onSubmit,
  onCancel,
  submitText = "Save Address",
  loading = false,
}: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    customerName: initialData.customerName || "",
    phone: initialData.phone || "",
    address: initialData.address || "",
    city: initialData.city || "",
    province: initialData.province || "ON",
    postalCode: initialData.postalCode || "",
    country: initialData.country || "Canada",
    instructions: initialData.instructions || "",
  });

  const [errors, setErrors] = useState<Partial<AddressFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<AddressFormData> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    } else if (
      !/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(formData.postalCode)
    ) {
      newErrors.postalCode =
        "Please enter a valid Canadian postal code (e.g., K1A 0A6)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // 清理电话号码格式
      const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, "");
      // 格式化邮政编码
      const cleanPostalCode = formData.postalCode
        .toUpperCase()
        .replace(/\s/g, "");
      const formattedPostalCode =
        cleanPostalCode.length === 6
          ? `${cleanPostalCode.slice(0, 3)} ${cleanPostalCode.slice(3)}`
          : formData.postalCode;

      onSubmit({
        ...formData,
        phone: cleanPhone,
        postalCode: formattedPostalCode,
      });
    }
  };

  const handleInputChange =
    (field: keyof AddressFormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Name */}
      <div>
        <label
          htmlFor="customerName"
          className="block text-sm font-medium text-gray-700"
        >
          Full Name *
        </label>
        <input
          type="text"
          id="customerName"
          value={formData.customerName}
          onChange={handleInputChange("customerName")}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
            errors.customerName ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter your full name"
        />
        {errors.customerName && (
          <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={handleInputChange("phone")}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
            errors.phone ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="(416) 123-4567"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Street Address *
        </label>
        <input
          type="text"
          id="address"
          value={formData.address}
          onChange={handleInputChange("address")}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
            errors.address ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="123 Main Street, Apt 4B"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      {/* City and Province */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City *
          </label>
          <input
            type="text"
            id="city"
            value={formData.city}
            onChange={handleInputChange("city")}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
              errors.city ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Toronto"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="province"
            className="block text-sm font-medium text-gray-700"
          >
            Province *
          </label>
          <select
            id="province"
            value={formData.province}
            onChange={handleInputChange("province")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            {CANADIAN_PROVINCES.map((province) => (
              <option key={province.value} value={province.value}>
                {province.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Postal Code and Country */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-gray-700"
          >
            Postal Code *
          </label>
          <input
            type="text"
            id="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange("postalCode")}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
              errors.postalCode ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="K1A 0A6"
            maxLength={7}
          />
          {errors.postalCode && (
            <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <select
            id="country"
            value={formData.country}
            onChange={handleInputChange("country")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="Canada">Canada</option>
            <option value="United States">United States</option>
          </select>
        </div>
      </div>

      {/* Delivery Instructions */}
      <div>
        <label
          htmlFor="instructions"
          className="block text-sm font-medium text-gray-700"
        >
          Delivery Instructions (Optional)
        </label>
        <textarea
          id="instructions"
          value={formData.instructions}
          onChange={handleInputChange("instructions")}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="e.g., Leave at front door, Ring doorbell, Call when arriving..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1"
          text={loading ? "Saving..." : submitText}
        />
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
            text="Cancel"
          />
        )}
      </div>
    </form>
  );
}
