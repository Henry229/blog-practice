# Blog Practice - n8n 백엔드 구축 프로젝트

## 📁 문서 구조

```
.doc/
├── README.md                           # 이 파일
├── 01-plan/                            # 계획 문서
│   ├── backend-n8n-architecture.md     # n8n 백엔드 아키텍처 설계
│   ├── api-endpoints-specification.md  # API 엔드포인트 상세 명세
│   ├── n8n-workflow-structure.md       # 워크플로우 구조 설계
│   └── nextjs-integration-guide.md     # Next.js 통합 가이드
└── 02-n8n-workflows/                   # n8n 워크플로우 JSON
    └── blog-publish-v1.json            # 블로그 발행 워크플로우
```

## 🎯 프로젝트 목표

Next.js 16 블로그 애플리케이션에 n8n 기반 백엔드를 구축하여 다음 기능을 자동화합니다:

1. **컨텐츠 처리**: 이미지 최적화, SEO 메타데이터 생성
2. **알림 시스템**: 이메일 알림, 실시간 알림
3. **사용자 관리**: 온보딩 자동화, 활동 분석
4. **관리 기능**: 컨텐츠 심사, 백업, 리포트
5. **외부 통합**: 검색 인덱싱, 소셜 미디어

## 📚 문서 읽는 순서

### 1단계: 아키텍처 이해
먼저 [backend-n8n-architecture.md](01-plan/backend-n8n-architecture.md)를 읽어 전체 시스템 구조를 파악하세요.

**핵심 내용**:
- n8n 백엔드 계층 구조
- 현재 시스템 분석 (Supabase, Next.js)
- 워크플로우 설계 원칙
- 보안 및 성능 최적화

### 2단계: API 명세 확인
[api-endpoints-specification.md](01-plan/api-endpoints-specification.md)에서 제공할 API를 확인하세요.

**핵심 내용**:
- 8개 카테고리, 15개 API 엔드포인트
- 요청/응답 형식
- 에러 코드 및 처리
- Rate limiting, 보안

**주요 API**:
- `POST /webhook/blog/publish` - 게시글 발행
- `POST /webhook/blog/analyze` - AI 컨텐츠 분석
- `POST /webhook/media/process` - 이미지 최적화
- `POST /webhook/notification/email` - 이메일 알림
- `POST /webhook/user/onboarding` - 사용자 온보딩

### 3단계: 워크플로우 구조 학습
[n8n-workflow-structure.md](01-plan/n8n-workflow-structure.md)에서 워크플로우 설계 패턴을 학습하세요.

**핵심 내용**:
- 공통 노드 패턴 (입력 검증, 에러 처리, 응답 형식)
- 재사용 가능한 서브워크플로우 4개
- 메인 워크플로우 5개 (노드 다이어그램 포함)
- 환경 변수 구성
- 모니터링 및 로깅

### 4단계: Next.js 통합
[nextjs-integration-guide.md](01-plan/nextjs-integration-guide.md)에서 실제 구현 방법을 확인하세요.

**핵심 내용**:
- 환경 설정 (`.env.local`)
- n8n API 클라이언트 생성 (`lib/n8n/client.ts`)
- Server Actions 업데이트
- 클라이언트 컴포넌트 예시
- 에러 처리 및 재시도
- 테스트 코드

### 5단계: 워크플로우 JSON
[02-n8n-workflows/](02-n8n-workflows/)에서 실제 n8n에서 import 가능한 JSON 파일을 확인하세요.

**현재 생성된 워크플로우**:
- ✅ `blog-publish-v1.json` - 블로그 발행 워크플로우

**추가 생성 예정**:
- `blog-analyze-v1.json` - 컨텐츠 분석
- `notification-email-v1.json` - 이메일 알림
- `user-onboarding-v1.json` - 사용자 온보딩
- `admin-moderate-v1.json` - 컨텐츠 심사

## 🚀 구현 단계

### Phase 1: 기본 인프라 구축
1. n8n 서버 설치 및 설정
2. 환경 변수 구성
3. Webhook 엔드포인트 생성
4. 기본 워크플로우 import

### Phase 2: 핵심 기능 구현
1. 블로그 발행 워크플로우 (`blog-publish-v1`)
2. 이미지 최적화 서브워크플로우
3. 이메일 알림 서브워크플로우
4. Next.js API 클라이언트 구현

### Phase 3: 고급 기능 추가
1. AI 컨텐츠 분석 워크플로우
2. 사용자 온보딩 자동화
3. 검색 인덱싱 통합
4. 소셜 미디어 자동 포스팅

### Phase 4: 모니터링 및 최적화
1. 로깅 시스템 구축
2. 에러 알림 (Slack, Sentry)
3. 성능 모니터링
4. 부하 테스트 및 최적화

## 🔧 기술 스택

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui

### Backend
- **Automation**: n8n (self-hosted)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage / Cloudinary

### External Services
- **AI**: OpenAI GPT-4
- **Email**: Resend / SendGrid
- **Search**: Algolia
- **CDN**: Cloudinary
- **Analytics**: Google Analytics
- **Monitoring**: Sentry, Slack

## 📋 필수 환경 변수

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# n8n Backend
N8N_BACKEND_URL=https://n8n.yourdomain.com/webhook
N8N_API_KEY=your-secret-api-key
N8N_WEBHOOK_SECRET=your-webhook-secret

# OpenAI
OPENAI_API_KEY=sk-...

# Email
EMAIL_API_KEY=
EMAIL_FROM_ADDRESS=

# CDN (Cloudinary)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Search (Algolia)
ALGOLIA_APP_ID=
ALGOLIA_API_KEY=
ALGOLIA_INDEX_NAME=

# Analytics
GA_MEASUREMENT_ID=
GA_API_SECRET=

# Monitoring
SENTRY_DSN=
SLACK_WEBHOOK_URL=
```

## 🔐 보안 고려사항

1. **API 인증**: 모든 webhook에 API Key 검증
2. **HMAC 서명**: 요청 무결성 검증
3. **Rate Limiting**: API 호출 제한 (100 req/min)
4. **IP 화이트리스트**: n8n 서버 IP만 허용
5. **환경 변수**: 민감 정보는 환경 변수로 관리
6. **HTTPS**: 모든 통신은 HTTPS 사용

## 📊 예상 성능

### 블로그 발행 워크플로우
- **총 실행 시간**: 3-8초
- **이미지 최적화**: 이미지당 1-2초
- **SEO 메타데이터**: 1-2초 (OpenAI)
- **이메일 발송**: 구독자당 0.1초

### 컨텐츠 분석 워크플로우
- **총 실행 시간**: 2-5초 (병렬 처리)
- **병렬 분석**: 5개 분석 동시 실행

### 사용자 온보딩 워크플로우
- **총 실행 시간**: 1-3초

## 🐛 트러블슈팅

### n8n 워크플로우 실행 실패
1. 환경 변수 확인
2. API 키 유효성 검증
3. Webhook URL 확인
4. n8n 로그 확인

### Next.js에서 API 호출 실패
1. `N8N_BACKEND_URL` 확인
2. CORS 설정 확인
3. API Key 헤더 확인
4. 네트워크 연결 확인

## 📞 도움말

- **n8n 공식 문서**: https://docs.n8n.io
- **Supabase 문서**: https://supabase.com/docs
- **Next.js 문서**: https://nextjs.org/docs

## 📝 변경 이력

### 2025-01-18
- ✅ 백엔드 아키텍처 설계 완료
- ✅ API 엔드포인트 명세 작성
- ✅ 워크플로우 구조 설계
- ✅ Next.js 통합 가이드 작성
- ✅ 블로그 발행 워크플로우 JSON 생성

### 다음 작업
- [ ] 추가 워크플로우 JSON 파일 생성
- [ ] 로컬 환경에서 n8n 설치 및 테스트
- [ ] Next.js 코드 구현
- [ ] 통합 테스트
- [ ] 프로덕션 배포
