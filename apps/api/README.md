# Moomo API

## 기술 스택

1. **Runtime / Language** — Node.js, TypeScript
2. **Framework** — NestJS 11 (Express)
3. **Database** — PostgreSQL, Prisma ORM
4. **Authentication** — JWT (Access 15m / Refresh 7d), httpOnly Cookie, Passport, bcrypt
5. **API Documentation** — Swagger (`/api/docs`)
6. **Validation** — class-validator, class-transformer, ValidationPipe
7. **Package Manager** — pnpm (monorepo)

## 아키텍처

1. **Repository Pattern** — DB 접근 로직 분리
2. **Service / Controller** — 비즈니스 로직 / HTTP 레이어 분리
3. **Global Interceptor** — 성공 응답 `{ success, message, data }` 통일
4. **AppException** — 에러 응답 `{ code, message }` 통일

## 주요 기능

1. **Auth** — 회원가입, 로그인, 로그아웃, 토큰 갱신
2. **Posts** — CRUD, 페이지네이션, 좋아요·댓글 수, `isLiked`
3. **Comments** — 게시글별 CRUD, 댓글 알림
4. **Likes** — 좋아요 토글, 좋아요 알림
5. **Notifications** — 목록, 읽음 처리, `has-unread`
6. **Users** — 내 정보, 내 글/댓글, 프로필·비밀번호 수정

## 실행

```bash
pnpm install
pnpm --filter api prisma:generate
pnpm --filter api dev
```

- API: `http://localhost:8000`
- Swagger: `http://localhost:8000/api/docs`
