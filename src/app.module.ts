import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { StoreModule } from './store/store.module';
import { CategoryModule } from './category/category.module';
import { ConfigModule } from '@nestjs/config';
import { CommentsService } from './comments/comments.service';
import { CommentsController } from './comments/comments.controller';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    PrismaModule,
    AuthModule,
    StoreModule,
    CommentsModule,
  ],
    CategoryModule],
  controllers: [AppController, CommentsController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    CommentsService,
  ],
})
export class AppModule {}
