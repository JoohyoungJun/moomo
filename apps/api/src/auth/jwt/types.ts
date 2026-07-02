export type JwtPayload = {
    sub: string;
    email: string;
}

export type JwtAccessUser = {
    id: string;
    email: string;
    nickname: string;
}

export type JwtRefreshUser = {
    id: string;
    email: string;
}