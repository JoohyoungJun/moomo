import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  nickname!: string;

  @ApiProperty()
  isAdmin!: boolean;

  @ApiProperty()
  createdAt!: Date;
}
