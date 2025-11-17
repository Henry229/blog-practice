'use server';

import { createClient } from '@/lib/supabase/server';
import { authConfig } from '@/lib/auth.config';
import { env } from '@/lib/env';
import { redirect } from 'next/navigation';

type AuthResult = {
  error?: string;
  redirect?: string;
};

/**
 * Email/Password login
 */
export async function login(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: '이메일과 비밀번호를 입력해주세요' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message || '로그인에 실패했습니다' };
  }

  return { redirect: authConfig.redirects.afterLogin };
}

/**
 * Email/Password signup with profile creation
 */
export async function signup(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const mobile = formData.get('mobile') as string;

  if (!email || !password || !firstName || !lastName) {
    return { error: '필수 항목을 모두 입력해주세요' };
  }

  if (password.length < 6) {
    return { error: '비밀번호는 최소 6자 이상이어야 합니다' };
  }

  const supabase = await createClient();

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${env.siteUrl}/auth/callback`,
      data: {
        first_name: firstName,
        last_name: lastName,
        mobile: mobile || null,
      },
    },
  });

  if (authError) {
    return { error: authError.message || '회원가입에 실패했습니다' };
  }

  // Create profile if user was created and auto-profile is enabled
  if (authData.user && authConfig.profile.autoCreateProfile) {
    const { error: profileError } = await supabase.from('profiles').insert({
      user_id: authData.user.id,
      email: email,
      first_name: firstName,
      last_name: lastName,
      mobile: mobile || null,
      role: authConfig.profile.defaultRole,
    });

    if (profileError) {
      console.error('Profile creation failed:', profileError);
      // Don't fail signup if profile creation fails
      // The profile can be created later via trigger or manually
    }
  }

  return { redirect: authConfig.redirects.afterSignup };
}

/**
 * Google OAuth login
 */
export async function loginWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${env.siteUrl}/auth/callback`,
      queryParams: {
        access_type: 'offline',
      },
    },
  });

  if (error) {
    console.error('Google login error:', error);
    return;
  }

  if (data.url) {
    redirect(data.url);
  }
}

/**
 * Password reset request (send email)
 */
export async function resetPasswordRequest(
  formData: FormData
): Promise<AuthResult> {
  const email = formData.get('email') as string;

  if (!email) {
    return { error: '이메일을 입력해주세요' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${env.siteUrl}/auth/reset-password`,
  });

  if (error) {
    return { error: error.message || '비밀번호 재설정 요청에 실패했습니다' };
  }

  return {};
}

/**
 * Reset password (with token from email)
 */
export async function resetPassword(formData: FormData): Promise<AuthResult> {
  const password = formData.get('password') as string;

  if (!password) {
    return { error: '새 비밀번호를 입력해주세요' };
  }

  if (password.length < 6) {
    return { error: '비밀번호는 최소 6자 이상이어야 합니다' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { error: error.message || '비밀번호 변경에 실패했습니다' };
  }

  return { redirect: authConfig.redirects.afterPasswordReset };
}

/**
 * Sign out
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(authConfig.redirects.afterLogout);
}

/**
 * Get current user
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get user profile
 */
export async function getUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return profile;
}
