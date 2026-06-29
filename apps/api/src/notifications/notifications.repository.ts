import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

Injectable();
export class NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}
}
