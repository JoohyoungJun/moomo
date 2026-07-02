const isProduction = process.env.NODE_ENV === 'production';

export const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ('none' as const) : ('lax' as const),
};

export const SALT_ROUNDS = 10;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 20;
export const ACCESS_TOKEN_MAX_AGE = 1000 * 60 * 15;
export const REFRESH_TOKEN_MAX_AGE = 1000 * 60 * 60 * 24 * 7;
