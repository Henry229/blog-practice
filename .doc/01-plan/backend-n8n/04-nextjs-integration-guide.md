# Next.js와 n8n 백엔드 통합 가이드

## 개요

Next.js 애플리케이션에서 n8n 백엔드 API를 호출하는 방법과 코드 구현 가이드입니다.

## 1. 환경 설정

### 환경 변수 추가

`.env.local`에 n8n 관련 설정 추가:

```env
# n8n Backend API
N8N_BACKEND_URL=https://n8n.yourdomain.com/webhook
N8N_API_KEY=your-secret-api-key
```

### 환경 변수 타입 정의

`lib/env.ts` 업데이트:

```typescript
export const env = {
  // ... 기존 환경 변수

  // n8n Backend
  n8nBackendUrl: process.env.N8N_BACKEND_URL!,
  n8nApiKey: process.env.N8N_API_KEY!,
} as const;

// 환경 변수 검증
if (!env.n8nBackendUrl || !env.n8nApiKey) {
  console.warn('⚠️  n8n backend configuration is missing');
}
```

---

## 2. n8n API 클라이언트 생성

### API 클라이언트 파일

`lib/n8n/client.ts` 생성:

```typescript
import { env } from '@/lib/env';

export type N8nResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  metadata?: {
    timestamp: string;
    workflow_id: string;
    execution_time_ms: number;
  };
};

class N8nClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = env.n8nBackendUrl;
    this.apiKey = env.n8nApiKey;
  }

  /**
   * Generic n8n API call
   */
  private async call<T = any>(
    endpoint: string,
    data: any,
    options?: RequestInit
  ): Promise<N8nResponse<T>> {
    const url = `${this.baseUrl}/${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          ...options?.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: result.error?.code || 'UNKNOWN_ERROR',
            message: result.error?.message || 'An error occurred',
          },
        };
      }

      return result;
    } catch (error) {
      console.error('n8n API call failed:', error);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error',
        },
      };
    }
  }

  /**
   * Blog API Methods
   */

  async publishBlog(params: {
    blog_id: string;
    title: string;
    content: string;
    author_id: string;
    publish_immediately?: boolean;
    notify_subscribers?: boolean;
    social_share?: {
      twitter?: boolean;
      facebook?: boolean;
    };
  }) {
    return this.call<{
      blog_id: string;
      published_at: string;
      notifications: {
        email_sent: number;
        email_failed: number;
      };
      seo: {
        score: number;
        meta_generated: boolean;
      };
      social?: {
        twitter_posted?: boolean;
        twitter_url?: string;
      };
      images_processed: number;
    }>('blog/publish/v1', params);
  }

  async analyzeBlog(params: {
    title: string;
    content: string;
    language?: string;
    analysis_type?: string[];
  }) {
    return this.call<{
      readability: {
        score: number;
        grade_level: string;
        avg_sentence_length: number;
        suggestions: string[];
      };
      seo: {
        score: number;
        keyword_density: number;
        meta_description_ok: boolean;
        suggestions: string[];
      };
      grammar: {
        errors: any[];
        warnings: Array<{
          type: string;
          position: number;
          suggestion: string;
        }>;
      };
      sentiment: {
        score: number;
        tone: string;
        emotion: string;
      };
      tags: {
        suggested: string[];
        confidence: number[];
      };
      category: {
        suggested: string;
        confidence: number;
      };
    }>('blog/analyze/v1', params);
  }

  async processMedia(params: {
    image_url: string;
    blog_id: string;
    sizes?: string[];
    optimize?: boolean;
    convert_to_webp?: boolean;
  }) {
    return this.call<{
      original: {
        url: string;
        width: number;
        height: number;
        size_kb: number;
        format: string;
      };
      processed: {
        [key: string]: {
          url: string;
          width: number;
          height: number;
          size_kb: number;
        };
      };
      metadata: {
        exif_removed: boolean;
        color_space: string;
        compression_ratio: number;
      };
    }>('media/process/v1', params);
  }

  /**
   * Notification API Methods
   */

  async sendEmailNotification(params: {
    type: 'new_post' | 'comment' | 'mention' | 'newsletter';
    recipient_ids: string[];
    template_data: any;
    priority?: 'high' | 'normal' | 'low';
    schedule_at?: string;
  }) {
    return this.call<{
      queued: number;
      sent: number;
      failed: number;
      queue_id: string;
      estimated_delivery: string;
      details: Array<{
        recipient_id: string;
        email: string;
        status: string;
        message_id: string;
      }>;
    }>('notification/email/v1', params);
  }

  async sendRealtimeNotification(params: {
    user_id: string;
    type: 'comment' | 'like' | 'follow';
    message: string;
    link: string;
    icon?: string;
    read?: boolean;
  }) {
    return this.call<{
      notification_id: string;
      delivered: boolean;
      user_online: boolean;
      stored_in_db: boolean;
      timestamp: string;
    }>('notification/realtime/v1', params);
  }

  /**
   * User API Methods
   */

  async onboardUser(params: {
    user_id: string;
    email: string;
    first_name: string;
    last_name?: string;
    signup_source: 'google' | 'email';
    language?: string;
  }) {
    return this.call<{
      welcome_email_sent: boolean;
      profile_initialized: boolean;
      recommended_blogs: Array<{
        id: string;
        title: string;
        category: string;
      }>;
      crm_synced: boolean;
      analytics_tracked: boolean;
      onboarding_steps: Array<{
        step: string;
        completed: boolean;
        url: string;
      }>;
    }>('user/onboarding/v1', params);
  }

  async trackUserActivity(params: {
    user_id: string;
    action: 'view' | 'like' | 'comment' | 'share';
    target_type: 'blog' | 'comment' | 'user';
    target_id: string;
    metadata?: any;
  }) {
    return this.call<{
      activity_recorded: boolean;
      analytics_sent: boolean;
      recommendations_updated: boolean;
      user_profile: {
        interests: string[];
        engagement_score: number;
        churn_risk: 'low' | 'medium' | 'high';
      };
      recommendations: Array<{
        blog_id: string;
        title: string;
        relevance_score: number;
      }>;
    }>('user/activity/v1', params);
  }

  /**
   * Admin API Methods
   */

  async moderateContent(params: {
    content_id: string;
    content_type: 'blog' | 'comment';
    text: string;
    author_id: string;
    check_types?: string[];
  }) {
    return this.call<{
      approved: boolean;
      action: 'approve' | 'review' | 'reject';
      overall_score: number;
      checks: {
        [key: string]: {
          passed: boolean;
          confidence: number;
          reasons?: string[];
        };
      };
      flags: string[];
      admin_notified: boolean;
      review_url?: string;
    }>('admin/moderate/v1', params);
  }

  /**
   * Integration API Methods
   */

  async updateSearchIndex(params: {
    action: 'index' | 'update' | 'delete';
    document_id: string;
    document_type: 'blog' | 'comment' | 'user';
    data?: any;
  }) {
    return this.call<{
      indexed: boolean;
      index_name: string;
      document_id: string;
      object_id: string;
      searchable: boolean;
      timestamp: string;
    }>('search/index/v1', params);
  }

  async shareToSocial(params: {
    blog_id: string;
    title: string;
    url: string;
    excerpt: string;
    image_url?: string;
    platforms: string[];
    schedule_at?: string;
  }) {
    return this.call<{
      [platform: string]: {
        posted: boolean;
        post_id?: string;
        url?: string;
        error?: string;
      };
    }>('social/share/v1', params);
  }
}

// Export singleton instance
export const n8n = new N8nClient();
```

---

## 3. Server Actions 업데이트

### 블로그 발행 Server Action

`app/actions/blog.ts` 업데이트:

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { n8n } from '@/lib/n8n/client';

export async function createBlog(title: string, content: string) {
  const supabase = await createClient();

  // 사용자 인증 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: '로그인이 필요합니다' };
  }

  // 1. Supabase에 블로그 게시글 생성 (초안 상태)
  const { data, error } = await supabase
    .from('blogs')
    .insert({
      title,
      content,
      author_id: user.id,
      status: 'draft', // 초안 상태로 생성
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating blog:', error);
    return { error: error.message || '게시글 생성에 실패했습니다' };
  }

  // 2. n8n 백엔드로 발행 요청 (비동기 처리)
  const publishResult = await n8n.publishBlog({
    blog_id: data.id,
    title: data.title,
    content: data.content,
    author_id: user.id,
    publish_immediately: true,
    notify_subscribers: true,
    social_share: {
      twitter: false, // 필요시 true로 변경
      facebook: false,
    },
  });

  if (!publishResult.success) {
    console.error('n8n publish failed:', publishResult.error);
    // n8n 실패해도 게시글은 생성됨 (초안 상태)
    return {
      id: data.id,
      warning: 'n8n 후처리 작업이 실패했습니다. 게시글은 초안으로 저장되었습니다.',
    };
  }

  // 3. 캐시 재검증
  revalidatePath('/');
  revalidatePath('/blog');

  return {
    id: data.id,
    published: true,
    notifications_sent: publishResult.data?.notifications.email_sent,
  };
}

/**
 * 컨텐츠 분석 기능 추가
 */
export async function analyzeBlogContent(title: string, content: string) {
  const result = await n8n.analyzeBlog({
    title,
    content,
    language: 'ko',
    analysis_type: ['seo', 'readability', 'grammar', 'sentiment'],
  });

  if (!result.success) {
    return { error: result.error?.message };
  }

  return { analysis: result.data };
}
```

### 회원가입 Server Action

`app/actions/auth.ts` 업데이트:

```typescript
// ... 기존 import
import { n8n } from '@/lib/n8n/client';

export async function signup(
  formData: FormData,
  redirectTo?: string
): Promise<AuthResult> {
  // ... 기존 회원가입 로직

  // 회원가입 성공 후 온보딩 워크플로우 실행
  if (authData.user) {
    // 비동기로 온보딩 실행 (결과를 기다리지 않음)
    n8n.onboardUser({
      user_id: authData.user.id,
      email: email,
      first_name: firstName,
      last_name: lastName,
      signup_source: 'email',
      language: 'ko',
    }).catch((error) => {
      console.error('Onboarding workflow failed:', error);
      // 온보딩 실패해도 회원가입은 성공
    });

    // 프로필 생성 로직
    // ...
  }

  return { redirect: redirectTo || authConfig.redirects.afterSignup };
}
```

---

## 4. 클라이언트 컴포넌트 예시

### 블로그 작성 폼 with 실시간 분석

`components/blog/NewPostForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBlog, analyzeBlogContent } from '@/app/actions/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function NewPostForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 실시간 컨텐츠 분석
  const handleAnalyze = async () => {
    if (!title || !content) return;

    setIsAnalyzing(true);
    const result = await analyzeBlogContent(title, content);

    if (result.error) {
      alert('분석 실패: ' + result.error);
    } else {
      setAnalysis(result.analysis);
    }

    setIsAnalyzing(false);
  };

  // 게시글 발행
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await createBlog(title, content);

    if (result.error) {
      alert('오류: ' + result.error);
      setIsSubmitting(false);
      return;
    }

    if (result.warning) {
      alert('경고: ' + result.warning);
    }

    router.push(`/blog/${result.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <Textarea
          placeholder="내용을 입력하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={15}
          required
        />
      </div>

      {/* 실시간 분석 결과 표시 */}
      {analysis && (
        <div className="border rounded-lg p-4 space-y-2">
          <h3 className="font-semibold">컨텐츠 분석 결과</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">가독성 점수</p>
              <p className="text-2xl font-bold">{analysis.readability?.score}/100</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">SEO 점수</p>
              <p className="text-2xl font-bold">{analysis.seo?.score}/100</p>
            </div>
          </div>

          {analysis.seo?.suggestions && (
            <div>
              <p className="text-sm font-semibold">SEO 개선 제안</p>
              <ul className="list-disc list-inside text-sm">
                {analysis.seo.suggestions.map((suggestion: string, i: number) => (
                  <li key={i}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          {analysis.tags?.suggested && (
            <div>
              <p className="text-sm font-semibold">추천 태그</p>
              <div className="flex gap-2 flex-wrap">
                {analysis.tags.suggested.map((tag: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleAnalyze}
          disabled={isAnalyzing || !title || !content}
        >
          {isAnalyzing ? '분석 중...' : 'AI 분석'}
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '발행 중...' : '발행'}
        </Button>
      </div>
    </form>
  );
}
```

---

## 5. 에러 처리 및 재시도

### Retry 유틸리티

`lib/n8n/retry.ts`:

```typescript
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// 사용 예시
const result = await retryWithBackoff(
  () => n8n.publishBlog(params),
  3,
  1000
);
```

---

## 6. 테스트

### API 클라이언트 테스트

`__tests__/n8n-client.test.ts`:

```typescript
import { n8n } from '@/lib/n8n/client';

describe('n8n Client', () => {
  it('should publish blog successfully', async () => {
    const result = await n8n.publishBlog({
      blog_id: 'test-123',
      title: 'Test Blog',
      content: '<p>Test content</p>',
      author_id: 'user-123',
    });

    expect(result.success).toBe(true);
    expect(result.data?.blog_id).toBe('test-123');
  });

  it('should analyze blog content', async () => {
    const result = await n8n.analyzeBlog({
      title: 'Test Blog',
      content: 'Test content for analysis',
      language: 'ko',
    });

    expect(result.success).toBe(true);
    expect(result.data?.readability).toBeDefined();
    expect(result.data?.seo).toBeDefined();
  });

  it('should handle errors gracefully', async () => {
    const result = await n8n.publishBlog({
      blog_id: '',
      title: '',
      content: '',
      author_id: '',
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('VALIDATION_ERROR');
  });
});
```

---

## 7. 성능 최적화

### 병렬 처리

여러 n8n API를 동시에 호출:

```typescript
const [publishResult, analyzeResult] = await Promise.all([
  n8n.publishBlog(publishParams),
  n8n.analyzeBlog(analyzeParams),
]);
```

### 백그라운드 처리

즉시 응답이 필요 없는 작업은 백그라운드에서:

```typescript
// 응답을 기다리지 않고 실행
n8n.sendEmailNotification(params).catch(console.error);

// 사용자에게 즉시 응답
return { success: true };
```

---

## 8. 모니터링 및 로깅

### 로깅 유틸리티

`lib/n8n/logger.ts`:

```typescript
export function logN8nCall(
  endpoint: string,
  params: any,
  result: any,
  duration: number
) {
  console.log('[n8n]', {
    endpoint,
    success: result.success,
    duration_ms: duration,
    error: result.error,
    workflow_id: result.metadata?.workflow_id,
  });

  // 프로덕션: 외부 로깅 서비스로 전송
  // sendToSentry(), sendToDatadog(), etc.
}
```

---

## 다음 단계

1. ✅ 백엔드 아키텍처 설계
2. ✅ API 엔드포인트 명세
3. ✅ n8n 워크플로우 JSON 생성
4. ✅ Next.js 통합 가이드
5. [ ] 추가 워크플로우 JSON 파일 생성
6. [ ] 로컬 환경에서 테스트
7. [ ] 프로덕션 배포
