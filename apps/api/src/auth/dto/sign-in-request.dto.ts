import { ApiProperty } from '@nestjs/swagger';

export class SignInRequestDto {
  @ApiProperty({ example: 'test@email.com' })
  declare email: string;

  @ApiProperty({ example: 'password123' })
  declare password: string;
}
