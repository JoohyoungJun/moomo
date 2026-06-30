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
    message: '접근 권한이 없습니다.',
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

  INVALID_TOKEN: {
    status: HttpStatus.UNAUTHORIZED,
    message: '유효하지 않은 토큰입니다.',
    code: 'INVALID_TOKEN',
  },
};

export const POSTS_ERRORS = {
  POST_TOO_SHORT: {
    status: HttpStatus.BAD_REQUEST,
    message: '글자 수가 너무 짧습니다.',
    code: 'POST_TOO_SHORT',
  },
  POST_TOO_LONG: {
    status: HttpStatus.BAD_REQUEST,
    message: '글자 수가 너무 많습니다.',
    code: 'POST_TOO_LONG',
  },
  POST_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '게시글을 찾을 수 없습니다.',
    code: 'POST_NOT_FOUND',
  },
  POST_UPDATE_EMPTY: {
    status: HttpStatus.BAD_REQUEST,
    message: '게시글 수정 내용이 없습니다.',
    code: 'POST_UPDATE_EMPTY',
  },
};

export const COMMENTS_ERRORS = {
  COMMENT_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '댓글을 찾을 수 없습니다.',
    code: 'COMMENT_NOT_FOUND',
  },

  COMMENT_UPDATE_EMPTY: {
    status: HttpStatus.BAD_REQUEST,
    message: '댓글 수정 내용이 없습니다.',
    code: 'COMMENT_UPDATE_EMPTY',
  },

  COMMENT_POST_MISMATCH: {
    status: HttpStatus.BAD_REQUEST,
    message: '댓글과 게시글이 일치하지 않습니다.',
    code: 'COMMENT_POST_MISMATCH',
  },
};

export const NOTIFICATIONS_ERRORS = {
  NOTIFICATION_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '알림을 찾을 수 없습니다.',
    code: 'NOTIFICATION_NOT_FOUND',
  },
  NOTIFICATION_USER_MISMATCH: {
    status: HttpStatus.BAD_REQUEST,
    message: '알림 소유자가 일치하지 않습니다.',
    code: 'NOTIFICATION_USER_MISMATCH',
  },
};

export const USERS_ERRORS = {
  USER_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '사용자를 찾을 수 없습니다.',
    code: 'USER_NOT_FOUND',
  },
};
