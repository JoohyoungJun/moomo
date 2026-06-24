import { AUTH_ERRORS } from '@/common/constants/errors';
import { AppException } from '@/common/exception/app.exception';
import { UsersRepository } from '@/users/users.repository';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload, JwtAccessUser } from './types';

export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private readonly usersRepository: UsersRepository) {
    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET 없음');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          const cookies = req.cookies as Record<string, string> | undefined;
          const token = cookies?.accessToken;
          return typeof token === 'string' ? token : null;
        },
      ]),
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtAccessUser> {
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
