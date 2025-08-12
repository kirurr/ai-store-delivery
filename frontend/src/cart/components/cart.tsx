"use client";

import Link from "next/link";
import { useCart } from "../context";

export default function Cart() {
  const { ids, items, error, isPending } =
    useCart();

  if (ids.length === 0) return <Link href="/cart">cart</Link>;
  if (ids.length > 0 && isPending) return <Link href="/cart">loading</Link>;
  if (ids.length > 0 && error) return <div>{error.message}</div>;

  if (!items) return <Link href="/cart">cart</Link>;

  let price: number = 0;
  for (const item of items) {
    price += item.product.price * item.quantity;
  }

  return (
    <Link href="/cart">
      {items.length} {price}
    </Link>
  );
}
