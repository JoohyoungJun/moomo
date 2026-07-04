import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProductsRepository } from './products.repository';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [ProductsService, ProductsRepository],
  controllers: [ProductsController],
})
export class ProductsModule {}
