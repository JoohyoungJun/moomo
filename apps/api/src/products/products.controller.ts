import { ApiSuccessResponse } from '@/common/decorators/api-success-response.decorator';
import { ProductsService } from './products.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductResponseDto } from './dto/products-response.dto';
import { ApiErrorResponse } from '@/common/decorators/api-error-response.decorator';
import {
  COMMON_ERRORS,
  PRODUCTS_ERRORS,
  USERS_ERRORS,
} from '@/common/constants/errors';
import { JwtAccessGuard } from '@/auth/jwt/jwt-access.guard';
import { Request } from 'express';
import { JwtAccessUser } from '@/auth/jwt/types';
import {
  CreateProductRequestDto,
  UpdateProductRequestDto,
} from './dto/products-requset.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: '상품 등록 (관리자용)' })
  @ApiSuccessResponse(HttpStatus.CREATED, ProductResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.FORBIDDEN)
  @ApiErrorResponse(
    COMMON_ERRORS.VALIDATION_ERROR,
    PRODUCTS_ERRORS.PRODUCT_PRICE_INVALID,
    PRODUCTS_ERRORS.PRODUCT_STOCK_INVALID,
    PRODUCTS_ERRORS.PRODUCT_NAME_INVALID,
    PRODUCTS_ERRORS.PRODUCT_DESCRIPTION_INVALID,
  )
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(USERS_ERRORS.USER_NOT_FOUND)
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createProduct(
    @Req() req: Request & { user: JwtAccessUser },
    @Body() body: CreateProductRequestDto,
  ) {
    return this.productsService.createProduct(req.user.id, body);
  }

  @ApiOperation({ summary: '상품 상세 조회' })
  @ApiSuccessResponse(HttpStatus.OK, ProductResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(PRODUCTS_ERRORS.PRODUCT_NOT_FOUND)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getProductById(@Param('id') productId: string) {
    return this.productsService.getProductById(productId);
  }

  @ApiOperation({ summary: '상품 수정 (관리자용)' })
  @ApiSuccessResponse(HttpStatus.OK, ProductResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.FORBIDDEN)
  @ApiErrorResponse(
    USERS_ERRORS.USER_NOT_FOUND,
    PRODUCTS_ERRORS.PRODUCT_NOT_FOUND,
  )
  @ApiErrorResponse(
    COMMON_ERRORS.VALIDATION_ERROR,
    PRODUCTS_ERRORS.PRODUCT_PRICE_INVALID,
    PRODUCTS_ERRORS.PRODUCT_STOCK_INVALID,
    PRODUCTS_ERRORS.PRODUCT_NAME_INVALID,
    PRODUCTS_ERRORS.PRODUCT_DESCRIPTION_INVALID,
    PRODUCTS_ERRORS.PRODUCT_UPDATE_EMPTY,
  )
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  updateProduct(
    @Req() req: Request & { user: JwtAccessUser },
    @Param('id') productId: string,
    @Body() body: UpdateProductRequestDto,
  ) {
    return this.productsService.updateProduct(req.user.id, productId, body);
  }
}
