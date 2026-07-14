# Moomo

커뮤니티(게시글·댓글·좋아요·알림)와 상품 주문 기능을 함께 둔 풀스택 웹 애플리케이션입니다.  
`pnpm` 모노레포로 API와 Web을 분리해 관리합니다.

```
apps/
  api/   # NestJS 백엔드
  web/   # Next.js 프론트엔드
```

## 개요

- **Auth** — 회원가입·로그인·로그아웃·토큰 갱신 (JWT + httpOnly Cookie)
- **Posts / Comments / Likes** — 게시글 CRUD, 댓글, 좋아요 토글
- **Notifications** — 댓글·좋아요 알림, 읽음 처리
- **Users** — 내 정보·내 글/댓글, 프로필·비밀번호 수정
- **Products / Orders** — 상품 CRUD(관리자), 주문, 주문 상태 변경

로컬 기준:

| 서비스 | URL |
|--------|-----|
| Web | `http://localhost:3000` |
| API | `http://localhost:8000` |
| Swagger | `http://localhost:8000/api/docs` |

## 기술 스택

### 공통

| 구분 | 기술 |
|------|------|
| 모노레포 | pnpm workspace |
| 언어 | TypeScript |
| DB | PostgreSQL |
| ORM | Prisma |
| 이미지 저장 | Supabase Storage |

### API (`apps/api`)

| 구분 | 기술 |
|------|------|
| 프레임워크 | NestJS 11 (Express) |
| 인증 | JWT (Access / Refresh), Passport, bcrypt, Cookie |
| 문서화 | Swagger (`/api/docs`) |
| 검증 | class-validator, class-transformer |

**구조**

1. Repository — DB 접근
2. Service — 비즈니스 로직
3. Controller — HTTP 레이어
4. 응답/에러 형식 통일 (Interceptor, AppException)

### Web (`apps/web`)

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js (App Router) |
| UI | React 19 |
| 스타일 | Vanilla Extract |
| 서버 상태 | TanStack Query |
| API 연동 | Cookie 기반 인증 (`NEXT_PUBLIC_API_URL`) |

## 개발 이유

1. **풀스택 흐름을 한 프로젝트에서 연습** — 인증, CRUD, 페이지네이션, 알림, 관리자 권한, 주문까지 실제 서비스에 가까운 기능을 직접 연결해 보기 위해 만들었습니다.
2. **프론트/백 역할을 명확히 나누기** — NestJS API와 Next.js Web을 분리해, REST API 설계·쿠키 인증·DTO/검증과 클라이언트 데이터 페칭(React Query)을 각각 익힙니다.
3. **커뮤니티 + 커머스 도메인** — 게시판만 두지 않고 상품·재고·주문 상태를 넣어, 여러 도메인이 한 유저 플로우로 이어지는 경험을 쌓기 위함입니다.
4. **배포·운영까지 포함** — Vercel 등 배포 환경, 환경 변수, 이미지 업로드(Supabase)까지 포함해 로컬을 넘어 실제 서비스 형태에 가깝게 완성하는 것이 목적입니다.

## 실행

루트(`moomo/`)에서:

```bash
pnpm install

# DB 클라이언트 생성 (최초/스키마 변경 시)
pnpm --filter api prisma:generate

# 터미널 2개
pnpm dev:api   # :8000
pnpm dev:web   # :3000
```

앱별 상세는 각 README를 참고하세요.

- [API](./api/README.md)
- [Web](./web/README.md)
