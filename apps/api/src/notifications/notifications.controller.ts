import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from '@/common/decorators/api-success-response.decorator';
import { JwtAccessGuard } from '@/auth/jwt/jwt-access.guard';
import { COMMON_ERRORS } from '@/common/constants/errors';
import { ApiErrorResponse } from '@/common/decorators/api-error-response.decorator';
import { PaginationQueryDto } from '@/common/pagination/pagination-query.dto';
import { Request } from 'express';
import { JwtAccessUser } from '@/auth/jwt/types';
import { NotificationResponseDto } from './dto/notification-response.dto';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: '알림 목록 조회' })
  @ApiSuccessResponse(HttpStatus.OK, [NotificationResponseDto])
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  getAllNotifications(
    @Query() query: PaginationQueryDto,
    @Req() req: Request & { user: JwtAccessUser },
  ) {
    return this.notificationsService.findAllNotifications(req.user.id, query);
  }
}
