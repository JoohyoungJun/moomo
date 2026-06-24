import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 'VALIDATION_ERROR' })
  declare code: string;

  @ApiProperty({ example: '입력값이 유효하지 않습니다.' })
  declare message: string;
}
