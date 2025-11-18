import { Suspense } from 'react';
import { SignupForm } from '@/components/auth/SignupForm';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-4">
        <Suspense fallback={<div>로딩 중...</div>}>
          <SignupForm />
        </Suspense>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-50 px-2 text-gray-500">또는</span>
          </div>
        </div>

        <Suspense fallback={<div>로딩 중...</div>}>
          <GoogleLoginButton />
        </Suspense>
      </div>
    </div>
  );
}
