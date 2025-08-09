import { StrapiProduct } from "./product";

export type StrapiCategory = {
  id: 16;
  documentId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  slug: string;
  parentCategory: StrapiCategory | null;
	products: StrapiProduct[];
};
