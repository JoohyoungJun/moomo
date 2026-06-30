import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LikesRepository {
  constructor(private readonly prisma: PrismaService) {}
}
