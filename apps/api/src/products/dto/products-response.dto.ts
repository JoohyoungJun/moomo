import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ description: '상품 이름' })
  declare name: string;

  @ApiProperty({ description: '상품 설명' })
  declare description: string;

  @ApiProperty({ description: '상품 가격' })
  declare price: number;

  @ApiProperty({ description: '상품 재고' })
  declare stock: number;

  @ApiProperty({ description: '상품 생성일' })
  declare createdAt: Date;

  @ApiProperty({ description: '상품 수정일' })
  declare updatedAt: Date;
}
