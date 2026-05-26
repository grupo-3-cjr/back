import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

import { UserModule } from './user/user.module';
import { StoreModule } from './store/store.module';
import { CategoryModule } from './category/category.module';
import { CommentsModule } from './comments/comments.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { StoreRatingsModule } from './store-ratings/store-ratings.module';
import { ProductRatingsModule } from './product-ratings/product-ratings.module';
import { ProductModule } from './products/product.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    StoreModule,
    CommentsModule,
    ProductImagesModule,
    CategoryModule
    StoreRatingsModule,
    ProductRatingsModule,
    CategoryModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}