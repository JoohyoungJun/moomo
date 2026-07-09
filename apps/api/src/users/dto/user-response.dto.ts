import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  declare id: string;

  @ApiProperty()
  declare email: string;

  @ApiProperty()
  declare nickname: string;

  @ApiProperty()
  declare isAdmin: boolean;

  @ApiProperty()
  declare createdAt: Date;
}

export class UserMeResponseDto extends UserResponseDto {
  @ApiProperty({ description: '유저 정보 수정 일시' })
  declare updatedAt: Date;
}
