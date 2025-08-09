import { StrapiProduct } from "./product";

export type StrapiCompany = {
  id: number;
  documentId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  products: Omit<StrapiProduct, "images" | "company" | "categories">[];
};
