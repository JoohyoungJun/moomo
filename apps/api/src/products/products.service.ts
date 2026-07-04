import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { UsersRepository } from '@/users/users.repository';
import {
  CreateProductRequestDto,
  MAX_PRODUCT_DESCRIPTION_LENGTH,
  MAX_PRODUCT_NAME_LENGTH,
  MAX_PRODUCT_PRICE,
  MAX_PRODUCT_STOCK,
  MIN_PRODUCT_PRICE,
  MIN_PRODUCT_STOCK,
  MIN_STRING_LENGTH,
  UpdateProductRequestDto,
} from './dto/products-requset.dto';
import { ProductResponseDto } from './dto/products-response.dto';
import { AppException } from '@/common/exception/app.exception';
import {
  COMMON_ERRORS,
  PRODUCTS_ERRORS,
  USERS_ERRORS,
} from '@/common/constants/errors';

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

    const { name, description, price, stock } = data;

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
      stock === undefined
    ) {
      throw new AppException(PRODUCTS_ERRORS.PRODUCT_UPDATE_EMPTY);
    }

    const post = await this.productsRepository.findProductById(productId);

    if (post === null) {
      throw new AppException(PRODUCTS_ERRORS.PRODUCT_NOT_FOUND);
    }

    const updated = await this.productsRepository.updateProduct(
      productId,
      data,
    );

    return updated;
  }
}
