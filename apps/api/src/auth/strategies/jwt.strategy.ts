import { AUTH_ERRORS } from '@/common/constants/errors';
import { AppException } from '@/common/exception/app.exception';
import { UsersRepository } from '@/users/users.repository';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';

type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly usersRepository: UsersRepository) {
    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET 없음');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          const token = req.cookies?.accessToken;

          if (typeof token !== 'string') {
            return null;
          }

          return token;
        },
      ]),
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersRepository.findById(payload.sub);

    if (user === null) {
      throw new AppException(AUTH_ERRORS.INVALID_TOKEN);
    }

    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    };
  }
}
