import { ApiProperty, OmitType } from '@nestjs/swagger';

export class ProductImageResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ description: '이미지 URL' })
  declare url: string;

  @ApiProperty({ description: '이미지 순서' })
  declare order: number;
}

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

  @ApiProperty({ type: [ProductImageResponseDto] })
  declare images: ProductImageResponseDto[];
}

export class ProductListResponseDto extends OmitType(ProductResponseDto, [
  'description',
  'updatedAt',
  'images',
]) {
  @ApiProperty({ description: '상품 썸네일 이미지' })
  declare thumbnailImage: string;
}

export class OrderProductResponseDto {
  @ApiProperty({ description: '주문 id' })
  declare id: string;

  @ApiProperty({ description: '주문자 id' })
  declare userId: string;

  @ApiProperty({ description: '상품 id' })
  declare productId: string;

  @ApiProperty({ description: '주문 수량' })
  declare quantity: number;

  @ApiProperty({ description: '주문 가격' })
  declare totalPrice: number;

  @ApiProperty({ description: '주문 생성일' })
  declare createdAt: Date;
}
