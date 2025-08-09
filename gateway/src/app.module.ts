import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StrapiModule } from './strapi/strapi.module';

@Module({
  imports: [AuthModule, StrapiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
