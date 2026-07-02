import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { UsersRepository } from './users.repository';
import { PostsModule } from '@/posts/posts.module';
import { CommentsModule } from '@/comments/comments.module';

@Module({
  imports: [PrismaModule, PostsModule, CommentsModule],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
