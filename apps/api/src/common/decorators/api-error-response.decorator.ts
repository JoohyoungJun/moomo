import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from '../swagger/error-response.dto';
import { errorResponseExample } from '../swagger/error-response-example';

interface ErrorConstant {
  status: number;
  message: string;
  code: string;
}

export function ApiErrorResponse(...errs: [ErrorConstant, ...ErrorConstant[]]) {
  if (errs.length === 1) {
    const err = errs[0];
    return ApiResponse({
      status: err.status,
      type: ErrorResponseDto,
      description: err.message,
      examples: {
        default: {
          summary: err.message,
          value: errorResponseExample(err),
        },
      },
    });
  }

  return ApiResponse({
    status: errs[0].status,
    type: ErrorResponseDto,
    examples: Object.fromEntries(
      errs.map((err) => [
        err.code,
        { summary: err.message, value: errorResponseExample(err) },
      ]),
    ),
  });
}
