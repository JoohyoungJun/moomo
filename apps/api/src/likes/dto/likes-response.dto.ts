import { ApiProperty } from '@nestjs/swagger';

export class LikesResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare postId: string;

  @ApiProperty({ example: 3 })
  declare likesCount: number;

  @ApiProperty({ example: true })
  declare isLiked: boolean;
}
