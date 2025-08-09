"use client";

import { useCart } from "../context";

export default function AddProductToCartButton({ id }: { id: number }) {
  const { addProduct } = useCart();
  return (
    <button
      onClick={() => {
        addProduct(id);
      }}
    >
      add to cart
    </button>
  );
}
