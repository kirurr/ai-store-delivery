import { StrapiCategory } from "./category";
import { StrapiCompany } from "./company";
import { StrapiImage } from "./image";

export type StrapiProduct = {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  name: string;
  price: number;
  description: string;
  ingredients: string;
  shelfLife: string;
  storageConditions: string;
  energyKcalPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  carbohydratesPer100g: number;
  slug: string;
  categories: Omit<StrapiCategory, "parentCategory">[];
  images: StrapiImage[];
  company: Omit<StrapiCompany, "products">;
};
