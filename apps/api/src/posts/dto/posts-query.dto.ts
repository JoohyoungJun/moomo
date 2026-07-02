import { PaginationQueryDto } from '@/common/pagination/pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class PostsQueryDto extends PaginationQueryDto {
  @ApiProperty({ description: '검색어' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  declare search?: string;
}
