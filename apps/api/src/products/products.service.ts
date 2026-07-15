import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { UsersRepository } from '@/users/users.repository';
import {
  CreateProductRequestDto,
  MAX_PRODUCT_DESCRIPTION_LENGTH,
  MAX_PRODUCT_NAME_LENGTH,
  MAX_PRODUCT_ORDER_QUANTITY,
  MAX_PRODUCT_PRICE,
  MAX_PRODUCT_STOCK,
  MIN_PRODUCT_PRICE,
  MIN_PRODUCT_STOCK,
  MIN_STRING_LENGTH,
  ProductsQueryDto,
  UpdateProductRequestDto,
} from './dto/products-request.dto';
import { OrderStatus } from '@prisma/client';
import {
  DeleteOrderResponseDto,
  OrderProductResponseDto,
  ProductResponseDto,
  UpdateOrderResponseDto,
} from './dto/products-response.dto';
import { AppException } from '@/common/exception/app.exception';
import {
  COMMON_ERRORS,
  ORDERS_ERRORS,
  PRODUCTS_ERRORS,
  USERS_ERRORS,
} from '@/common/constants/errors';
import {
  buildPaginationResponse,
  getPaginationParams,
} from '@/common/pagination/pagination.util';
import { PaginationQueryDto } from '@/common/pagination/pagination-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createProduct(
    userId: string,
    data: CreateProductRequestDto,
  ): Promise<ProductResponseDto> {
    const user = await this.usersRepository.findById(userId);

    if (user === null) {
      throw new AppException(USERS_ERRORS.USER_NOT_FOUND);
    }

    if (!user.isAdmin) {
      throw new AppException(COMMON_ERRORS.FORBIDDEN);
    }

    if (data.price <= MIN_PRODUCT_PRICE || data.price > MAX_PRODUCT_PRICE) {
      throw new AppException(PRODUCTS_ERRORS.PRODUCT_PRICE_INVALID);
    }

    if (data.stock < MIN_PRODUCT_STOCK || data.stock > MAX_PRODUCT_STOCK) {
      throw new AppException(PRODUCTS_ERRORS.PRODUCT_STOCK_INVALID);
    }

    const trimmedNameLength = data.name.trim().length;
    const trimmedDescriptionLength = data.description.trim().length;

    if (
      trimmedNameLength < MIN_STRING_LENGTH ||
      trimmedNameLength > MAX_PRODUCT_NAME_LENGTH
    ) {
      throw new AppException(PRODUCTS_ERRORS.PRODUCT_NAME_INVALID);
    }

    if (
      trimmedDescriptionLength < MIN_STRING_LENGTH ||
      trimmedDescriptionLength > MAX_PRODUCT_DESCRIPTION_LENGTH
    ) {
      throw new AppException(PRODUCTS_ERRORS.PRODUCT_DESCRIPTION_INVALID);
    }

    const product = await this.productsRepository.createProduct(data);

    return product;
  }

  async getAllProducts(query: ProductsQueryDto) {
    const { page, pageSize, skip, take } = getPaginationParams(query);
    const search = query.search?.trim() || undefined;

    const { items, total } = await this.productsRepository.findAllProducts(
      skip,
      take,
      search,
    );

    const mappedItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      stock: item.stock,
      createdAt: item.createdAt,
      thumbnailImage: item.images[0]?.url,
    }));

    return buildPaginationResponse(mappedItems, total, page, pageSize);
  }

  async getProductById(id: string): Promise<ProductResponseDto> {
    const product = await this.productsRepository.findProductById(id);

    if (product === null) {
      throw new AppException(PRODUCTS_ERRORS.PRODUCT_NOT_FOUND);
    }

    return product;
  }

  async updateProduct(
    userId: string,
    productId: string,
    data: UpdateProductRequestDto,
  ): Promise<ProductResponseDto> {
    const user = await this.usersRepository.findById(userId);

    if (user === null) {
      throw new AppException(USERS_ERRORS.USER_NOT_FOUND);
    }

    if (!user.isAdmin) {
      throw new AppException(COMMON_ERRORS.FORBIDDEN);
    }

    const { name, description, price, stock, images } = data;

    if (
      name !== undefined &&
      (name.trim().length < MIN_STRING_LENGTH ||
        name.trim().length > MAX_PRODUCT_NAME_LENGTH)
    ) {
      throw new AppException(PRODUCTS_ERRORS.PRODUCT_NAME_INVALID);
    }

    if (
      description !== undefined &&
      (description.trim().length < MIN_STRING_LENGTH ||
        description.trim().length > MAX_PRODUCT_DESCRIPTION_LENGTH)
    ) {
      throw new AppException(PRODUCTS_ERRORS.PRODUCT_DESCRIPTION_INVALID);
    }

    if (
      price !== undefined &&
      (price <= MIN_PRODUCT_PRICE || price > MAX_PRODUCT_PRICE)
    ) {
      throw new AppException(PRODUCTS_ERRORS.PRODUCT_PRICE_INVALID);
    }

    if (
      stock !== undefined &&
      (stock < MIN_PRODUCT_STOCK || stock > MAX_PRODUCT_STOCK)
    ) {
      throw new AppException(PRODUCTS_ERRORS.PRODUCT_STOCK_INVALID);
    }

    if (
      name === undefined &&
      description === undefined &&
      price === undefined &&
      stock === undefined &&
      images === undefined
    ) {
      throw new AppException(PRODUCTS_ERRORS.PRODUCT_UPDATE_EMPTY);
    }

    const product = await this.productsRepository.findProductById(productId);

    if (product === null) {
      throw new AppException(PRODUCTS_ERRORS.PRODUCT_NOT_FOUND);
    }

    const productData: Omit<UpdateProductRequestDto, 'images'> = {};

    if (name !== undefined) productData.name = name;
    if (description !== undefined) productData.description = description;
    if (price !== undefined) productData.price = price;
    if (stock !== undefined) productData.stock = stock;

    if (images !== undefined) {
      if (Object.keys(productData).length > 0) {
        await this.productsRepository.updateProduct(productId, productData);
      }
      return this.productsRepository.replaceProductImages(productId, images);
    }

    if (Object.keys(productData).length > 0) {
      return this.productsRepository.updateProduct(productId, productData);
    }

    return product;
  }

  async deleteProduct(
    userId: string,
    productId: string,
  ): Promise<{ message: string }> {
    const user = await this.usersRepository.findById(userId);

    if (user === null) {
      throw new AppException(USERS_ERRORS.USER_NOT_FOUND);
    }

    if (!user.isAdmin) {
      throw new AppException(COMMON_ERRORS.FORBIDDEN);
    }

    const product = await this.productsRepository.findProductById(productId);

    if (product === null) {
      throw new AppException(PRODUCTS_ERRORS.PRODUCT_NOT_FOUND);
    }

    await this.productsRepository.deleteProduct(productId);

    return {
      message: '상품 삭제 성공',
    };
  }

  async orderProduct(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<OrderProductResponseDto> {
    const user = await this.usersRepository.findById(userId);

    if (user === null) {
      throw new AppException(USERS_ERRORS.USER_NOT_FOUND);
    }

    const product = await this.productsRepository.findProductById(productId);

    if (product === null) {
      throw new AppException(PRODUCTS_ERRORS.PRODUCT_NOT_FOUND);
    }

    if (product.stock < quantity || product.stock <= 0) {
      throw new AppException(PRODUCTS_ERRORS.PRODUCT_STOCK_INVALID);
    }

    if (quantity > MAX_PRODUCT_ORDER_QUANTITY) {
      throw new AppException(PRODUCTS_ERRORS.PRODUCT_ORDER_QUANTITY_INVALID);
    }

    const totalPrice = product.price * quantity;

    const { product: productAfterOrder, order } =
      await this.productsRepository.orderProduct(
        userId,
        productId,
        quantity,
        totalPrice,
      );

    return {
      id: order.id,
      userId: order.userId,
      productId: productAfterOrder.id,
      quantity: order.quantity,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
    };
  }

  async getAllOrders(userId: string, query: PaginationQueryDto) {
    const user = await this.usersRepository.findById(userId);

    if (user === null) {
      throw new AppException(USERS_ERRORS.USER_NOT_FOUND);
    }

    if (!user.isAdmin) {
      throw new AppException(COMMON_ERRORS.FORBIDDEN);
    }

    const { page, pageSize, skip, take } = getPaginationParams(query);

    const { items, total } = await this.productsRepository.findAllOrders(
      skip,
      take,
    );

    const mappedItems = items.map((item) => ({
      id: item.id,
      userId: item.userId,
      userNickname: item.user.nickname,
      productId: item.productId,
      productName: item.product.name,
      productPrice: item.product.price,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      status: item.status,
      createdAt: item.createdAt,
    }));

    return buildPaginationResponse(mappedItems, total, page, pageSize);
  }

  async getOrdersByUserId(userId: string, query: PaginationQueryDto) {
    const { page, pageSize, skip, take } = getPaginationParams(query);

    const { items, total } = await this.productsRepository.findOrdersByUserId(
      userId,
      skip,
      take,
    );

    const mappedItems = items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      productPrice: item.product.price,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      status: item.status,
      createdAt: item.createdAt,
    }));

    return buildPaginationResponse(mappedItems, total, page, pageSize);
  }

  async updateOrderStatus(
    userId: string,
    orderId: string,
    status: OrderStatus,
  ): Promise<UpdateOrderResponseDto> {
    const user = await this.usersRepository.findById(userId);

    if (user === null) {
      throw new AppException(USERS_ERRORS.USER_NOT_FOUND);
    }

    if (!user.isAdmin) {
      throw new AppException(COMMON_ERRORS.FORBIDDEN);
    }

    const order = await this.productsRepository.findOrderById(orderId);

    if (order === null) {
      throw new AppException(ORDERS_ERRORS.ORDER_NOT_FOUND);
    }

    const updated = await this.productsRepository.updateOrderStatus(
      orderId,
      status,
    );

    return {
      id: updated.id,
      status: updated.status,
      updatedAt: updated.updatedAt,
    };
  }

  async deleteOrder(
    userId: string,
    orderId: string,
  ): Promise<DeleteOrderResponseDto> {
    const user = await this.usersRepository.findById(userId);

    if (user === null) {
      throw new AppException(USERS_ERRORS.USER_NOT_FOUND);
    }

    if (!user.isAdmin) {
      throw new AppException(COMMON_ERRORS.FORBIDDEN);
    }

    const order = await this.productsRepository.findOrderById(orderId);

    if (order === null) {
      throw new AppException(ORDERS_ERRORS.ORDER_NOT_FOUND);
    }

    await this.productsRepository.deleteOrder(orderId);

    return {
      message: '주문 삭제 성공',
    };
  }
}
