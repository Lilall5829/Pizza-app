"use client";

import AdminAuth from "@/components/AdminAuth";
import { Header } from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/database";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ProductFormData {
  name: string;
  price: number;
  image?: string;
}

// Get product by ID
async function getProduct(id: number): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Update product
async function updateProduct(id: number, data: ProductFormData) {
  const { data: product, error } = await supabase
    .from("products")
    .update({
      name: data.name,
      price: data.price,
      image: data.image || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return product;
}

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const productId = parseInt(params.id);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    image: "",
  });

  // Fetch product data
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    enabled: !isNaN(productId),
  });

  // Update form data when product is loaded
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        image: product.image || "",
      });
    }
  }, [product]);

  const updateMutation = useMutation({
    mutationFn: (data: ProductFormData) => updateProduct(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      toast.success("Product updated successfully!");
      router.push("/admin/menu");
    },
    onError: (error) => {
      console.error("Update failed:", error);
      toast.error("Failed to update product, please try again");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (formData.price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    updateMutation.mutate(formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  if (isNaN(productId)) {
    return (
      <AdminAuth>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Invalid Product ID
              </h1>
              <button
                onClick={() => router.push("/admin/menu")}
                className="text-primary-600 hover:text-primary-800"
              >
                ← Back to Menu Management
              </button>
            </div>
          </main>
        </div>
      </AdminAuth>
    );
  }

  if (isLoading) {
    return (
      <AdminAuth>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          </main>
        </div>
      </AdminAuth>
    );
  }

  if (error) {
    return (
      <AdminAuth>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Product Not Found
              </h1>
              <p className="text-gray-600 mb-4">
                The product you're trying to edit doesn't exist.
              </p>
              <button
                onClick={() => router.push("/admin/menu")}
                className="text-primary-600 hover:text-primary-800"
              >
                ← Back to Menu Management
              </button>
            </div>
          </main>
        </div>
      </AdminAuth>
    );
  }

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Product #{productId}
              </h1>
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md transition-colors"
              >
                ← Back
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter product name"
                />
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter price"
                />
              </div>

              {/* Image URL (optional) */}
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-sm text-gray-500">
                  You can also upload images using the Image Management page
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Current Product Info */}
          {product && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Current Product Info
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      <strong>ID:</strong> {product.id}
                    </p>
                    <p>
                      <strong>Original Name:</strong> {product.name}
                    </p>
                    <p>
                      <strong>Original Price:</strong> ${product.price}
                    </p>
                    <p>
                      <strong>Has Image:</strong> {product.image ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminAuth>
  );
}
