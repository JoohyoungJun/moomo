import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport/dist/passport/passport.strategy';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';


export interface JwtAccessUser {
  userId: string;
  email: string;
}

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    config: ConfigService,
    private readonly users
  )
}
