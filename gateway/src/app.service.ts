import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  StrapiCategory,
  StrapiCollectionResponse,
  StrapiErrorResponse,
} from '@shared';

@Injectable()
export class AppService {
  private readonly CMS_URL = 'http://cms:1337/';

  async getCategories(): Promise<StrapiCollectionResponse<StrapiCategory>> {
    const categoriesResponse = await fetch(
      `${this.CMS_URL}api/categories?populate=*`,
    );

    if (categoriesResponse.status === 500) {
      throw new InternalServerErrorException('CMS service unavailable');
    }

    if (!categoriesResponse.ok) {
      const data = (await categoriesResponse.json()) as StrapiErrorResponse;
      throw new HttpException(data.error.message, data.error.status);
    }

    const categories =
      (await categoriesResponse.json()) as StrapiCollectionResponse<StrapiCategory>;
    return categories;
  }
}
