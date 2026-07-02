import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePostsRequestDto {
  @ApiProperty({ description: '게시글 제목' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  declare title: string;

  @ApiProperty({ description: '게시글 내용' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 2000)
  declare content: string;
}

export class UpdatePostsRequestDto extends PartialType(CreatePostsRequestDto) {}
