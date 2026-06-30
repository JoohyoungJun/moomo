import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { LikesRepository } from './likes.repository';
import { PrismaModule } from '@/prisma/prisma.module';
import { PostsModule } from '@/posts/posts.module';

@Module({
  imports: [PrismaModule, PostsModule],
  providers: [LikesService, LikesRepository],
  controllers: [LikesController],
})
export class LikesModule {}
