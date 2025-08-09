import { ApiResponse } from "@/types";
import { getGatewayUrl } from "@/utils";
import {
  StrapiCollectionResponse,
  StrapiErrorResponse,
  StrapiProduct,
} from "@shared";

export async function getProductBySlug(
  slug: string,
): Promise<ApiResponse<StrapiProduct>> {
  const gatewayUrl = getGatewayUrl();

  try {
    const response = await fetch(`${gatewayUrl}products/${slug}`);
    if (response.status == 500) {
      throw new Error(`Failed to fetch product by id ${slug}`);
    }

    if (!response.ok) {
      const error = (await response.json()) as StrapiErrorResponse;
      throw new Error(error.error.message);
    }

    const category = (await response.json()) as StrapiProduct;

    return {
      status: true,
      data: category,
    };
  } catch (err: any) {
    console.error("error getProductBySlug", err);
    return { status: false, message: err.message };
  }
}

export async function getProductsByIdArray(
  idArray: number[],
): Promise<ApiResponse<StrapiProduct[]>> {
  const gatewayUrl = process.env["NEXT_PUBLIC_GATEWAY_URL"];

  try {
    const response = await fetch(`${gatewayUrl}products/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idArray }),
    });
    if (response.status == 500) {
      throw new Error(`Failed to fetch products`);
    }

    if (!response.ok) {
      const error = (await response.json()) as StrapiErrorResponse;
      throw new Error(error.error.message);
    }

    const products =
      (await response.json()) as StrapiCollectionResponse<StrapiProduct>;

    if ("error" in products) {
      throw new Error(products.error.message);
    }

    return {
      status: true,
      data: products.data,
    };
  } catch (err: any) {
    console.error("error getProductsByIdArray", err);
    return {
      status: false,
      message: err.message,
    };
  }
}
