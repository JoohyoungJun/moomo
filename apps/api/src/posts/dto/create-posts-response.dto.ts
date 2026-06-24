import { ApiProperty } from '@nestjs/swagger';

export class CreatePostsResponseDto {
  @ApiProperty({
    description: '게시글 아이디',
    format: 'uuid',
  })
  declare id: string;

  @ApiProperty({ description: '게시글 제목' })
  declare title: string;

  @ApiProperty({ description: '게시글 내용' })
  declare content: string;

  @ApiProperty({
    description: '게시글 작성자 아이디',
    format: 'uuid',
  })
  declare authorId: string;

  @ApiProperty({ description: '게시글 작성 일시' })
  declare createdAt: Date;

  @ApiProperty({ description: '게시글 수정 일시' })
  declare updatedAt: Date;
}
