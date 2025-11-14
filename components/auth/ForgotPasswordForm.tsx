'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { resetPasswordRequest } from '@/app/actions/auth';
import { Loader2, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');

    const result = await resetPasswordRequest(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <CardTitle>이메일이 전송되었습니다</CardTitle>
          </div>
          <CardDescription>
            비밀번호 재설정 링크를 이메일로 보내드렸습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            이메일을 확인하시고 링크를 클릭하여 비밀번호를 재설정하세요.
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/auth/login" className="w-full">
            <Button variant="outline" className="w-full">
              로그인으로 돌아가기
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>비밀번호 찾기</CardTitle>
        <CardDescription>
          가입하신 이메일 주소를 입력하세요
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

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

          <p className="text-sm text-gray-600">
            비밀번호 재설정 링크를 이메일로 보내드립니다.
          </p>
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
                전송 중...
              </>
            ) : (
              '재설정 링크 보내기'
            )}
          </Button>

          <Link href="/auth/login" className="w-full">
            <Button variant="ghost" className="w-full">
              로그인으로 돌아가기
            </Button>
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
