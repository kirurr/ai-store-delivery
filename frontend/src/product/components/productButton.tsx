"use client";

import { useCart } from "@/cart/context";

export default function ProductButton({ id }: { id: number }) {
  const { addProduct, productsIdsMap, changeProductQuantity, removeProduct } =
    useCart();

  const currentProduct = productsIdsMap.get(id);
  if (!currentProduct)
    return <button onClick={() => addProduct(id)}>add to cart</button>;

  return (
    <div>
      <button
        onClick={() => {
          if (currentProduct.quantity == 1) removeProduct(id);
          else changeProductQuantity(id, -1);
        }}
      >
        -
      </button>
      {currentProduct.quantity}
      <button onClick={() => changeProductQuantity(id, 1)}>+</button>
    </div>
  );
}
