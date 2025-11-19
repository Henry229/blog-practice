# API 엔드포인트 상세 명세

## 개요

n8n 백엔드에서 제공할 API 엔드포인트의 상세 명세입니다. 각 엔드포인트는 RESTful 원칙을 따르며, Webhook 방식으로 구현됩니다.

## 공통 사항

### Base URL
```
Production: https://n8n.yourdomain.com/webhook
Development: http://localhost:5678/webhook
```

### 인증 헤더
```http
X-API-Key: your-secret-api-key
Content-Type: application/json
```

### 공통 응답 형식
```json
{
  "success": true | false,
  "data": {},
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  },
  "metadata": {
    "timestamp": "2025-01-18T12:00:00Z",
    "workflow_id": "uuid",
    "execution_time_ms": 123
  }
}
```

### 에러 코드
- `AUTH_FAILED`: 인증 실패
- `VALIDATION_ERROR`: 입력 검증 실패
- `RESOURCE_NOT_FOUND`: 리소스 없음
- `RATE_LIMIT_EXCEEDED`: API 호출 제한 초과
- `INTERNAL_ERROR`: 내부 서버 오류
- `EXTERNAL_SERVICE_ERROR`: 외부 서비스 오류

---

## 1. 블로그 API

### 1.1 게시글 발행

**엔드포인트**: `POST /webhook/blog/publish`

**설명**: 새 게시글 발행 시 자동화된 후처리 작업 수행

**요청**:
```json
{
  "blog_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Next.js 16 완벽 가이드",
  "content": "<p>게시글 내용...</p>",
  "author_id": "660e8400-e29b-41d4-a716-446655440001",
  "publish_immediately": true,
  "notify_subscribers": true,
  "social_share": {
    "twitter": true,
    "facebook": false
  }
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "blog_id": "550e8400-e29b-41d4-a716-446655440000",
    "published_at": "2025-01-18T12:30:00Z",
    "notifications": {
      "email_sent": 123,
      "email_failed": 2
    },
    "seo": {
      "score": 85,
      "meta_generated": true
    },
    "social": {
      "twitter_posted": true,
      "twitter_url": "https://twitter.com/..."
    },
    "images_processed": 5
  }
}
```

**워크플로우 단계**:
1. 입력 검증
2. 이미지 URL 추출 및 최적화
3. SEO 메타데이터 생성 (title, description, keywords)
4. 구독자 목록 조회
5. 이메일 템플릿 렌더링 및 발송
6. 소셜 미디어 포스팅
7. 검색 인덱스 업데이트 (Algolia/Elasticsearch)
8. 분석 이벤트 기록

---

### 1.2 컨텐츠 분석

**엔드포인트**: `POST /webhook/blog/analyze`

**설명**: AI를 활용한 컨텐츠 품질 분석 및 개선 제안

**요청**:
```json
{
  "title": "Next.js 16 완벽 가이드",
  "content": "게시글 본문 내용...",
  "language": "ko",
  "analysis_type": ["seo", "readability", "grammar", "sentiment"]
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "readability": {
      "score": 75,
      "grade_level": "중급",
      "avg_sentence_length": 18,
      "suggestions": [
        "문장을 더 짧게 나누세요",
        "전문 용어에 설명을 추가하세요"
      ]
    },
    "seo": {
      "score": 85,
      "keyword_density": 2.3,
      "meta_description_ok": true,
      "suggestions": [
        "H1 태그를 추가하세요",
        "내부 링크를 3개 이상 추가하세요"
      ]
    },
    "grammar": {
      "errors": [],
      "warnings": [
        {
          "type": "spacing",
          "position": 145,
          "suggestion": "띄어쓰기를 확인하세요"
        }
      ]
    },
    "sentiment": {
      "score": 0.7,
      "tone": "긍정적",
      "emotion": "informative"
    },
    "tags": {
      "suggested": ["Next.js", "React", "Web Development"],
      "confidence": [0.95, 0.88, 0.76]
    },
    "category": {
      "suggested": "개발/프로그래밍",
      "confidence": 0.92
    }
  }
}
```

---

### 1.3 이미지 처리

**엔드포인트**: `POST /webhook/media/process`

**설명**: 업로드된 이미지 자동 최적화 및 다중 크기 생성

**요청**:
```json
{
  "image_url": "https://storage.example.com/original/image.jpg",
  "blog_id": "550e8400-e29b-41d4-a716-446655440000",
  "sizes": ["thumbnail", "medium", "large", "og"],
  "optimize": true,
  "convert_to_webp": true
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "original": {
      "url": "https://cdn.example.com/original/image.jpg",
      "width": 3840,
      "height": 2160,
      "size_kb": 2456,
      "format": "jpg"
    },
    "processed": {
      "thumbnail": {
        "url": "https://cdn.example.com/thumb/image.webp",
        "width": 300,
        "height": 169,
        "size_kb": 15
      },
      "medium": {
        "url": "https://cdn.example.com/medium/image.webp",
        "width": 800,
        "height": 450,
        "size_kb": 45
      },
      "large": {
        "url": "https://cdn.example.com/large/image.webp",
        "width": 1920,
        "height": 1080,
        "size_kb": 180
      },
      "og": {
        "url": "https://cdn.example.com/og/image.webp",
        "width": 1200,
        "height": 630,
        "size_kb": 85
      }
    },
    "metadata": {
      "exif_removed": true,
      "color_space": "sRGB",
      "compression_ratio": 0.93
    }
  }
}
```

---

## 2. 알림 API

### 2.1 이메일 알림

**엔드포인트**: `POST /webhook/notification/email`

**설명**: 다양한 이벤트에 대한 이메일 발송

**요청**:
```json
{
  "type": "new_post",
  "recipient_ids": [
    "660e8400-e29b-41d4-a716-446655440001",
    "660e8400-e29b-41d4-a716-446655440002"
  ],
  "template_data": {
    "blog_title": "Next.js 16 완벽 가이드",
    "blog_url": "https://example.com/blog/123",
    "author_name": "홍길동",
    "excerpt": "Next.js 16의 새로운 기능들을..."
  },
  "priority": "normal",
  "schedule_at": null
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "queued": 2,
    "sent": 2,
    "failed": 0,
    "queue_id": "email-queue-123",
    "estimated_delivery": "2025-01-18T12:35:00Z",
    "details": [
      {
        "recipient_id": "660e8400-e29b-41d4-a716-446655440001",
        "email": "user1@example.com",
        "status": "sent",
        "message_id": "msg-001"
      },
      {
        "recipient_id": "660e8400-e29b-41d4-a716-446655440002",
        "email": "user2@example.com",
        "status": "sent",
        "message_id": "msg-002"
      }
    ]
  }
}
```

**이메일 타입**:
- `new_post`: 새 게시글 알림
- `comment`: 댓글 알림
- `mention`: 멘션 알림
- `newsletter`: 뉴스레터
- `welcome`: 가입 환영 이메일
- `password_reset`: 비밀번호 재설정

---

### 2.2 실시간 알림

**엔드포인트**: `POST /webhook/notification/realtime`

**설명**: Supabase Realtime을 통한 실시간 알림

**요청**:
```json
{
  "user_id": "660e8400-e29b-41d4-a716-446655440001",
  "type": "comment",
  "message": "홍길동님이 회원님의 게시글에 댓글을 남겼습니다",
  "link": "/blog/123#comment-456",
  "icon": "comment",
  "read": false
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "notification_id": "notif-789",
    "delivered": true,
    "user_online": true,
    "stored_in_db": true,
    "timestamp": "2025-01-18T12:30:00Z"
  }
}
```

---

## 3. 사용자 API

### 3.1 회원가입 후 온보딩

**엔드포인트**: `POST /webhook/user/onboarding`

**설명**: 신규 회원 자동 온보딩 프로세스

**요청**:
```json
{
  "user_id": "660e8400-e29b-41d4-a716-446655440001",
  "email": "newuser@example.com",
  "first_name": "길동",
  "last_name": "홍",
  "signup_source": "google",
  "language": "ko"
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "welcome_email_sent": true,
    "profile_initialized": true,
    "recommended_blogs": [
      {
        "id": "blog-001",
        "title": "시작하기",
        "category": "튜토리얼"
      }
    ],
    "crm_synced": true,
    "analytics_tracked": true,
    "onboarding_steps": [
      {
        "step": "complete_profile",
        "completed": false,
        "url": "/profile/edit"
      },
      {
        "step": "first_post",
        "completed": false,
        "url": "/blog/new"
      }
    ]
  }
}
```

---

### 3.2 사용자 활동 분석

**엔드포인트**: `POST /webhook/user/activity`

**설명**: 사용자 행동 추적 및 개인화 추천

**요청**:
```json
{
  "user_id": "660e8400-e29b-41d4-a716-446655440001",
  "action": "view",
  "target_type": "blog",
  "target_id": "blog-123",
  "metadata": {
    "duration_seconds": 145,
    "scroll_depth": 0.8,
    "referrer": "google"
  }
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "activity_recorded": true,
    "analytics_sent": true,
    "recommendations_updated": true,
    "user_profile": {
      "interests": ["Next.js", "React", "TypeScript"],
      "engagement_score": 85,
      "churn_risk": "low"
    },
    "recommendations": [
      {
        "blog_id": "blog-456",
        "title": "React 19 새로운 기능",
        "relevance_score": 0.92
      }
    ]
  }
}
```

---

## 4. 관리자 API

### 4.1 컨텐츠 심사

**엔드포인트**: `POST /webhook/admin/moderate`

**설명**: AI 기반 컨텐츠 자동 심사

**요청**:
```json
{
  "content_id": "blog-123",
  "content_type": "blog",
  "text": "게시글 전체 내용...",
  "author_id": "user-456",
  "check_types": ["profanity", "spam", "copyright", "safety"]
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "approved": false,
    "action": "review",
    "overall_score": 0.65,
    "checks": {
      "profanity": {
        "passed": true,
        "confidence": 0.98
      },
      "spam": {
        "passed": false,
        "confidence": 0.75,
        "reasons": ["과도한 외부 링크"]
      },
      "copyright": {
        "passed": true,
        "confidence": 0.90
      },
      "safety": {
        "passed": true,
        "confidence": 0.95
      }
    },
    "flags": ["potential_spam"],
    "admin_notified": true,
    "review_url": "https://admin.example.com/review/blog-123"
  }
}
```

---

### 4.2 백업 및 리포트

**엔드포인트**: `POST /webhook/admin/backup`

**설명**: 정기 백업 및 리포트 생성

**요청**:
```json
{
  "type": "daily",
  "include": ["database", "media"],
  "report_types": ["analytics", "performance", "content"]
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "backup": {
      "database_backup_url": "s3://backups/db-2025-01-18.sql.gz",
      "media_backup_url": "s3://backups/media-2025-01-18.tar.gz",
      "backup_size_mb": 1234,
      "timestamp": "2025-01-18T00:00:00Z"
    },
    "reports": {
      "analytics": {
        "url": "https://reports.example.com/analytics-2025-01-18.pdf",
        "key_metrics": {
          "daily_active_users": 1234,
          "new_posts": 45,
          "engagement_rate": 0.68
        }
      },
      "performance": {
        "url": "https://reports.example.com/performance-2025-01-18.pdf",
        "avg_response_time_ms": 145,
        "error_rate": 0.002
      }
    },
    "admin_email_sent": true
  }
}
```

---

## 5. 통합 API

### 5.1 검색 인덱싱

**엔드포인트**: `POST /webhook/search/index`

**설명**: 검색 엔진 인덱스 업데이트

**요청**:
```json
{
  "action": "index",
  "document_id": "blog-123",
  "document_type": "blog",
  "data": {
    "title": "Next.js 16 완벽 가이드",
    "content": "게시글 내용...",
    "author": "홍길동",
    "tags": ["Next.js", "React"],
    "category": "개발",
    "published_at": "2025-01-18T12:00:00Z"
  }
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "indexed": true,
    "index_name": "blogs",
    "document_id": "blog-123",
    "object_id": "algolia-obj-123",
    "searchable": true,
    "timestamp": "2025-01-18T12:00:05Z"
  }
}
```

---

### 5.2 소셜 미디어 공유

**엔드포인트**: `POST /webhook/social/share`

**설명**: 자동 소셜 미디어 포스팅

**요청**:
```json
{
  "blog_id": "blog-123",
  "title": "Next.js 16 완벽 가이드",
  "url": "https://example.com/blog/123",
  "excerpt": "Next.js 16의 새로운 기능들을 알아봅니다...",
  "image_url": "https://cdn.example.com/og/image.jpg",
  "platforms": ["twitter", "facebook", "linkedin"],
  "schedule_at": null
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "twitter": {
      "posted": true,
      "tweet_id": "1234567890",
      "url": "https://twitter.com/user/status/1234567890"
    },
    "facebook": {
      "posted": true,
      "post_id": "fb-123456",
      "url": "https://facebook.com/..."
    },
    "linkedin": {
      "posted": false,
      "error": "Rate limit exceeded"
    }
  }
}
```

---

## 6. Webhook 보안

### 요청 서명 검증

모든 요청은 HMAC-SHA256 서명을 포함해야 합니다.

**서명 생성 방법**:
```javascript
const crypto = require('crypto');

const payload = JSON.stringify(requestBody);
const secret = process.env.N8N_WEBHOOK_SECRET;
const signature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

// 요청 헤더에 추가
headers['X-Signature'] = signature;
```

**n8n에서 서명 검증**:
```javascript
// Webhook 노드의 Function 노드에서
const receivedSignature = $node["Webhook"].json.headers['x-signature'];
const payload = JSON.stringify($node["Webhook"].json.body);
const secret = process.env.N8N_WEBHOOK_SECRET;

const expectedSignature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

if (receivedSignature !== expectedSignature) {
  throw new Error('Invalid signature');
}
```

---

## 7. Rate Limiting

API 호출 제한:
- **기본**: 100 req/min per API key
- **버스트**: 300 req/min (5분간)
- **일일 제한**: 10,000 req/day

Rate limit 초과 시 응답:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "API rate limit exceeded",
    "retry_after": 60
  }
}
```

---

## 8. Webhook 재시도 정책

- **재시도 횟수**: 최대 3회
- **재시도 간격**: 1분, 5분, 15분 (exponential backoff)
- **최종 실패 시**: Dead Letter Queue로 이동 + 관리자 알림

---

## 다음 단계

이제 이 명세를 기반으로 n8n 워크플로우 JSON 파일을 생성합니다.
