import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PageContainer } from '@/components/layout/PageContainer';
import { CenteredContainer } from '@/components/layout/CenteredContainer';
import { BlogForm } from '@/components/blog/BlogForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Post | SimpleBlog',
  description: 'Create a new blog post',
};

export default async function NewPostPage() {
  // Check authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect if not logged in
  if (!user) {
    redirect('/auth/login?redirect=/blog/new');
  }

  return (
    <PageContainer className='pt-24 pb-8'>
      <CenteredContainer className='max-w-[800px]'>
        <div className='space-y-6'>
          {/* Page Title */}
          <div>
            <h1 className='text-3xl font-bold'>New Post</h1>
            <p className='text-muted-foreground mt-2'>
              Share your thoughts with the community
            </p>
          </div>

          {/* Blog Form */}
          <BlogForm mode='create' />
        </div>
      </CenteredContainer>
    </PageContainer>
  );
}
