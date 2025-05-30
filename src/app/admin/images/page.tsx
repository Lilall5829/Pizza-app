"use client";

import { uploadImage } from "@/lib/imageUpload";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  image: string | null;
  price: number;
}

export default function AdminImagesPage() {
  const { session, loading, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [uploading, setUploading] = useState<number | null>(null);

  // Permission check
  useEffect(() => {
    if (!loading && !session) {
      redirect("/sign-in");
    }
    if (!loading && session && !isAdmin) {
      redirect("/");
    }
  }, [session, loading, isAdmin]);

  // Load all products
  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Failed to load products:", error);
      toast.error("Failed to load products");
    } finally {
      setPageLoading(false);
    }
  };

  // Upload image and update product
  const handleImageUpload = async (product: Product, file: File) => {
    setUploading(product.id);

    try {
      // Generate unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${product.name
        .toLowerCase()
        .replace(/\s+/g, "-")}-${Date.now()}.${fileExt}`;

      // Upload image to Supabase Storage
      const result = await uploadImage(file, fileName);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Update product image URL in database
      const { error } = await supabase
        .from("products")
        .update({ image: result.url })
        .eq("id", product.id);

      if (error) throw error;

      // Update local state
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, image: result.url } : p))
      );

      toast.success(`${product.name} image uploaded successfully!`);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(
        `${product.name} upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setUploading(null);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Show loading during permission validation
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Verifying permissions...</div>
      </div>
    );
  }

  // Don't show content if permission validation fails
  if (!session || !isAdmin) {
    return null;
  }

  // Page data loading
  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          🖼️ Product Image Management
        </h1>

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="font-semibold text-blue-800 mb-2">📋 Instructions:</h2>
          <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
            <li>Click "Choose Image" button to select local image file</li>
            <li>Supports PNG, JPG, WebP formats, maximum 50MB</li>
            <li>
              Image will be automatically uploaded to cloud and replace existing
              image
            </li>
            <li>Recommended image size: at least 500x500 pixels</li>
          </ul>
        </div>

        {/* Product grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50"
            >
              {/* Product image preview */}
              <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden relative">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📷</div>
                      <div className="text-sm">No Image</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Product info */}
              <div className="mb-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {product.name}
                </h3>
                <p className="text-green-600 font-medium">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">ID: {product.id}</p>
              </div>

              {/* Upload button */}
              <div className="space-y-2">
                {uploading === product.id ? (
                  <div className="text-center py-3">
                    <div className="inline-flex items-center space-x-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                      <span>Uploading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(product, file);
                        }
                      }}
                      className="hidden"
                      id={`file-${product.id}`}
                    />
                    <label
                      htmlFor={`file-${product.id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg cursor-pointer transition-colors text-center block font-medium"
                    >
                      {product.image ? "Replace Image" : "Choose Image"}
                    </label>

                    {/* Current image URL display */}
                    {product.image && (
                      <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded border-l-4 border-green-400">
                        <div className="flex items-center space-x-1">
                          <span className="text-green-600">✓</span>
                          <span>Has Image</span>
                        </div>
                        <div className="mt-1 break-all">
                          {product.image.length > 50
                            ? `${product.image.substring(0, 47)}...`
                            : product.image}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📷</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Please add products first, then you can upload images
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
