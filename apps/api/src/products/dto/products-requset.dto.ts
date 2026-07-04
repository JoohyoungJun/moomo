import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export const MIN_PRODUCT_PRICE = 0;
export const MAX_PRODUCT_PRICE = 100_000_000;
export const MIN_PRODUCT_STOCK = 0;
export const MAX_PRODUCT_STOCK = 10_000;
export const MIN_STRING_LENGTH = 1;
export const MAX_PRODUCT_NAME_LENGTH = 100;
export const MAX_PRODUCT_DESCRIPTION_LENGTH = 1000;

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
}

export class UpdateProductRequestDto extends PartialType(
  CreateProductRequestDto,
) {}
