import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  private readonly CMS_URL = 'http://cms:1337/';
  constructor(private readonly httpService: HttpService) {}

  @Post('signin')
  async proxySignin(@Body() body: any) {
    try {
      const response = await this.httpService.axiosRef.post(
        this.CMS_URL + 'api/auth/local',
        body,
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      } else {
        throw new HttpException(
          'CMS service unavailable',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  @Post('signup')
  async proxySignup(@Body() body: any) {
    try {
      const response = await this.httpService.axiosRef.post(
        this.CMS_URL + 'api/auth/local/register',
        body,
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      } else {
        throw new HttpException(
          'CMS service unavailable',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
