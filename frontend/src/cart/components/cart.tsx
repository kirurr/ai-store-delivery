"use client";

import { useCart } from "../context";

export default function Cart() {
  const { ids, items, error, isPending, changeProductQuantity, removeProduct } =
    useCart();

  if (ids.length === 0) return <div>cart</div>;
  if (ids.length > 0 && isPending) return <div>loading</div>;
  if (ids.length > 0 && error) return <div>{error.message}</div>;

  if (!items) return <div>cart</div>;

  let price: number = 0;
  for (const item of items) {
    price += item.product.price * item.quantity;
  }

  return (
    <div>
      <ul>
        {items
          .sort((a, b) => a.order - b.order)
          .map((item, i) => (
            <li key={i}>
              <button
                onClick={() => {
                  changeProductQuantity(item.product.id, 1);
                }}
              >
                +
              </button>
              {item.product.name}
              {item.quantity.toString()}
              <button
                onClick={() => {
                  changeProductQuantity(item.product.id, -1);
                }}
                disabled={item.quantity === 1}
              >
                -
              </button>
              <button onClick={() => removeProduct(item.product.id)}>
                remove
              </button>
            </li>
          ))}
      </ul>
      price {price.toString()}
    </div>
  );
}
