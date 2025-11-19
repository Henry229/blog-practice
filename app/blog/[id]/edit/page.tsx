import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PageContainer } from '@/components/layout/PageContainer';
import { CenteredContainer } from '@/components/layout/CenteredContainer';
import { BlogForm } from '@/components/blog/BlogForm';
import type { Metadata } from 'next';

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: EditPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: blog } = await supabase
    .from('blogs')
    .select('title')
    .eq('id', id)
    .single();

  return {
    title: blog ? `Edit: ${blog.title}` : 'Edit Post',
    description: 'Edit your blog post',
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;

  // Check authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect if not logged in
  if (!user) {
    redirect(`/auth/login?redirect=/blog/${id}/edit`);
  }

  // Get blog data from Supabase
  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single();

  // If blog not found, show 404
  if (error || !blog) {
    notFound();
  }

  // Check if current user is the author
  if (blog.author_id !== user.id) {
    redirect(`/blog/${id}`); // Redirect to detail page (not author)
  }

  return (
    <PageContainer className="pt-24 pb-8">
      <CenteredContainer className="max-w-[800px]">
        <div className="space-y-6">
          {/* Page Title */}
          <div>
            <h1 className="text-3xl font-bold">Edit Post</h1>
            <p className="text-muted-foreground mt-2">Update your blog post</p>
          </div>

          {/* Blog Form */}
          <BlogForm
            mode="edit"
            initialData={{
              id: blog.id,
              title: blog.title,
              content: blog.content,
            }}
          />
        </div>
      </CenteredContainer>
    </PageContainer>
  );
}
