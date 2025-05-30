"use client";

import Button from "@/components/Button";
import { Header } from "@/components/Header";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/components/providers";
import { supabase } from "@/lib/supabase";
import { PizzaSize } from "@/types";
import { Product } from "@/types/database";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];
const sizeMultipliers = {
  S: 0.8,
  M: 1,
  L: 1.3,
  XL: 1.6,
};

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const productId = parseInt(params.id);

  const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");
  const [quantity, setQuantity] = useState(1);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    enabled: !isNaN(productId),
  });

  const handleAddToCart = () => {
    if (!product) return;

    addItem(product, selectedSize, quantity);
  };

  if (isNaN(productId)) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h1>
            <button
              onClick={() => router.push("/menu")}
              className="text-primary-600 hover:text-primary-800"
            >
              ← Back to Menu
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h1>
            <p className="text-gray-600 mb-4">
              The product you're looking for doesn't exist.
            </p>
            <button
              onClick={() => router.push("/menu")}
              className="text-primary-600 hover:text-primary-800"
            >
              ← Back to Menu
            </button>
          </div>
        </main>
      </div>
    );
  }

  const currentPrice = product.price * sizeMultipliers[selectedSize];

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 mb-6 flex items-center"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
            <ProductImage
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-primary-600">
                ${currentPrice.toFixed(2)}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Select Size
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      selectedSize === size
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="font-medium">{size}</div>
                    <div className="text-sm text-gray-500">
                      ${(product.price * sizeMultipliers[size]).toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Quantity
              </h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="text-xl font-medium w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total:</span>
                <span className="text-2xl font-bold text-primary-600">
                  ${(currentPrice * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full"
              text={`Add ${quantity} to Cart`}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
