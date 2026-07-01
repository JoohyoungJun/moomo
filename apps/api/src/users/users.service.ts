import { CommentsRepository } from './../comments/comments.repository';
import { AUTH_ERRORS, USERS_ERRORS } from './../common/constants/errors';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserMeResponseDto } from './dto/user-response.dto';
import { AppException } from '@/common/exception/app.exception';
import { PostsRepository } from '@/posts/posts.repository';
import { PaginationQueryDto } from '@/common/pagination/pagination-query.dto';
import {
  buildPaginationResponse,
  getPaginationParams,
} from '@/common/pagination/pagination.util';
import {
  UpdatePasswordDto,
  UpdateUserDto,
  USER_NICKNAME_MAX_LENGTH,
  USER_NICKNAME_MIN_LENGTH,
} from './dto/user-request.dto';
import * as bcrypt from 'bcrypt';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  SALT_ROUNDS,
} from '@/auth/constants/auth.constants';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentsRepository,
  ) {}

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
      updatedAt: user.updatedAt,
    };
  }

  async getMyPosts(userId: string, query: PaginationQueryDto) {
    const { page, pageSize, skip, take } = getPaginationParams(query);

    const { items, total } = await this.postsRepository.findPostsByAuthorId(
      userId,
      skip,
      take,
    );

    const mappedItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      authorId: item.authorId,
      likesCount: item._count.likes,
      commentsCount: item._count.comments,
      createdAt: item.createdAt,
    }));

    return buildPaginationResponse(mappedItems, total, page, pageSize);
  }

  async getMyComments(userId: string, query: PaginationQueryDto) {
    const { page, pageSize, skip, take } = getPaginationParams(query);

    const { items, total } =
      await this.commentsRepository.findCommentsByAuthorId(userId, skip, take);

    const mappedItems = items.map((item) => ({
      id: item.id,
      content: item.content,
      postId: item.postId,
      postTitle: item.post.title,
      createdAt: item.createdAt,
    }));

    return buildPaginationResponse(mappedItems, total, page, pageSize);
  }

  async updateMe(
    userId: string,
    data: UpdateUserDto,
  ): Promise<UserMeResponseDto> {
    const user = await this.usersRepository.findById(userId);

    if (user === null) {
      throw new AppException(USERS_ERRORS.USER_NOT_FOUND);
    }

    if (data.email === undefined && data.nickname === undefined) {
      throw new AppException(USERS_ERRORS.USER_UPDATE_EMPTY);
    }

    if (data.email !== undefined) {
      const emailExists = await this.usersRepository.findByEmail(data.email);

      if (emailExists !== null && emailExists.id !== userId) {
        throw new AppException(AUTH_ERRORS.USER_ALREADY_EXISTS);
      }
    }

    if (data.nickname !== undefined) {
      const nicknameExists = await this.usersRepository.findByNickname(
        data.nickname,
      );

      if (nicknameExists !== null && nicknameExists.id !== userId) {
        throw new AppException(USERS_ERRORS.USER_NICKNAME_ALREADY_EXISTS);
      }

      if (data.nickname.length < USER_NICKNAME_MIN_LENGTH) {
        throw new AppException(USERS_ERRORS.USER_NICKNAME_TOO_SHORT);
      }

      if (data.nickname.length > USER_NICKNAME_MAX_LENGTH) {
        throw new AppException(USERS_ERRORS.USER_NICKNAME_TOO_LONG);
      }
    }

    const updated = await this.usersRepository.updateUser(userId, data);

    return {
      id: updated.id,
      email: updated.email,
      nickname: updated.nickname,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async changePassword(userId: string, data: UpdatePasswordDto) {
    const user = await this.usersRepository.findById(userId);

    if (user === null) {
      throw new AppException(USERS_ERRORS.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(
      data.currentPassword,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new AppException(USERS_ERRORS.CURRENTPASSWORD_INCORRECT);
    }

    if (data.newPassword === data.currentPassword) {
      throw new AppException(USERS_ERRORS.NEW_PASSWORD_SAME_AS_CURRENT);
    }

    if (data.newPassword.length < PASSWORD_MIN_LENGTH) {
      throw new AppException(AUTH_ERRORS.PASSWORD_TOO_SHORT);
    }

    if (data.newPassword.length > PASSWORD_MAX_LENGTH) {
      throw new AppException(AUTH_ERRORS.PASSWORD_TOO_LONG);
    }

    const passwordHash = await bcrypt.hash(data.newPassword, SALT_ROUNDS);

    await this.usersRepository.updatePassword(userId, passwordHash);

    return {
      message: '비밀번호 변경 성공',
    };
  }
}
