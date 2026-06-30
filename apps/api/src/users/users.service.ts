import { USERS_ERRORS } from './../common/constants/errors';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserMeResponseDto } from './dto/user-response.dto';
import { AppException } from '@/common/exception/app.exception';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getMe(userId: string): Promise<UserMeResponseDto> {
    const user = await this.usersRepository.findById(userId);

    if (user === null) {
      throw new AppException(USERS_ERRORS.USER_NOT_FOUND);
    }

    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      createdAt: user.createdAt,
    };
  }
}
