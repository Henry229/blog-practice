/**
 * Centralized authentication configuration
 * Modify these settings to customize auth behavior across your app
 */

export const authConfig = {
  /**
   * URL redirects after authentication actions
   */
  redirects: {
    afterLogin: '/',
    afterSignup: '/auth/verify-email',
    afterLogout: '/auth/login',
    afterPasswordReset: '/auth/login',
    afterEmailVerification: '/',
  },

  /**
   * Protected routes that require authentication
   * These will redirect to login if user is not authenticated
   */
  protectedRoutes: [
    '/profile',
    '/settings',
  ],

  /**
   * Auth-only routes (login, signup, etc.)
   * Authenticated users will be redirected away from these
   */
  authRoutes: [
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
  ],

  /**
   * OAuth provider configuration
   */
  oauth: {
    providers: ['google'] as const,
    scopes: {
      google: 'email profile',
    },
  },

  /**
   * Email confirmation settings
   */
  email: {
    requireConfirmation: true,
  },

  /**
   * Profile settings
   */
  profile: {
    defaultRole: 'user',
    autoCreateProfile: true,
  },
} as const;

export type AuthConfig = typeof authConfig;
