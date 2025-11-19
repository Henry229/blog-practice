# n8n 테스트 및 개발 가이드

## Test URL vs Production URL

### Test URL (webhook-test)
```
https://n8n.srv1136481.hstgr.cloud/webhook-test/blog/publish/v1
```

**특징**:
- n8n 에디터에서 "Listen for Test Event" 버튼 클릭 시 활성화
- **일회성**: 한 번의 요청만 받고 자동으로 중지
- 워크플로우가 Inactive 상태여도 사용 가능
- **용도**: 워크플로우 개발 및 디버깅

**사용 시나리오**:
1. 새로운 노드 추가 후 즉시 테스트
2. Function 노드 코드 수정 후 확인
3. 에러 발생 시 디버깅

### Production URL (webhook) ✅
```
https://n8n.srv1136481.hstgr.cloud/webhook/blog/publish/v1
```

**특징**:
- 워크플로우가 **Active** 상태일 때 작동
- **무제한**: 계속해서 요청 받음
- 실제 애플리케이션에서 사용
- **용도**: 로컬 개발, 스테이징, 프로덕션 모두

**사용 시나리오**:
1. Next.js 개발 중 실제 호출
2. 통합 테스트
3. 프로덕션 배포

## 개발 환경 구성

### 환경별 설정

#### 1. 로컬 개발 (.env.local)
```env
# Production URL 사용 (워크플로우 Active 상태 유지)
N8N_BACKEND_URL=https://n8n.srv1136481.hstgr.cloud/webhook
N8N_API_KEY=dev-api-key-12345

# Supabase 로컬
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=local-anon-key
```

#### 2. 스테이징 (.env.staging)
```env
# 동일한 n8n 인스턴스 또는 별도 스테이징 인스턴스
N8N_BACKEND_URL=https://n8n-staging.yourdomain.com/webhook
N8N_API_KEY=staging-api-key-67890

# Supabase 스테이징
NEXT_PUBLIC_SUPABASE_URL=https://staging.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=staging-anon-key
```

#### 3. 프로덕션 (.env.production)
```env
# 프로덕션 n8n 인스턴스
N8N_BACKEND_URL=https://n8n.yourdomain.com/webhook
N8N_API_KEY=prod-api-key-secure-xyz

# Supabase 프로덕션
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key
```

## 개발 워크플로우

### 1. 워크플로우 개발 단계

```
1. n8n 에디터에서 워크플로우 열기
   ↓
2. 노드 추가/수정
   ↓
3. "Listen for Test Event" 클릭
   ↓
4. Postman/curl로 Test URL에 요청
   ↓
5. 실행 결과 확인 및 디버깅
   ↓
6. 반복 (2-5)
   ↓
7. 완료 후 "Save" → "Active"로 변경
```

### 2. Next.js 통합 개발 단계

```
1. 워크플로우를 Active 상태로 유지
   ↓
2. Next.js에서 API 클라이언트 코드 작성
   ↓
3. localhost:3000에서 테스트
   ↓
4. n8n "Executions" 탭에서 결과 확인
   ↓
5. 에러 발생 시 → n8n 에디터에서 수정 → 다시 테스트
```

## 테스트 방법

### 1. n8n 에디터에서 테스트 (Test URL)

#### Webhook 노드 설정 확인
```json
{
  "httpMethod": "POST",
  "path": "blog/publish/v1",
  "responseMode": "responseNode"
}
```

#### 테스트 실행
1. Webhook 노드 클릭
2. **"Listen for Test Event"** 버튼 클릭
3. Test URL이 활성화됨:
   ```
   https://n8n.srv1136481.hstgr.cloud/webhook-test/blog/publish/v1
   ```

#### curl로 요청 보내기
```bash
curl -X POST \
  https://n8n.srv1136481.hstgr.cloud/webhook-test/blog/publish/v1 \
  -H 'Content-Type: application/json' \
  -H 'X-API-Key: dev-api-key-12345' \
  -d '{
    "blog_id": "test-123",
    "title": "테스트 게시글",
    "content": "<p>테스트 내용입니다</p>",
    "author_id": "user-123",
    "publish_immediately": true,
    "notify_subscribers": false
  }'
```

#### 결과 확인
- n8n 에디터에서 실시간으로 각 노드 실행 결과 표시
- 에러 발생 시 해당 노드에 빨간색 표시

### 2. Next.js에서 테스트 (Production URL)

#### 워크플로우 활성화
1. n8n 에디터 상단 우측 **"Inactive"** 클릭
2. **"Active"**로 변경
3. Production URL 활성화:
   ```
   https://n8n.srv1136481.hstgr.cloud/webhook/blog/publish/v1
   ```

#### Next.js 테스트 코드
```typescript
// app/test-n8n/page.tsx
'use client';

import { useState } from 'react';
import { n8n } from '@/lib/n8n/client';

export default function TestN8nPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testPublish = async () => {
    setLoading(true);

    const response = await n8n.publishBlog({
      blog_id: 'test-' + Date.now(),
      title: '테스트 게시글',
      content: '<p>테스트 내용입니다</p>',
      author_id: 'test-user',
      publish_immediately: true,
      notify_subscribers: false,
    });

    setResult(response);
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">n8n Webhook 테스트</h1>

      <button
        onClick={testPublish}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? '테스트 중...' : '블로그 발행 테스트'}
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

#### 실행
```bash
npm run dev
# http://localhost:3000/test-n8n 접속
```

### 3. Postman으로 테스트

#### Production URL 테스트

**Request**:
```
POST https://n8n.srv1136481.hstgr.cloud/webhook/blog/publish/v1

Headers:
- Content-Type: application/json
- X-API-Key: dev-api-key-12345

Body (JSON):
{
  "blog_id": "test-123",
  "title": "테스트 게시글",
  "content": "<p>테스트 내용</p>",
  "author_id": "user-123",
  "publish_immediately": true,
  "notify_subscribers": false
}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "blog_id": "test-123",
    "published_at": "2025-01-18T12:00:00Z",
    "notifications": {
      "email_sent": 0,
      "email_failed": 0
    },
    "seo": {
      "score": 85,
      "meta_generated": true,
      "meta_description": "...",
      "meta_keywords": "..."
    },
    "images_processed": 0,
    "search_indexed": true
  },
  "metadata": {
    "timestamp": "2025-01-18T12:00:00Z",
    "workflow_id": "blog-publish-v1",
    "execution_time_ms": 3421
  }
}
```

## n8n 실행 결과 확인

### Executions 탭
1. n8n 좌측 메뉴에서 **"Executions"** 클릭
2. 최근 실행 목록 확인
3. 특정 실행 클릭 → 상세 결과 확인

### 확인 항목
- **Status**: Success (초록색) / Error (빨간색)
- **Execution Time**: 실행 시간 (ms)
- **Input/Output**: 각 노드의 입력/출력 데이터
- **Error Messages**: 에러 발생 시 상세 메시지

## 디버깅 팁

### 1. Function 노드 디버깅
```javascript
// Function 노드 내부
const data = $input.item.json;

// 디버깅 로그 (Executions 탭에서 확인)
console.log('Input data:', data);
console.log('Blog ID:', data.blog_id);

return {
  debug: {
    input: data,
    processed: processedData
  },
  result: processedData
};
```

### 2. HTTP Request 노드 에러
- **Status Code**: 응답 코드 확인 (200, 400, 500 등)
- **Response Body**: 에러 메시지 확인
- **Headers**: 인증 헤더 확인

### 3. IF 노드 조건 확인
```javascript
// 조건 표현식 디버깅
={{$json.valid}}  // 현재 값 확인
={{$json.valid === true}}  // boolean 비교
```

## 환경별 API Key 관리

### n8n 환경 변수 설정

n8n 설정 파일 또는 Docker 환경 변수:
```env
# Development
N8N_API_KEY=dev-api-key-12345

# Staging
N8N_API_KEY=staging-api-key-67890

# Production
N8N_API_KEY=prod-api-key-secure-xyz
```

### Next.js 환경별 설정

#### .env.local (로컬)
```env
N8N_API_KEY=dev-api-key-12345
```

#### .env.production (프로덕션)
```env
N8N_API_KEY=prod-api-key-secure-xyz
```

## 추천 개발 순서

### Phase 1: 워크플로우 단독 테스트
1. ✅ n8n에 워크플로우 import
2. ✅ Test URL로 기본 동작 확인
3. ✅ 각 노드별 입력/출력 검증
4. ✅ 에러 핸들링 테스트
5. ✅ Active 상태로 전환

### Phase 2: Next.js 통합
1. ✅ 환경 변수 설정
2. ✅ API 클라이언트 생성
3. ✅ 테스트 페이지 작성
4. ✅ Production URL 호출 테스트
5. ✅ 에러 처리 확인

### Phase 3: 실제 기능 통합
1. ✅ Server Action 업데이트
2. ✅ 실제 블로그 작성 폼 연동
3. ✅ 통합 테스트
4. ✅ 성능 측정

## 문제 해결

### Test URL이 응답하지 않음
- **원인**: "Listen for Test Event" 버튼을 클릭하지 않음
- **해결**: Webhook 노드 선택 → "Listen for Test Event" 클릭

### Production URL이 404 에러
- **원인**: 워크플로우가 Inactive 상태
- **해결**: 워크플로우를 Active로 변경

### API Key 검증 실패
- **원인**: 환경 변수 불일치
- **해결**: n8n과 Next.js의 API Key 일치 확인

### CORS 에러
- **원인**: Webhook 노드 CORS 설정
- **해결**: Webhook 노드 → Options → Allowed Origins → "*" 또는 특정 도메인

## 요약

| 구분 | Test URL | Production URL |
|------|----------|----------------|
| **경로** | `/webhook-test/...` | `/webhook/...` |
| **활성화** | Listen 버튼 클릭 | 워크플로우 Active |
| **요청 제한** | 1회 | 무제한 |
| **용도** | 워크플로우 개발 | 실제 사용 |
| **개발 시 사용** | ❌ (불편함) | ✅ (추천) |

**결론**: 로컬 개발 중에도 **Production URL** 사용을 추천합니다!
