# Moomo Web

## 기술 스택

1. **Framework** — Next.js (App Router)
2. **Language** — TypeScript
3. **Style** — Vanilla Extract
4. **Data** — TanStack Query
5. **API** — NestJS (`http://localhost:8000`), Cookie 인증

## pnpm --filter 명령어

루트(`moomo/`)에서 실행합니다.

```bash
# 개발 서버 (localhost:3000)
pnpm dev:web
# 또는
pnpm --filter web dev

# API + Web 동시에 (터미널 2개)
pnpm dev:api
pnpm dev:web

# 패키지 추가
pnpm --filter web add <패키지명>
pnpm --filter web add -D <패키지명>

# 빌드 / 린트
pnpm --filter web build
pnpm --filter web lint
```

## 폴더 구조

```
app/          # 페이지 (App Router)
components/   # UI 컴포넌트
styles/       # Vanilla Extract
lib/          # api client 등
hooks/        # TanStack Query hooks
```

## 환경변수

`.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
