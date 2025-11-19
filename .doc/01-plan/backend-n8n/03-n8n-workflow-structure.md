# n8n 워크플로우 구조 설계

## 개요

n8n 워크플로우의 구조, 노드 구성, 재사용 가능한 서브워크플로우 설계 방안입니다.

## 워크플로우 명명 규칙

```
[도메인]-[기능]-[버전]
예: blog-publish-v1, user-onboarding-v1, notification-email-v1
```

## 공통 노드 패턴

### 1. 입력 검증 패턴

모든 워크플로우의 시작 부분:

```
Webhook → Function (Validate Input) → IF (Valid?)
                                        ├─ True → 비즈니스 로직
                                        └─ False → Error Response
```

**Function 노드 예시**:
```javascript
// Validate Input
const body = $node["Webhook"].json.body;
const requiredFields = ['blog_id', 'title', 'content'];

const errors = [];
for (const field of requiredFields) {
  if (!body[field]) {
    errors.push(`Missing required field: ${field}`);
  }
}

return {
  valid: errors.length === 0,
  errors: errors,
  data: body
};
```

---

### 2. 에러 처리 패턴

모든 중요 노드 후:

```
API Call → IF (Success?)
            ├─ True → Continue
            └─ False → Error Handler
                       ├─ Log Error
                       ├─ Send Alert
                       └─ Return Error Response
```

**Error Handler Function**:
```javascript
// Error Handler
const error = $node["Previous Node"].json.error;
const context = {
  workflow_name: $workflow.name,
  execution_id: $execution.id,
  timestamp: new Date().toISOString(),
  error_message: error?.message || 'Unknown error',
  stack_trace: error?.stack
};

// Log to external service (e.g., Sentry)
return {
  ...context,
  severity: 'error',
  notify_admin: true
};
```

---

### 3. 응답 형식 패턴

워크플로우 종료 전:

```
Business Logic → Function (Format Response) → Respond to Webhook
```

**Response Formatter**:
```javascript
// Format Response
const result = $node["Business Logic"].json;

return {
  success: true,
  data: result,
  metadata: {
    timestamp: new Date().toISOString(),
    workflow_id: $workflow.id,
    execution_time_ms: $execution.startedAt
      ? Date.now() - new Date($execution.startedAt).getTime()
      : 0
  }
};
```

---

## 재사용 가능한 서브워크플로우

### 1. 이메일 발송 서브워크플로우

**파일명**: `sub-send-email-v1.json`

**입력**:
```json
{
  "to": "user@example.com",
  "template_name": "new_post",
  "template_data": {
    "blog_title": "제목",
    "blog_url": "https://..."
  },
  "priority": "normal"
}
```

**노드 구성**:
1. Execute Workflow Trigger
2. Function (Validate Email Input)
3. HTTP Request (Fetch Email Template)
4. Function (Render Template)
5. Send Email (SMTP/SendGrid/Resend)
6. IF (Success?)
   - True → Log Success
   - False → Retry Logic
7. Return to Parent Workflow

---

### 2. 이미지 최적화 서브워크플로우

**파일명**: `sub-optimize-image-v1.json`

**입력**:
```json
{
  "image_url": "https://...",
  "sizes": ["thumbnail", "medium", "large"],
  "convert_to_webp": true
}
```

**노드 구성**:
1. Execute Workflow Trigger
2. HTTP Request (Download Image)
3. Function (Extract Metadata)
4. Loop Over Sizes
   - Resize Image (Cloudinary/ImageMagick)
   - Convert to WebP
   - Upload to CDN
5. Return URLs

---

### 3. 검색 인덱스 업데이트 서브워크플로우

**파일명**: `sub-update-search-index-v1.json`

**입력**:
```json
{
  "action": "index | update | delete",
  "document_id": "blog-123",
  "document_type": "blog",
  "data": {}
}
```

**노드 구성**:
1. Execute Workflow Trigger
2. Switch (Action Type)
   - Index → Algolia Add Object
   - Update → Algolia Update Object
   - Delete → Algolia Delete Object
3. Return Status

---

### 4. Supabase 쿼리 서브워크플로우

**파일명**: `sub-supabase-query-v1.json`

**입력**:
```json
{
  "table": "profiles",
  "operation": "select | insert | update | delete",
  "filters": {},
  "data": {}
}
```

**노드 구성**:
1. Execute Workflow Trigger
2. Function (Build Supabase Query)
3. HTTP Request (Supabase REST API)
4. Function (Parse Response)
5. Return Data

---

## 메인 워크플로우 설계

### 1. 블로그 발행 워크플로우

**파일명**: `blog-publish-v1.json`

**노드 다이어그램**:
```
1. Webhook (POST /webhook/blog/publish)
   ↓
2. Function (Validate Input)
   ↓
3. IF (Valid Input?)
   ├─ False → 4. Error Response
   └─ True → 5. Continue
             ↓
6. HTTP Request (Get Blog from Supabase)
   ↓
7. Function (Extract Image URLs)
   ↓
8. Loop (For Each Image)
   ├─ 9. Execute Workflow (sub-optimize-image-v1)
   └─ 10. Collect Optimized URLs
   ↓
11. Function (Generate SEO Metadata)
    ├─ OpenAI (Generate Description)
    └─ OpenAI (Generate Keywords)
   ↓
12. HTTP Request (Update Blog with Metadata)
   ↓
13. IF (Notify Subscribers?)
    └─ True → 14. HTTP Request (Get Subscribers)
              ↓
              15. Loop (For Each Subscriber)
                  └─ 16. Execute Workflow (sub-send-email-v1)
   ↓
17. IF (Social Share?)
    └─ True → 18. Execute Workflow (social-share-v1)
   ↓
19. Execute Workflow (sub-update-search-index-v1)
   ↓
20. HTTP Request (Track Analytics Event)
   ↓
21. Function (Format Success Response)
   ↓
22. Respond to Webhook
```

**예상 실행 시간**: 3-8초

---

### 2. 컨텐츠 분석 워크플로우

**파일명**: `blog-analyze-v1.json`

**노드 다이어그램**:
```
1. Webhook (POST /webhook/blog/analyze)
   ↓
2. Function (Validate Input)
   ↓
3. Parallel Execution (모든 분석 동시 실행)
   ├─ 4a. OpenAI (Readability Analysis)
   ├─ 4b. OpenAI (SEO Analysis)
   ├─ 4c. OpenAI (Grammar Check)
   ├─ 4d. OpenAI (Sentiment Analysis)
   └─ 4e. OpenAI (Tag/Category Suggestion)
   ↓
5. Function (Merge Analysis Results)
   ↓
6. Function (Generate Recommendations)
   ↓
7. Function (Format Response)
   ↓
8. Respond to Webhook
```

**예상 실행 시간**: 2-5초 (병렬 처리)

---

### 3. 사용자 온보딩 워크플로우

**파일명**: `user-onboarding-v1.json`

**노드 다이어그램**:
```
1. Webhook (POST /webhook/user/onboarding)
   ↓
2. Function (Validate Input)
   ↓
3. Execute Workflow (sub-send-email-v1)
   - Template: welcome_email
   ↓
4. HTTP Request (Initialize User Profile in Supabase)
   ↓
5. HTTP Request (Get Recommended Blogs)
   ↓
6. HTTP Request (Sync to CRM - HubSpot/Salesforce)
   ↓
7. HTTP Request (Track Analytics Event)
   ↓
8. Function (Generate Onboarding Checklist)
   ↓
9. HTTP Request (Store Checklist in Supabase)
   ↓
10. Function (Format Response)
   ↓
11. Respond to Webhook
```

---

### 4. 이메일 알림 워크플로우

**파일명**: `notification-email-v1.json`

**노드 다이어그램**:
```
1. Webhook (POST /webhook/notification/email)
   ↓
2. Function (Validate Input)
   ↓
3. Switch (Notification Type)
   ├─ new_post → 4a. Set Template (new_post)
   ├─ comment → 4b. Set Template (comment)
   ├─ mention → 4c. Set Template (mention)
   └─ newsletter → 4d. Set Template (newsletter)
   ↓
5. HTTP Request (Get Recipient Details from Supabase)
   ↓
6. Function (Check User Notification Preferences)
   ↓
7. IF (User Allows Notifications?)
   └─ True → 8. Loop (For Each Recipient)
             ├─ 9. Function (Personalize Template Data)
             ├─ 10. Execute Workflow (sub-send-email-v1)
             └─ 11. HTTP Request (Log Notification to Supabase)
   ↓
12. Function (Aggregate Results)
   ↓
13. Function (Format Response)
   ↓
14. Respond to Webhook
```

---

### 5. 컨텐츠 심사 워크플로우

**파일명**: `admin-moderate-v1.json`

**노드 다이어그램**:
```
1. Webhook (POST /webhook/admin/moderate)
   ↓
2. Function (Validate Input)
   ↓
3. Parallel Execution (모든 검사 동시 실행)
   ├─ 4a. OpenAI Moderation API (Profanity)
   ├─ 4b. Function (Spam Detection - Link Count)
   ├─ 4c. HTTP Request (Copyright Check API)
   └─ 4d. OpenAI (Safety Analysis)
   ↓
5. Function (Aggregate Check Results)
   ↓
6. Function (Calculate Overall Score)
   ↓
7. IF (Score < Threshold?)
   └─ True → 8. Execute Workflow (sub-send-email-v1)
             - Notify Admin
   ↓
9. HTTP Request (Update Content Status in Supabase)
   ↓
10. Function (Format Response)
   ↓
11. Respond to Webhook
```

---

## 환경 변수 구성

n8n 환경 변수 설정:

```env
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...

# OpenAI
OPENAI_API_KEY=sk-...

# Email Service (Resend/SendGrid)
EMAIL_API_KEY=re_...
EMAIL_FROM_ADDRESS=noreply@example.com

# CDN/Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# Search (Algolia)
ALGOLIA_APP_ID=xxx
ALGOLIA_API_KEY=xxx
ALGOLIA_INDEX_NAME=blogs

# Analytics (Google Analytics)
GA_MEASUREMENT_ID=G-xxx
GA_API_SECRET=xxx

# Social Media
TWITTER_API_KEY=xxx
TWITTER_API_SECRET=xxx
FACEBOOK_ACCESS_TOKEN=xxx

# Security
N8N_WEBHOOK_SECRET=your-webhook-secret
N8N_API_KEY=your-api-key

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

---

## 모니터링 및 로깅

### 1. 실행 로그 저장

모든 워크플로우에 추가:

```
Final Step → HTTP Request (Log to External Service)
```

**로그 페이로드**:
```json
{
  "workflow_name": "$workflow.name",
  "execution_id": "$execution.id",
  "status": "success | error",
  "duration_ms": 1234,
  "timestamp": "2025-01-18T12:00:00Z",
  "input": {},
  "output": {},
  "error": null
}
```

---

### 2. 에러 알림

에러 발생 시 Slack 알림:

```
Error Handler → Slack (Send Message)
```

**Slack 메시지 형식**:
```json
{
  "channel": "#n8n-alerts",
  "text": "🚨 Workflow Error",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Workflow:* blog-publish-v1\n*Error:* API timeout\n*Time:* 2025-01-18 12:00:00"
      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": "View Execution",
          "url": "https://n8n.example.com/execution/..."
        }
      ]
    }
  ]
}
```

---

## 성능 최적화

### 1. 병렬 실행

독립적인 작업은 병렬 처리:
- Split In Batches 노드 사용
- Merge 노드로 결과 통합

### 2. 캐싱

자주 조회되는 데이터 캐싱:
- Redis 노드 사용
- TTL: 5분 ~ 1시간

### 3. 배치 처리

대량 작업은 배치 처리:
- Queue 노드 사용
- 시간당 최대 1000개 제한

---

## 배포 전략

### 1. 버전 관리

- 모든 워크플로우는 버전 포함 (`-v1`, `-v2`)
- 변경 시 새 버전 생성, 이전 버전 유지
- Webhook URL도 버전 포함 (`/webhook/blog/publish/v1`)

### 2. 테스트 환경

- Development: `https://n8n-dev.example.com`
- Staging: `https://n8n-staging.example.com`
- Production: `https://n8n.example.com`

### 3. 롤백 계획

- 이전 버전 워크플로우 비활성화하지 않고 유지
- 문제 발생 시 Webhook URL만 변경하여 롤백

---

## 다음 단계

이제 실제 n8n JSON 워크플로우 파일을 생성합니다.
