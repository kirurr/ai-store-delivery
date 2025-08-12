"use client";

import { getProductsByIdArray } from "@/product/repository";
import { StrapiProduct } from "@shared";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";

type CartContextType = {
  removeProduct: (id: number) => void;
  addProduct: (id: number) => void;
  changeProductQuantity: (id: number, quantity: number) => void;
  items: ItemsType;
  isPending: boolean;
  error: Error | null;
  ids: number[];
	productsIdsMap: Map<number, CartItemType>
};

type ItemsType = Array<{ product: StrapiProduct } & CartItemType> | undefined;

type CartItemType = { quantity: number; order: number };
type CartMapType = Map<number, CartItemType>;

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be usued within a CartProvider");
  }
  return context;
}

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [productsIdsMap, setProductsIdsMap] = useState<CartMapType>(
    new Map<number, CartItemType>(),
  );
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const localStorageData = localStorage.getItem("cart");
    if (localStorageData) {
      try {
        setProductsIdsMap(new Map(JSON.parse(localStorageData)));
      } catch (err) {
        console.error("Failed to parse cart data", err);
      }
    }
    setIsLoaded(true);
  }, []);

  const ids = Array.from(productsIdsMap.keys());

  const { isPending, error, data } = useQuery({
    queryKey: ["cart", ids],
    queryFn: () => getProductsByIdArray(ids),
    enabled: isLoaded && ids.length > 0,
  });

  let items: ItemsType = [];
  if (data) {
    if (data.status === false) {
      throw new Error(data.message);
    }

    items = data.data.map((product) => {
      const productFromMap = productsIdsMap.get(product.id)!;
      return {
        product,
        quantity: productFromMap.quantity,
        order: productFromMap.order,
      };
    });
  }

  function addProduct(id: number): void {
    setProductsIdsMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(id, {
        quantity: 1,
        order: Array.from(newMap.keys()).length + 1,
      });

      localStorage.setItem("cart", JSON.stringify([...newMap]));

      return newMap;
    });
  }

  function removeProduct(id: number): void {
    setProductsIdsMap((prev) => {
      const newMap = new Map(prev);
      if (!newMap.has(id)) return newMap;
      newMap.delete(id);

      localStorage.setItem("cart", JSON.stringify([...newMap]));

      return newMap;
    });
  }

  function changeProductQuantity(id: number, quantity: number): void {
    setProductsIdsMap((prev) => {
      const newMap = new Map(prev);
      if (!newMap.has(id)) return newMap;
      const item = newMap.get(id)!;
      const newQuantity = item.quantity + quantity;
      newMap.set(id, { ...item, quantity: newQuantity <= 1 ? 1 : newQuantity });
      localStorage.setItem("cart", JSON.stringify([...newMap]));

      return newMap;
    });
  }

  return (
    <CartContext
      value={{
        addProduct,
        removeProduct,
        changeProductQuantity,
        items,
        isPending,
        error,
        ids,
				productsIdsMap
      }}
    >
      {children}
    </CartContext>
  );
}
