import { HttpException } from '@nestjs/common';

interface ErrorInfo {
  code: string;
  message: string;
  status: number;
}

export class AppException extends HttpException {
  constructor(error: ErrorInfo) {
    super(
      {
        code: error.code,
        message: error.message,
      },
      error.status,
    );
  }
}
