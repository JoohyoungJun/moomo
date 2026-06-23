import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: '유저 이메일 주소',
  })
  @IsEmail()
  declare email: string;

  @ApiProperty({
    example: 'password123',
    description: '유저 비밀번호',
  })
  @IsString()
  @Length(8, 20)
  declare password: string;

  @ApiProperty({
    example: '무모 이용자',
    description: '유저 닉네임',
  })
  @IsString()
  @Length(2, 10)
  declare nickname: string;
}
