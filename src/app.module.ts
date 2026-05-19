import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

// ISegurança
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

// Módulos de Funcionalidades
import { UserModule } from './user/user.module';
import { StoreModule } from './store/store.module';
import { CategoryModule } from './category/category.module';

// Componentes Base do App
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CommentsService } from './comments/comments.service';
import { CommentsController } from './comments/comments.controller';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Banco de Dados
    PrismaModule,
    // Autenticação
    AuthModule,
    // Entidades do Sistema
    UserModule,
    StoreModule,
    CategoryModule,
  ],
  controllers: [AppController],
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
