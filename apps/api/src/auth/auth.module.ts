import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshStrategy } from './jwt/jwt-refresh.strategy';
import { JwtAccessStrategy } from './jwt/jwt-access.strategy';
import { OptionalJwtAccessGuard } from './jwt/optional-jwt-access.guard';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({})],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    OptionalJwtAccessGuard,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
