import { LoginForm } from '@/components/auth/LoginForm';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-4">
        <LoginForm />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-50 px-2 text-gray-500">또는</span>
          </div>
        </div>

        <GoogleLoginButton />
      </div>
    </div>
  );
}
