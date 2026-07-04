import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  CreateProductRequestDto,
  UpdateProductRequestDto,
} from './dto/products-requset.dto';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createProduct(data: CreateProductRequestDto) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
      },
    });
  }

  findProductById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  updateProduct(id: string, data: UpdateProductRequestDto) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }
}
