import { Product } from "@/types/database";
import Link from "next/link";
import RemoteImage from "./RemoteImage";

type ProductListItemProps = {
  product: Product;
};

export const defaultPizzaImage =
  "https://p16-flow-sign-va.ciciai.com/ocean-cloud-tos-us/e07c014119634c93be31ff19afbc4149.png~tplv-6bxrjdptv7-image.png?rk3s=18ea6f23&x-expires=1742920030&x-signature=rO03rYWUGHlGKyVnD2SsaNj0Bvk%3D";

const ProductListItem = ({ product }: ProductListItemProps) => {
  return (
    <Link href={`/menu/${product.id}`} className="block">
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative w-full aspect-square mb-3">
          <RemoteImage
            path={product.image}
            fallback={defaultPizzaImage}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-primary-500 font-bold text-xl">${product.price}</p>
      </div>
    </Link>
  );
};

export default ProductListItem;
