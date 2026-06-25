import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './comments.repository';
import { PrismaModule } from '@/prisma/prisma.module';
import { PostsModule } from '@/posts/posts.module';

@Module({
  imports: [PrismaModule, PostsModule],
  providers: [CommentsService, CommentsRepository],
  controllers: [CommentsController],
})
export class CommentsModule {}
