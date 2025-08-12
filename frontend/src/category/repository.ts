import { ApiResponse } from "@/types";
import {
  NextJSError,
  StrapiCategory,
  StrapiCollectionResponse,
  StrapiErrorResponse,
  StrapiProduct,
} from "@shared";

export async function getCategoryPageBySlug(slug: string): Promise<
  ApiResponse<{
    category: StrapiCategory;
    products: StrapiCollectionResponse<StrapiProduct>;
  }>
> {
  const gatewayUrl = process.env["GATEWAY_URL"];
  if (!gatewayUrl) throw Error("No GATEWAY_URL env");

  try {
    const response = await fetch(gatewayUrl + `categories/${slug}`);

    if (response.status == 500) {
      throw new Error(`Failed to fetch category by slug ${slug}`);
    }

    if (!response.ok) {
      const error = (await response.json()) as NextJSError;
      throw new Error(error.message);
    }

    const category = (await response.json()) as {
      category: StrapiCategory;
      products: StrapiCollectionResponse<StrapiProduct>;
    };

    return {
      data: category,
      status: true,
    };
  } catch (error: any) {
    console.error("getCategoryPageBySlug", error.message);
    return { status: false, message: error.message };
  }
}
