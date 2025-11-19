# n8n 백엔드 구현 체크리스트

## ✅ 완료된 작업

### 1. Supabase 데이터베이스 스키마
- ✅ `blogs` 테이블 생성
  - 파일: `supabase/migrations/20250118000001_create_blogs_table.sql`
  - 컬럼: id, title, content, author_id, meta_description, meta_keywords, status, published_at, created_at, updated_at
  - RLS 정책: 발행된 게시글은 모두 볼 수 있음, 자신의 게시글만 수정/삭제 가능
  - 인덱스: author_id, status, published_at

### 2. 환경 변수 설정
- ✅ `.env.local`에 n8n 설정 추가
  ```env
  N8N_BACKEND_URL=https://n8n.srv1136481.hstgr.cloud/webhook
  N8N_API_KEY=eyJhbGc...
  ```

### 3. Next.js 코드 업데이트
- ✅ `lib/env.ts`: n8n 환경 변수 추가 및 검증
- ✅ `lib/n8n/client.ts`: n8n API 클라이언트 생성
- ✅ `app/actions/blog.ts`: n8n 통합
  - `createBlog()`: n8n publishBlog 호출
  - `analyzeBlogContent()`: AI 컨텐츠 분석 기능 추가

### 4. n8n 워크플로우
- ✅ `blog-publish-v1.json` 생성 및 import 완료

---

## 📝 다음 단계 (선택 사항)

### Option 1: 기본 테스트 (추천)
현재 구현만으로도 동작합니다. 바로 테스트해보세요!

1. **개발 서버 실행**
   ```bash
   npm run dev
   ```

2. **n8n 워크플로우 활성화**
   - n8n 에디터 열기: https://n8n.srv1136481.hstgr.cloud
   - `blog-publish-v1` 워크플로우 열기
   - 우측 상단 "Inactive" → "Active"로 변경

3. **블로그 작성 페이지에서 테스트**
   - http://localhost:3000/blog/new
   - 게시글 작성 및 발행
   - n8n "Executions" 탭에서 실행 결과 확인

### Option 2: 추가 기능 구현

#### A. 컨텐츠 분석 UI 추가
현재 `analyzeBlogContent()` 함수는 있지만 UI가 없습니다.

**작업 파일**: `app/blog/new/page.tsx`

추가 기능:
- "AI 분석" 버튼
- 분석 결과 표시 (가독성 점수, SEO 점수, 제안 사항)
- 추천 태그 표시

#### B. 추가 n8n 워크플로우 생성
- `blog-analyze-v1.json`: 컨텐츠 분석 워크플로우
- `notification-email-v1.json`: 이메일 알림
- `user-onboarding-v1.json`: 사용자 온보딩

#### C. 추가 Supabase 테이블
현재 `subscribers` 테이블이 없어서 이메일 알림이 작동하지 않습니다.

```sql
CREATE TABLE subscribers (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🧪 테스트 방법

### 1. 환경 변수 확인
```bash
# 터미널에서 실행
npm run dev
```

콘솔에서 다음 경고가 **없으면** 성공:
```
⚠️  n8n backend configuration is missing
```

### 2. n8n 워크플로우 테스트

#### n8n 에디터에서
1. Webhook 노드 클릭
2. "Listen for Test Event" 클릭
3. 터미널에서 curl 실행:

```bash
curl -X POST \
  https://n8n.srv1136481.hstgr.cloud/webhook-test/blog/publish/v1 \
  -H 'Content-Type: application/json' \
  -H 'X-API-Key: eyJhbGc...' \
  -d '{
    "blog_id": "test-123",
    "title": "테스트 게시글",
    "content": "<p>테스트 내용입니다</p>",
    "author_id": "test-user",
    "publish_immediately": true,
    "notify_subscribers": false
  }'
```

4. n8n 에디터에서 실행 결과 확인

#### Production URL 테스트
1. 워크플로우를 Active로 변경
2. curl에서 `/webhook-test/` → `/webhook/`로 변경
3. 실행 후 n8n "Executions" 탭에서 결과 확인

### 3. Next.js 통합 테스트

#### 방법 1: 실제 블로그 작성
1. http://localhost:3000/auth/login 로그인
2. http://localhost:3000/blog/new 게시글 작성
3. "발행" 버튼 클릭
4. n8n "Executions" 탭에서 결과 확인
5. 브라우저 콘솔 및 터미널 로그 확인

#### 방법 2: 테스트 페이지 생성
```typescript
// app/test-n8n/page.tsx
'use client';

import { useState } from 'react';

export default function TestN8nPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testN8n = async () => {
    setLoading(true);

    const response = await fetch('/api/test-n8n', {
      method: 'POST',
    });

    const data = await response.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">n8n 테스트</h1>
      <button
        onClick={testN8n}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? '테스트 중...' : 'n8n 연결 테스트'}
      </button>
      {result && (
        <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
```

---

## 🐛 문제 해결

### 문제 1: n8n 호출 시 404 에러
**원인**: 워크플로우가 Inactive 상태
**해결**: n8n 에디터에서 워크플로우를 Active로 변경

### 문제 2: CORS 에러
**원인**: n8n Webhook 노드 CORS 설정
**해결**:
1. Webhook 노드 클릭
2. Options → Allowed Origins → "*" 또는 "http://localhost:3000"

### 문제 3: API Key 검증 실패
**원인**: 환경 변수 불일치
**해결**:
1. `.env.local`의 `N8N_API_KEY` 확인
2. n8n 워크플로우의 Validate Input 노드에서 사용하는 키와 일치 확인

### 문제 4: n8n이 설정되지 않았다는 경고
**원인**: 환경 변수가 비어있음
**해결**:
1. `.env.local` 파일 확인
2. 개발 서버 재시작 (`npm run dev`)

### 문제 5: Supabase에서 blogs 테이블을 찾을 수 없음
**원인**: 마이그레이션이 적용되지 않음
**해결**:
로컬 Supabase를 사용하는 경우:
```bash
supabase db reset
```

온라인 Supabase를 사용하는 경우:
- Supabase Dashboard → SQL Editor에서 마이그레이션 SQL 직접 실행

---

## 📊 현재 구조

```
blog-practice/
├── .env.local                          # ✅ n8n 환경 변수 추가됨
├── lib/
│   ├── env.ts                         # ✅ n8n 환경 변수 검증
│   └── n8n/
│       └── client.ts                  # ✅ n8n API 클라이언트
├── app/
│   └── actions/
│       └── blog.ts                    # ✅ n8n 통합됨
├── supabase/
│   └── migrations/
│       └── 20250118000001_create_blogs_table.sql  # ✅ blogs 테이블
└── .doc/
    ├── 01-plan/                       # 📋 계획 문서
    │   ├── backend-n8n-architecture.md
    │   ├── api-endpoints-specification.md
    │   ├── n8n-workflow-structure.md
    │   ├── nextjs-integration-guide.md
    │   ├── n8n-testing-guide.md
    │   └── implementation-checklist.md  # 이 파일
    └── 02-n8n-workflows/              # 🔧 n8n JSON
        └── blog-publish-v1.json
```

---

## 🎯 추천 학습 순서

### 계획 문서를 읽는 순서

1. **[README.md](..//README.md)**
   - 전체 프로젝트 개요
   - 문서 구조 이해

2. **[backend-n8n-architecture.md](backend-n8n-architecture.md)**
   - n8n 백엔드 아키텍처 이해
   - 워크플로우 설계 원칙

3. **[api-endpoints-specification.md](api-endpoints-specification.md)**
   - 제공할 API 엔드포인트 확인
   - 요청/응답 형식 이해

4. **[n8n-workflow-structure.md](n8n-workflow-structure.md)**
   - 워크플로우 노드 패턴 학습
   - 서브워크플로우 구조 이해

5. **[nextjs-integration-guide.md](nextjs-integration-guide.md)**
   - Next.js 통합 방법
   - 실제 구현 코드 예시

6. **[n8n-testing-guide.md](n8n-testing-guide.md)**
   - Test URL vs Production URL
   - 테스트 방법 및 디버깅

7. **[implementation-checklist.md](implementation-checklist.md)** (이 파일)
   - 현재 구현 상태 확인
   - 다음 단계 계획

---

## ✨ 구현된 기능

### 현재 사용 가능한 기능

1. **블로그 게시글 작성** (`createBlog`)
   - Supabase에 초안 저장
   - n8n으로 발행 요청
   - SEO 메타데이터 자동 생성 (n8n)
   - 이미지 최적화 (n8n)
   - 검색 인덱스 업데이트 (n8n)

2. **컨텐츠 분석** (`analyzeBlogContent`)
   - AI 기반 가독성 분석
   - SEO 최적화 제안
   - 문법 검사
   - 감정 분석
   - 자동 태그 추천

### 아직 구현되지 않은 기능

1. **이메일 알림**
   - `subscribers` 테이블 필요
   - 이메일 서비스 설정 필요 (Resend, SendGrid 등)

2. **소셜 미디어 공유**
   - Twitter/Facebook API 설정 필요

3. **사용자 온보딩**
   - 회원가입 시 자동 실행될 워크플로우

4. **컨텐츠 심사**
   - AI 기반 자동 심사 시스템

---

## 🚀 배포 전 체크리스트

프로덕션 배포 전 확인 사항:

- [ ] `.env.production`에 프로덕션 n8n URL 설정
- [ ] n8n 워크플로우를 프로덕션 인스턴스로 이동
- [ ] Supabase 프로덕션 데이터베이스에 마이그레이션 적용
- [ ] n8n API Key를 안전하게 관리 (환경 변수)
- [ ] n8n 워크플로우에서 에러 알림 설정 (Slack, Sentry)
- [ ] Rate Limiting 설정
- [ ] HTTPS 강제 적용
- [ ] CORS 설정 검토 (프로덕션 도메인만 허용)

---

## 📚 참고 문서

- **n8n 공식 문서**: https://docs.n8n.io
- **Supabase 공식 문서**: https://supabase.com/docs
- **Next.js 공식 문서**: https://nextjs.org/docs
- **OpenAI API 문서**: https://platform.openai.com/docs

---

## 💡 팁

1. **n8n 에디터를 항상 열어두세요**
   - 실시간으로 워크플로우 실행 결과 확인 가능
   - 에러 발생 시 즉시 디버깅

2. **Executions 탭을 자주 확인하세요**
   - 모든 워크플로우 실행 기록
   - 입력/출력 데이터 확인
   - 에러 메시지 확인

3. **작은 단위로 테스트하세요**
   - 먼저 n8n 워크플로우 단독 테스트
   - 그 다음 Next.js 통합 테스트
   - 마지막으로 전체 플로우 테스트

4. **로그를 확인하세요**
   - 브라우저 콘솔
   - 터미널 로그
   - n8n Executions 탭

---

## ✅ 최종 확인

구현이 완료되었습니다! 다음을 확인하세요:

- [x] Supabase `blogs` 테이블 생성
- [x] `.env.local`에 n8n 설정 추가
- [x] `lib/env.ts` 업데이트
- [x] `lib/n8n/client.ts` 생성
- [x] `app/actions/blog.ts` n8n 통합
- [x] n8n 워크플로우 import

**이제 바로 테스트할 수 있습니다!** 🎉
