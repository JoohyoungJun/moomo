import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PostsService, PostsRepository],
  controllers: [PostsController],
  exports: [PostsRepository],
})
export class PostsModule {}
