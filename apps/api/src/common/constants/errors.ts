import { HttpStatus } from '@nestjs/common';

export const COMMON_ERRORS = {
  INTERNAL_SERVER_ERROR: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: '서버 오류가 발생했습니다.',
    code: 'INTERNAL_SERVER_ERROR',
  },
  UNAUTHORIZED: {
    status: HttpStatus.UNAUTHORIZED,
    message: '인증이 필요합니다.',
    code: 'UNAUTHORIZED',
  },
  FORBIDDEN: {
    status: HttpStatus.FORBIDDEN,
    message: '접근이 권한이 없습니다.',
    code: 'FORBIDDEN',
  },
  VALIDATION_ERROR: {
    status: HttpStatus.BAD_REQUEST,
    message: '입력값이 유효하지 않습니다.',
    code: 'VALIDATION_ERROR',
  },
};

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: {
    status: HttpStatus.UNAUTHORIZED,
    message: '이메일 또는 비밀번호가 올바르지 않습니다.',
    code: 'INVALID_CREDENTIALS',
  },

  USER_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: '이미 가입된 이메일입니다.',
    code: 'USER_ALREADY_EXISTS',
  },
};
