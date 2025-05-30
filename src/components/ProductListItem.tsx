import { useCart } from "@/providers/CartProvider";
import { Product } from "@/types/database";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ProductImage from "./ProductImage";

type ProductListItemProps = {
  product: Product;
};

const ProductListItem = ({ product }: ProductListItemProps) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem(product, "M", 1); // Default size M, quantity 1
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="group relative">
      <Link href={`/menu/${product.id}`} className="block">
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <div className="relative w-full aspect-square mb-3">
            <ProductImage
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
          <p className="text-primary-500 font-bold text-xl">${product.price}</p>
        </div>
      </Link>

      {/* Quick Add Button */}
      <button
        onClick={handleQuickAdd}
        disabled={isAdding}
        className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
          isAdding
            ? "bg-green-500 text-white"
            : "bg-primary-600 hover:bg-primary-700 text-white opacity-0 group-hover:opacity-100"
        }`}
      >
        {isAdding ? "✓" : <Plus className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default ProductListItem;
