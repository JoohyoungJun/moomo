import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from '@/common/decorators/api-success-response.decorator';
import { JwtAccessGuard } from '@/auth/jwt/jwt-access.guard';
import { COMMON_ERRORS, NOTIFICATIONS_ERRORS } from '@/common/constants/errors';
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

  @ApiOperation({ summary: '알림 읽음 처리' })
  @ApiSuccessResponse(HttpStatus.OK, NotificationResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(
    COMMON_ERRORS.VALIDATION_ERROR,
    NOTIFICATIONS_ERRORS.NOTIFICATION_USER_MISMATCH,
  )
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(NOTIFICATIONS_ERRORS.NOTIFICATION_NOT_FOUND)
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':notificationId/read')
  markAsRead(
    @Param('notificationId') notificationId: string,
    @Req() req: Request & { user: JwtAccessUser },
  ) {
    return this.notificationsService.markAsRead(notificationId, req.user.id);
  }
}
