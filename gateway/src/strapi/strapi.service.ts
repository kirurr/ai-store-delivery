import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateOrderInput,
  StrapiCategory,
  StrapiCollectionResponse,
  StrapiErrorResponse,
  StrapiOrder,
  StrapiOrderItem,
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

    if (data.data.length == 0) {
      throw new BadRequestException(`Product by ${slug} is not found`);
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

  async rollbackOrderItems(authToken: string, ids: string[]) {
    await Promise.all(
      ids.map(async (id) => await this.deleteOrderItem(authToken, id)),
    );
  }

  async createOrder(
    data: CreateOrderInput,
    authToken: string,
  ): Promise<StrapiOrder> {
    const orderItemsIds: string[] = [];

    await Promise.all(
      data.items.map(async (item) => {
        const documentId = await this.createOrderItem(
          authToken,
          item.documentId,
          item.price,
          item.quantity,
        );
        orderItemsIds.push(documentId);
      }),
    ).catch(async (err) => {
      await this.rollbackOrderItems(authToken, orderItemsIds);
      throw err;
    });

    try {
			//TODO: create populate string to get all info on order
      const response = await fetch(this.CMS_URL + 'api/orders?populate=*', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + authToken,
        },
        body: JSON.stringify({
          data: {
            address: data.address,
            user: {
              connect: [data.userDocumentId],
            },
            order_items: {
              connect: orderItemsIds,
            },
            commentary: data.commentary || undefined,
          },
        }),
      });

      if (!response.ok) {
        if (response.status === 500) {
          throw new InternalServerErrorException(
            'unkown error while creating order',
          );
        }
        const error = (await response.json()) as StrapiErrorResponse;
        throw new HttpException(error.error.message, error.error.status);
      }

      const order =
        (await response.json()) as StrapiSingleCollectionResponse<StrapiOrder>;

      if ('error' in order) {
        throw new HttpException(order.error.message, order.error.status);
      }

      return order.data;
    } catch (err) {
      await this.rollbackOrderItems(authToken, orderItemsIds);
      throw err;
    }
  }

  async deleteOrderItem(authToken: string, documentId: string): Promise<void> {
    const response = await fetch(
      this.CMS_URL + 'api/order-items/' + documentId,
      {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 500) {
        throw new InternalServerErrorException(
          'unkown error while deleting order item',
        );
      }
    }
  }

  async createOrderItem(
    authToken: string,
    productDocumentId: string,
    price: number,
    quantity: number,
  ): Promise<string> {
    const response = await fetch(this.CMS_URL + 'api/order-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + authToken,
      },
      body: JSON.stringify({
        data: {
          product: {
            connect: [productDocumentId],
          },
          price,
          quantity,
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 500) {
        throw new InternalServerErrorException(
          'unkown error while creating order item',
        );
      }
      const error = (await response.json()) as StrapiErrorResponse;
      throw new HttpException(error.error.message, error.error.status);
    }
    const orderItem =
      (await response.json()) as StrapiSingleCollectionResponse<StrapiOrderItem>;

    if ('error' in orderItem) {
      throw new HttpException(orderItem.error.message, orderItem.error.status);
    }

    return orderItem.data.documentId;
  }
}
