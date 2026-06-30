import { Injectable } from '@nestjs/common';
import { LikesRepository } from './likes.repository';
import { PostsRepository } from '@/posts/posts.repository';
import { POSTS_ERRORS } from '@/common/constants/errors';
import { AppException } from '@/common/exception/app.exception';
import { LikesResponseDto } from './dto/likes-response.dto';

@Injectable()
export class LikesService {
  constructor(
    private readonly likesRepository: LikesRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async toggleLike(userId: string, postId: string): Promise<LikesResponseDto> {
    const post = await this.postsRepository.findPostById(postId);

    if (post === null) {
      throw new AppException(POSTS_ERRORS.POST_NOT_FOUND);
    }

    const existingLike = await this.likesRepository.findLike(userId, postId);
    const isLiked = existingLike === null;

    await (existingLike
      ? this.likesRepository.deleteLike(userId, postId)
      : this.likesRepository.createLike(userId, postId));

    const likesCount = await this.likesRepository.countLikes(postId);

    return {
      postId,
      likesCount,
      isLiked,
    };
  }
}
