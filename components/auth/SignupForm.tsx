'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signup } from '@/app/actions/auth';
import { Loader2 } from 'lucide-react';

export function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');

    const result = await signup(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push(result.redirect || '/auth/verify-email');
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
        <CardDescription>
          새 계정을 만들어 시작하세요
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">이름</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                autoComplete="given-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">성</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              minLength={6}
            />
            <p className="text-xs text-gray-500">
              최소 6자 이상이어야 합니다
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">휴대전화 (선택)</Label>
            <Input
              id="mobile"
              name="mobile"
              type="tel"
              autoComplete="tel"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                가입 중...
              </>
            ) : (
              '회원가입'
            )}
          </Button>

          <p className="text-sm text-center text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              로그인
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
