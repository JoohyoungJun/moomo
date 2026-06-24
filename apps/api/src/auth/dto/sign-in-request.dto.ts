import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class SignInRequestDto {
  @ApiProperty({ example: 'test@email.com' })
  @IsEmail()
  declare email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @Length(8, 20)
  declare password: string;
}
