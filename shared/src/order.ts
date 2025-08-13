import { StrapiProduct } from "./product";
import { StrapiUser } from "./user";

export type StrapiOrder = {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  orderStatus: string;
  commentary: string | null;
  address: string;
  user: StrapiUser;
  order_items: StrapiOrderItem[];
};

export type StrapiOrderItem = {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  price: number;
  quantity: number;
	product: StrapiProduct
};

export type CreateOrderInput = {
  userDocumentId: string;
  items: CreateOrderInputItem[];
  address: string;
  commentary?: string;
};

export type CreateOrderInputItem = {
  documentId: string;
  quantity: number;
  price: number;
};
