import { ApiProperty, OmitType } from '@nestjs/swagger';

export class PostsResponseDto {
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

  @ApiProperty({ description: '작성자 닉네임' })
  declare authorNickname: string;

  @ApiProperty({ example: 3 })
  declare likesCount: number;

  @ApiProperty({ example: true })
  declare isLiked: boolean;

  @ApiProperty({ example: 5 })
  declare commentsCount: number;

  @ApiProperty({ description: '게시글 작성 일시' })
  declare createdAt: Date;

  @ApiProperty({ description: '게시글 수정 일시' })
  declare updatedAt: Date;
}

export class PostListResponseDto extends OmitType(PostsResponseDto, [
  'content',
  'updatedAt',
]) {}

export class UpdatedPostsResponseDto extends OmitType(PostsResponseDto, [
  'commentsCount',
  'likesCount',
  'authorNickname',
  'isLiked',
]) {}
