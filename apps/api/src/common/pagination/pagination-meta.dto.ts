import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ example: 100 })
  declare total: number;

  @ApiProperty({ example: 1 })
  declare page: number;

  @ApiProperty({ example: 10 })
  declare pageSize: number;

  @ApiProperty({ example: 10 })
  declare totalPages: number;

  @ApiProperty({ example: true })
  declare hasNext: boolean;

  @ApiProperty({ example: false })
  declare hasPrev: boolean;
}
