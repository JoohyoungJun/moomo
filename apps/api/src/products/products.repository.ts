import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  CreateProductRequestDto,
  ProductImageRequestDto,
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
        images: {
          create: (data.images ?? []).map((image, index) => ({
            url: image.url,
            order: index,
          })),
        },
      },
      include: {
        images: { orderBy: { order: 'asc' } },
      },
    });
  }

  findProductById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
      },
    });
  }

  updateProduct(id: string, data: Omit<UpdateProductRequestDto, 'images'>) {
    return this.prisma.product.update({
      where: { id },
      data,
      include: {
        images: { orderBy: { order: 'asc' } },
      },
    });
  }

  replaceProductImages(id: string, images: ProductImageRequestDto[]) {
    return this.prisma.$transaction(async (tx) => {
      await tx.image.deleteMany({ where: { productId: id } });

      return tx.product.update({
        where: { id },
        data: {
          images: {
            create: images.map((image, index) => ({
              url: image.url,
              order: index,
            })),
          },
        },
        include: {
          images: { orderBy: { order: 'asc' } },
        },
      });
    });
  }

  deleteProduct(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
