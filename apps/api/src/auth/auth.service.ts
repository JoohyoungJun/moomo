import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UserResponseDto } from '@/users/dto/user-response.dto';
import { UsersRepository } from '@/users/users.repository';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(userData: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await this.usersRepository.createUser({
      email: userData.email,
      password: hashedPassword,
      nickname: userData.nickname,
    });

    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    };
  }
}
