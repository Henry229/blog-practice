'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { createBlog, updateBlog } from '@/app/actions/blog';
import { Loader2 } from 'lucide-react';

interface BlogFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    id: string;
    title: string;
    content: string;
  };
}

export function BlogForm({ mode, initialData }: BlogFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate form
  const validate = () => {
    if (!title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!content.trim()) {
      setError('Content is required');
      return false;
    }
    setError('');
    return true;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      if (mode === 'create') {
        // Create new blog
        const result = await createBlog(title, content);

        if (result.error) {
          setError(result.error);
        } else if (result.id) {
          // Success: navigate to new post
          router.push(`/blog/${result.id}`);
        }
      } else {
        // Update existing blog
        const result = await updateBlog(initialData!.id, title, content);

        if (result.error) {
          setError(result.error);
        } else {
          // Success: navigate back to post
          router.push(`/blog/${initialData!.id}`);
        }
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (mode === 'create') {
      router.push('/');
    } else {
      router.push(`/blog/${initialData!.id}`);
    }
  };

  return (
    <Card>
      <CardContent className='pt-6'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Title Input */}
          <div className='space-y-2'>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              type='text'
              placeholder='Enter post title...'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Content Textarea */}
          <div className='space-y-2'>
            <Label htmlFor='content'>Content</Label>
            <Textarea
              id='content'
              placeholder='Write your post content...'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              rows={15}
              className='resize-none'
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div
              className='p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md'
              role='alert'
            >
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className='flex items-center justify-between gap-4'>
            <Button
              type='button'
              variant='outline'
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : mode === 'create' ? (
                'Create Post'
              ) : (
                'Update Post'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
