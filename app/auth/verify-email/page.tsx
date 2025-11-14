import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Mail className="h-6 w-6 text-blue-600" />
            <CardTitle>이메일을 확인하세요</CardTitle>
          </div>
          <CardDescription>
            가입을 완료하려면 이메일 인증이 필요합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            가입하신 이메일 주소로 인증 링크를 보내드렸습니다.
            이메일을 확인하시고 링크를 클릭하여 계정을 활성화하세요.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>팁:</strong> 이메일이 보이지 않나요? 스팸 폴더를 확인해보세요.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/auth/login" className="w-full">
            <Button variant="outline" className="w-full">
              로그인으로 돌아가기
            </Button>
          </Link>
          <p className="text-xs text-center text-gray-500">
            이메일 인증 후 로그인할 수 있습니다
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
