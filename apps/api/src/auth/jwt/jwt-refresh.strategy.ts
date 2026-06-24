import { AUTH_ERRORS } from '@/common/constants/errors';
import { AppException } from '@/common/exception/app.exception';
import { UsersRepository } from '@/users/users.repository';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { JwtPayload, JwtRefreshUser } from './types';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly usersRepository: UsersRepository) {
    const secret = process.env.JWT_REFRESH_SECRET;

    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET 없음');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          const cookies = req.cookies as Record<string, string> | undefined;
          const token = cookies?.refreshToken;
          return typeof token === 'string' ? token : null;
        },
      ]),
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtRefreshUser> {
    const user = await this.usersRepository.findById(payload.sub);

    if (user === null) {
      throw new AppException(AUTH_ERRORS.INVALID_TOKEN);
    }

    return {
      id: user.id,
      email: user.email,
    };
  }
}
