import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export const MIN_PRODUCT_PRICE = 0;
export const MAX_PRODUCT_PRICE = 100_000_000;
export const MIN_PRODUCT_STOCK = 0;
export const MAX_PRODUCT_STOCK = 10_000;
export const MIN_STRING_LENGTH = 1;
export const MAX_PRODUCT_NAME_LENGTH = 100;
export const MAX_PRODUCT_DESCRIPTION_LENGTH = 1000;

export class ProductImageRequestDto {
  @ApiProperty({ description: '이미지 URL' })
  @IsString()
  @IsNotEmpty()
  declare url: string;
}

export class CreateProductRequestDto {
  @ApiProperty({ description: '상품 이름' })
  @IsString()
  @IsNotEmpty()
  declare name: string;

  @ApiProperty({ description: '상품 설명' })
  @IsString()
  @IsNotEmpty()
  declare description: string;

  @ApiProperty({ description: '상품 가격' })
  @IsNumber()
  @IsNotEmpty()
  declare price: number;

  @ApiProperty({ description: '상품 재고' })
  @IsNumber()
  @IsNotEmpty()
  declare stock: number;

  @ApiProperty({ type: [ProductImageRequestDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageRequestDto)
  declare images?: ProductImageRequestDto[];
}

export class UpdateProductRequestDto extends PartialType(
  CreateProductRequestDto,
) {}
