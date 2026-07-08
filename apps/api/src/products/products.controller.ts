import { ApiSuccessResponse } from '@/common/decorators/api-success-response.decorator';
import { ProductsService } from './products.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  OrderProductResponseDto,
  ProductListResponseDto,
  ProductResponseDto,
  UserOrderResponseDto,
} from './dto/products-response.dto';
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
  OrderProductRequestDto,
  ProductsQueryDto,
  UpdateProductRequestDto,
} from './dto/products-request.dto';
import { PaginationQueryDto } from '@/common/pagination/pagination-query.dto';

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

  @ApiOperation({ summary: '상품 목록 조회' })
  @ApiSuccessResponse(HttpStatus.OK, [ProductListResponseDto])
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @HttpCode(HttpStatus.OK)
  @Get()
  getAllProducts(@Query() query: ProductsQueryDto) {
    return this.productsService.getAllProducts(query);
  }

  @ApiOperation({ summary: '사용자 주문 목록 조회' })
  @ApiSuccessResponse(HttpStatus.OK, [UserOrderResponseDto])
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Get('orders')
  getOrdersByUserId(
    @Req() req: Request & { user: JwtAccessUser },
    @Query() query: PaginationQueryDto,
  ) {
    return this.productsService.getOrdersByUserId(req.user.id, query);
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

  @ApiOperation({ summary: '상품 삭제 (관리자용)' })
  @ApiResponse({ status: HttpStatus.OK, description: '상품 삭제 성공' })
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.FORBIDDEN)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(
    USERS_ERRORS.USER_NOT_FOUND,
    PRODUCTS_ERRORS.PRODUCT_NOT_FOUND,
  )
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  deleteProduct(
    @Req() req: Request & { user: JwtAccessUser },
    @Param('id') productId: string,
  ) {
    return this.productsService.deleteProduct(req.user.id, productId);
  }

  @ApiOperation({ summary: '상품 주문' })
  @ApiSuccessResponse(HttpStatus.OK, OrderProductResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(
    COMMON_ERRORS.VALIDATION_ERROR,
    PRODUCTS_ERRORS.PRODUCT_ORDER_QUANTITY_INVALID,
    PRODUCTS_ERRORS.PRODUCT_STOCK_INVALID,
  )
  @ApiErrorResponse(PRODUCTS_ERRORS.PRODUCT_NOT_FOUND)
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Post(':id/order')
  orderProduct(
    @Req() req: Request & { user: JwtAccessUser },
    @Param('id') productId: string,
    @Body() body: OrderProductRequestDto,
  ) {
    return this.productsService.orderProduct(
      req.user.id,
      productId,
      body.quantity,
    );
  }
}
