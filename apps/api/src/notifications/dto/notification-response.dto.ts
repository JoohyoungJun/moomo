import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ description: '알림 타입' })
  declare type: string;

  @ApiProperty({ description: '알림 메세지' })
  declare message: string;

  @ApiProperty({ example: false })
  declare isRead: boolean;

  @ApiProperty({ format: 'uuid' })
  declare postId: string;

  @ApiProperty({ format: 'uuid' })
  declare commentId: string;

  @ApiProperty({ description: '알림 생성 시간' })
  declare createdAt: Date;
}

export class MarkAsReadResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: false })
  declare isRead: boolean;
}
