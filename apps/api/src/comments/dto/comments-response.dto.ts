import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentsResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ description: '댓글 내용' })
  declare content: string;

  @ApiProperty({ format: 'uuid' })
  declare postId: string;

  @ApiProperty({ format: 'uuid' })
  declare authorId: string;

  @ApiProperty({ description: '댓글 작성 일시' })
  declare createdAt: Date;

  @ApiProperty({ description: '댓글 수정 일시' })
  declare updatedAt: Date;
}
