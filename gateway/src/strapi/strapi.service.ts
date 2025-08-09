import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  StrapiCategory,
  StrapiCollectionResponse,
  StrapiErrorResponse,
  StrapiProduct,
  StrapiSingleCollectionResponse,
} from '@shared';

@Injectable()
export class StrapiService {
  private readonly CMS_URL = 'http://cms:1337/';

  async getProductBySlug(slug: string): Promise<StrapiProduct> {
    const response = await fetch(
      this.CMS_URL + `api/products?filters[slug][$eq]=${slug}&populate=*`,
    );

    if (response.status == 500) {
      throw new InternalServerErrorException(
        `Failed to fetch product by slug ${slug}`,
      );
    }

    if (!response.ok) {
      const data = (await response.json()) as StrapiErrorResponse;
      throw new HttpException(data.error.message, data.error.status);
    }

    const data =
      (await response.json()) as StrapiCollectionResponse<StrapiProduct>;

    if ('error' in data) {
      throw new HttpException(data.error.message, data.error.status);
    }

    return data.data[0];
  }

  async getCategoryBySlug(slug: string): Promise<StrapiCategory> {
    const response = await fetch(
      this.CMS_URL + `api/categories?filters[slug][$eq]=${slug}&populate=*`,
    );

    if (response.status == 500) {
      throw new InternalServerErrorException(
        `Failed to fetch category by slug ${slug}`,
      );
    }

    if (!response.ok) {
      const data = (await response.json()) as StrapiErrorResponse;
      throw new HttpException(data.error.message, data.error.status);
    }

    const data =
      (await response.json()) as StrapiCollectionResponse<StrapiCategory>;
    if (!data.data) {
      throw new BadRequestException(`No category with slug ${slug}`);
    }

    return data.data[0];
  }

  async getProductsByCategory(categoryDocumentId: string) {
    const response = await fetch(
      this.CMS_URL +
        `api/products?populate=*&filters[category][documentId][$eq]=${categoryDocumentId}`,
    );

    if (response.status == 500) {
      throw new InternalServerErrorException(
        `Failed to fetch products for category by documentId ${categoryDocumentId}`,
      );
    }

    if (!response.ok) {
      const data = (await response.json()) as StrapiErrorResponse;
      throw new HttpException(data.error.message, data.error.status);
    }

    const products =
      (await response.json()) as StrapiCollectionResponse<StrapiProduct>;

    return products;
  }

  async getProductsByIdArray(
    idArray: number[],
  ): Promise<StrapiCollectionResponse<StrapiProduct>> {
    const params = new URLSearchParams();
    params.append('populate', '*');
    idArray.forEach((id) => params.append('filters[id][$in]', id.toString()));

    const response = await fetch(
      this.CMS_URL + `api/products?` + params.toString(),
    );

    if (response.status == 500) {
      throw new InternalServerErrorException(
        `Failed to fetch products for given ids`,
      );
    }

    if (!response.ok) {
      const data = (await response.json()) as StrapiErrorResponse;
      throw new HttpException(data.error.message, data.error.status);
    }

    const products =
      (await response.json()) as StrapiCollectionResponse<StrapiProduct>;

    return products;
  }
}
