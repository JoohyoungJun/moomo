import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(userData: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return this.prisma.user.create({
      data: {
        email: userData.email,
        passwordHash: hashedPassword,
        nickname: userData.nickname,
      },
    });
  }
}
