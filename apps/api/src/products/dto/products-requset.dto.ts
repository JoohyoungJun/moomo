import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
