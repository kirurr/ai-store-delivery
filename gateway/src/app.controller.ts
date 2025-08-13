import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { StrapiService } from './strapi/strapi.service';
import {
  StrapiCategory,
  StrapiCollectionResponse,
  StrapiOrder,
  StrapiProduct,
} from '@shared';
import { AuthHeaderGuard } from './auth.guard';
import { CreateOrderDTO } from './dto/createOrder.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly strapiService: StrapiService,
  ) {}

  @Get()
  async proxyMainPage() {
    const categories = await this.appService.getCategories();
    return categories;
  }

  @Get('/categories/:slug')
  async proxyCategoryPage(@Param('slug') slug: string): Promise<{
    category: StrapiCategory;
    products: StrapiCollectionResponse<StrapiProduct>;
  }> {
    const category = await this.strapiService.getCategoryBySlug(slug);
    const products = await this.strapiService.getProductsByCategory(
      category.documentId,
    );

    return {
      category,
      products,
    };
  }

  @Post('/products/cart')
  async proxyProductsForCart(@Body('idArray') idArray: number[]) {
    const products = await this.strapiService.getProductsByIdArray(idArray);
    return products;
  }

  @Get('/products/:slug')
  async proxyProductPage(@Param('slug') slug: string): Promise<StrapiProduct> {
    const product = await this.strapiService.getProductBySlug(slug);
    return product;
  }

  @UseGuards(AuthHeaderGuard)
  @Post('/orders')
  async proxyCreateOrder(
    @Body() createOrderDTO: CreateOrderDTO,
    @Headers('Authorization') authHeader: string,
  ): Promise<StrapiOrder> {
    const token = authHeader.split(' ')[1]!;
    const order = await this.strapiService.createOrder(createOrderDTO, token);
    return order;
  }
}
