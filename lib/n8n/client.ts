import { env } from '@/lib/env';

export type N8nResponse<T = unknown> = {
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
  private async call<T = unknown>(
    endpoint: string,
    data: Record<string, unknown>,
    options?: RequestInit
  ): Promise<N8nResponse<T>> {
    // n8n이 설정되지 않았으면 에러 반환
    if (!this.baseUrl || !this.apiKey) {
      console.warn('n8n backend is not configured');
      return {
        success: false,
        error: {
          code: 'N8N_NOT_CONFIGURED',
          message: 'n8n backend is not configured. Add N8N_BACKEND_URL and N8N_API_KEY to .env.local',
        },
      };
    }

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
        meta_description?: string;
        meta_keywords?: string;
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
        errors: Array<{
          type: string;
          message: string;
          position?: number;
        }>;
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
    template_data: Record<string, unknown>;
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
    metadata?: Record<string, unknown>;
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
}

// Export singleton instance
export const n8n = new N8nClient();
