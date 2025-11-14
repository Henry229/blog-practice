/**
 * Environment variable validation and configuration
 * Validates required Supabase environment variables on startup
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SITE_URL',
] as const;

type EnvVar = (typeof requiredEnvVars)[number];

function validateEnv(): void {
  const missing: EnvVar[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n\n` +
      'Please add them to your .env.local file.'
    );
  }
}

// Validate on module load
if (typeof window === 'undefined') {
  // Only validate on server-side to avoid errors during build
  try {
    validateEnv();
  } catch (error) {
    console.error(error);
    // Don't throw during build time
    if (process.env.NODE_ENV !== 'production') {
      console.warn('⚠️  Environment validation failed. Please configure .env.local');
    }
  }
}

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL!,
} as const;
