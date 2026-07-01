import { AUTH_ERRORS, USERS_ERRORS } from '@/common/constants/errors';
import { AppException } from '@/common/exception/app.exception';
import {
  CreateUserConfirmPasswordDto,
  CreateUserDto,
  USER_NICKNAME_MAX_LENGTH,
  USER_NICKNAME_MIN_LENGTH,
} from '@/users/dto/user-request.dto';
import { UserResponseDto } from '@/users/dto/user-response.dto';
import { UsersRepository } from '@/users/users.repository';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { cookieOptions, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, SALT_ROUNDS } from './constants/auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(userData: CreateUserConfirmPasswordDto): Promise<UserResponseDto> {
    if (userData.password !== userData.passwordConfirm) {
      throw new AppException(AUTH_ERRORS.PASSWORD_MISMATCH);
    }

    if (userData.password.length < PASSWORD_MIN_LENGTH) {
      throw new AppException(AUTH_ERRORS.PASSWORD_TOO_SHORT);
    }

    if (userData.password.length > PASSWORD_MAX_LENGTH) {
      throw new AppException(AUTH_ERRORS.PASSWORD_TOO_LONG);
    }

    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

    const isUserExist = await this.usersRepository.findByEmail(userData.email);
    if (isUserExist) {
      throw new AppException(AUTH_ERRORS.USER_ALREADY_EXISTS);
    }

    if (userData.nickname.length < USER_NICKNAME_MIN_LENGTH) {
      throw new AppException(USERS_ERRORS.USER_NICKNAME_TOO_SHORT);
    }

    if (userData.nickname.length > USER_NICKNAME_MAX_LENGTH) {
      throw new AppException(USERS_ERRORS.USER_NICKNAME_TOO_LONG);
    }

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

  async signIn(signInRequestDto: SignInRequestDto) {
    const user = await this.usersRepository.findByEmail(signInRequestDto.email);
    if (user === null) {
      throw new AppException(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(
      signInRequestDto.password,
      user.passwordHash,
    );
    if (isPasswordValid === false) {
      throw new AppException(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.email,
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  private async generateTokens(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(userId: string, email: string) {
    return this.generateTokens(userId, email);
  }

  setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }

  clearAuthCookies(res: Response) {
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
  }
}
