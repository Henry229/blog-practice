# n8n 백엔드 아키텍처 계획

## 프로젝트 개요

Next.js 16 블로그 애플리케이션을 위한 n8n 기반 백엔드 API 구축 계획입니다.

## 목표

1. **Supabase 보완**: 복잡한 비즈니스 로직을 n8n으로 처리
2. **워크플로우 자동화**: 이메일 알림, 컨텐츠 처리, 데이터 동기화
3. **외부 통합**: 타사 서비스 연동 (이메일, 분석, 미디어 등)
4. **모듈화**: 재사용 가능한 워크플로우 구성

## 현재 시스템 분석

### 기존 인증 시스템
- **프레임워크**: Supabase Auth
- **구현 위치**: `app/actions/auth.ts`
- **주요 기능**:
  - 이메일/비밀번호 로그인/회원가입
  - Google OAuth
  - 비밀번호 재설정
  - 프로필 자동 생성

### 기존 블로그 기능
- **구현 위치**: `app/actions/blog.ts`
- **주요 기능**:
  - 블로그 게시글 생성 (createBlog)
  - 블로그 게시글 수정 (updateBlog)
  - 블로그 게시글 삭제 (deleteBlog)
- **제한사항**:
  - 단순 CRUD만 지원
  - 비즈니스 로직 부재
  - 외부 통합 없음

### 데이터베이스 스키마
현재 테이블:
- `profiles`: 사용자 프로필 정보
- `blogs`: 블로그 게시글 (추정)

## n8n 백엔드 아키텍처

### 계층 구조

```
┌─────────────────────────────────────────┐
│         Next.js Frontend                │
│  (Client Components + Server Actions)   │
└─────────────────┬───────────────────────┘
                  │
                  ├─── Direct: Supabase (Simple CRUD)
                  │
                  └─── Webhook: n8n (Complex Logic)
                        │
                        ├─── Workflow 1: Content Processing
                        ├─── Workflow 2: Notifications
                        ├─── Workflow 3: Analytics
                        └─── Workflow 4: External Integrations
```

### 워크플로우 설계 원칙

1. **단일 책임**: 각 워크플로우는 하나의 비즈니스 기능 담당
2. **재사용성**: 서브워크플로우로 공통 로직 추출
3. **에러 처리**: 모든 워크플로우에 에러 핸들링 및 재시도 로직
4. **보안**: Webhook 인증, API 키 관리, 입력 검증

## API 엔드포인트 명세

### 1. 블로그 관련 API

#### 1.1 게시글 발행 워크플로우
- **엔드포인트**: `POST /webhook/blog/publish`
- **용도**: 게시글 발행 시 자동화 작업
- **워크플로우**:
  1. 게시글 내용 검증 및 정제
  2. 이미지 최적화 및 CDN 업로드
  3. SEO 메타데이터 생성
  4. 구독자에게 이메일 발송
  5. 소셜 미디어 자동 포스팅 (옵션)
  6. 검색 인덱스 업데이트
- **입력**:
  ```json
  {
    "blog_id": "uuid",
    "title": "string",
    "content": "string",
    "author_id": "uuid",
    "publish_immediately": "boolean",
    "notify_subscribers": "boolean"
  }
  ```
- **출력**:
  ```json
  {
    "success": true,
    "blog_id": "uuid",
    "published_at": "timestamp",
    "notifications_sent": 123,
    "seo_score": 85
  }
  ```

#### 1.2 컨텐츠 분석 워크플로우
- **엔드포인트**: `POST /webhook/blog/analyze`
- **용도**: AI 기반 컨텐츠 분석 및 제안
- **워크플로우**:
  1. 텍스트 분석 (가독성, 키워드, 감정)
  2. 문법 검사
  3. SEO 최적화 제안
  4. 관련 태그 자동 생성
  5. 카테고리 추천
- **입력**:
  ```json
  {
    "title": "string",
    "content": "string",
    "language": "ko"
  }
  ```
- **출력**:
  ```json
  {
    "readability_score": 75,
    "seo_suggestions": ["string"],
    "suggested_tags": ["tag1", "tag2"],
    "suggested_category": "tech",
    "grammar_issues": []
  }
  ```

#### 1.3 이미지 처리 워크플로우
- **엔드포인트**: `POST /webhook/media/process`
- **용도**: 업로드된 이미지 자동 처리
- **워크플로우**:
  1. 이미지 크기 조정 (썸네일, 중간, 원본)
  2. WebP 변환
  3. 메타데이터 추출
  4. CDN 업로드
  5. Supabase Storage 저장
- **입력**:
  ```json
  {
    "image_url": "string",
    "blog_id": "uuid",
    "sizes": ["thumbnail", "medium", "large"]
  }
  ```
- **출력**:
  ```json
  {
    "urls": {
      "thumbnail": "url",
      "medium": "url",
      "large": "url",
      "original": "url"
    },
    "metadata": {
      "width": 1920,
      "height": 1080,
      "format": "webp",
      "size_kb": 245
    }
  }
  ```

### 2. 알림 관련 API

#### 2.1 이메일 알림 워크플로우
- **엔드포인트**: `POST /webhook/notification/email`
- **용도**: 다양한 이벤트에 대한 이메일 발송
- **워크플로우**:
  1. 사용자 구독 설정 확인
  2. 이메일 템플릿 선택 및 렌더링
  3. 발송 큐에 추가
  4. 발송 상태 추적
- **입력**:
  ```json
  {
    "type": "new_post | comment | mention | newsletter",
    "recipient_ids": ["uuid"],
    "data": {
      "blog_title": "string",
      "blog_url": "string"
    },
    "priority": "high | normal | low"
  }
  ```
- **출력**:
  ```json
  {
    "queued": 50,
    "sent": 48,
    "failed": 2,
    "queue_id": "string"
  }
  ```

#### 2.2 실시간 알림 워크플로우
- **엔드포인트**: `POST /webhook/notification/realtime`
- **용도**: 웹소켓을 통한 실시간 알림
- **워크플로우**:
  1. 사용자 온라인 상태 확인
  2. Supabase Realtime으로 알림 전송
  3. 미확인 알림 DB 저장
- **입력**:
  ```json
  {
    "user_id": "uuid",
    "type": "comment | like | follow",
    "message": "string",
    "link": "string"
  }
  ```

### 3. 사용자 관련 API

#### 3.1 회원가입 후 온보딩 워크플로우
- **엔드포인트**: `POST /webhook/user/onboarding`
- **용도**: 신규 회원 온보딩 자동화
- **워크플로우**:
  1. 환영 이메일 발송
  2. 기본 프로필 설정 안내
  3. 추천 블로그 목록 생성
  4. CRM 시스템 동기화
  5. 분석 이벤트 기록
- **입력**:
  ```json
  {
    "user_id": "uuid",
    "email": "string",
    "first_name": "string",
    "signup_source": "google | email"
  }
  ```

#### 3.2 사용자 활동 분석 워크플로우
- **엔드포인트**: `POST /webhook/user/activity`
- **용도**: 사용자 행동 분석 및 추천
- **워크플로우**:
  1. 활동 데이터 수집
  2. Google Analytics 전송
  3. 개인화 추천 생성
  4. 이탈 위험 사용자 감지
- **입력**:
  ```json
  {
    "user_id": "uuid",
    "action": "view | like | comment | share",
    "target_id": "uuid",
    "metadata": {}
  }
  ```

### 4. 관리자 관련 API

#### 4.1 컨텐츠 심사 워크플로우
- **엔드포인트**: `POST /webhook/admin/moderate`
- **용도**: AI 기반 컨텐츠 자동 심사
- **워크플로우**:
  1. 욕설/유해 컨텐츠 감지
  2. 스팸 필터링
  3. 저작권 침해 검사
  4. 관리자에게 리포트 전송
- **입력**:
  ```json
  {
    "content_id": "uuid",
    "content_type": "blog | comment",
    "text": "string"
  }
  ```
- **출력**:
  ```json
  {
    "approved": true,
    "flags": ["potential_spam"],
    "confidence": 0.75,
    "action": "approve | review | reject"
  }
  ```

#### 4.2 백업 및 보고서 워크플로우
- **엔드포인트**: `POST /webhook/admin/backup`
- **용도**: 정기 백업 및 리포트 생성
- **워크플로우**:
  1. 데이터베이스 백업
  2. 일일/주간/월간 리포트 생성
  3. 클라우드 스토리지 업로드
  4. 관리자에게 이메일 발송

### 5. 통합 API

#### 5.1 검색 인덱싱 워크플로우
- **엔드포인트**: `POST /webhook/search/index`
- **용도**: Elasticsearch/Algolia 검색 인덱스 업데이트
- **워크플로우**:
  1. 컨텐츠 전처리
  2. 검색 엔진 API 호출
  3. 인덱스 상태 확인

#### 5.2 소셜 미디어 통합 워크플로우
- **엔드포인트**: `POST /webhook/social/share`
- **용도**: 자동 소셜 미디어 포스팅
- **워크플로우**:
  1. 게시글 요약 생성
  2. OG 이미지 생성
  3. Twitter/Facebook/LinkedIn API 호출
  4. 분석 데이터 기록

## 보안 및 인증

### Webhook 인증 방식

1. **API Key 인증**
   - 환경변수로 관리
   - 요청 헤더에 `X-API-Key` 포함

2. **HMAC 서명 검증**
   - 요청 본문의 HMAC 서명 생성
   - 서명 일치 여부 확인

3. **IP 화이트리스트**
   - n8n 서버 IP만 허용

### 에러 처리

- **재시도 로직**: 실패 시 3회까지 재시도 (exponential backoff)
- **Dead Letter Queue**: 최종 실패 시 별도 큐로 이동
- **에러 알림**: 관리자에게 Slack/이메일 알림

## 성능 최적화

1. **비동기 처리**: 즉시 응답 필요 없는 작업은 백그라운드 처리
2. **배치 처리**: 여러 요청을 묶어서 처리
3. **캐싱**: Redis를 활용한 결과 캐싱
4. **Rate Limiting**: API 호출 제한 (100 req/min)

## 모니터링 및 로깅

- **로그 수집**: n8n 워크플로우 실행 로그
- **성능 측정**: 각 워크플로우 실행 시간 추적
- **알림**: 에러율 임계값 초과 시 알림
- **대시보드**: Grafana로 워크플로우 상태 모니터링

## 다음 단계

1. [x] 백엔드 아키텍처 설계
2. [ ] API 엔드포인트 상세 명세 작성
3. [ ] n8n 워크플로우 JSON 파일 생성
4. [ ] Next.js 연동 코드 작성
5. [ ] 테스트 및 배포
