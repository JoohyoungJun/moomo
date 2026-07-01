import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export const USER_NICKNAME_MIN_LENGTH = 2;
export const USER_NICKNAME_MAX_LENGTH = 10;

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

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password']),
) {}
