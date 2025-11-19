-- Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- SEO fields (n8n will populate these)
    meta_description TEXT,
    meta_keywords TEXT,

    -- Status and publishing
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on author_id for faster queries
CREATE INDEX idx_blogs_author_id ON public.blogs(author_id);

-- Create index on status for filtering
CREATE INDEX idx_blogs_status ON public.blogs(status);

-- Create index on published_at for sorting
CREATE INDEX idx_blogs_published_at ON public.blogs(published_at DESC);

-- Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published blogs
CREATE POLICY "Published blogs are viewable by everyone"
ON public.blogs
FOR SELECT
USING (status = 'published');

-- Policy: Users can view their own drafts
CREATE POLICY "Users can view their own blogs"
ON public.blogs
FOR SELECT
USING (auth.uid() = author_id);

-- Policy: Users can insert their own blogs
CREATE POLICY "Users can create their own blogs"
ON public.blogs
FOR INSERT
WITH CHECK (auth.uid() = author_id);

-- Policy: Users can update their own blogs
CREATE POLICY "Users can update their own blogs"
ON public.blogs
FOR UPDATE
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Policy: Users can delete their own blogs
CREATE POLICY "Users can delete their own blogs"
ON public.blogs
FOR DELETE
USING (auth.uid() = author_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.blogs
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Add comment
COMMENT ON TABLE public.blogs IS 'Blog posts with SEO metadata';
