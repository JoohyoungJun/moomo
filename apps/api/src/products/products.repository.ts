import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  CreateProductRequestDto,
  ProductImageRequestDto,
  UpdateProductRequestDto,
} from './dto/products-request.dto';

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

  async findAllProducts(skip: number, take: number, search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          images: {
            orderBy: { order: 'asc' },
            take: 1,
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items, total };
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

  async orderProduct(
    userId: string,
    productId: string,
    quantity: number,
    totalPrice: number,
  ) {
    const [product, order] = await Promise.all([
      this.prisma.product.update({
        where: { id: productId },
        data: {
          stock: {
            decrement: quantity,
          },
        },
      }),
      this.prisma.order.create({
        data: {
          userId,
          productId,
          quantity,
          totalPrice,
        },
      }),
    ]);

    return { product, order };
  }

  findOrderById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
    });
  }

  async findOrdersByUserId(userId: string, skip: number, take: number) {
    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            select: {
              name: true,
              price: true,
            },
          },
        },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return { items, total };
  }
}
