-- ==========================================
-- BLOG POSTS TABLE SETUP (Migration 5)
-- ==========================================

-- 1. CREATE BLOG_POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL DEFAULT 'Water Quality',
    summary TEXT,
    content TEXT,
    image TEXT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ, 
   
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ENABLE RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- 3. RLS POLICIES

-- Allow public to see only published blogs
DROP POLICY IF EXISTS "Blogs are viewable by everyone" ON public.blog_posts;
CREATE POLICY "Blogs are viewable by everyone" ON public.blog_posts 
    FOR SELECT USING (status = 'published');

-- Allow authenticated admins full access (using the profiles table from Migration 1)
DROP POLICY IF EXISTS "Admins have full access to blogs" ON public.blog_posts;
CREATE POLICY "Admins have full access to blogs" ON public.blog_posts 
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 4. UPDATE UPDATED_AT TRIGGER
-- Uses the function created in Migration 2
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. INDEXING FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts(created_at DESC);

-- 6. RELOAD SCHEMA
NOTIFY pgrst, 'reload schema';

-- COMMENT: This table links to the profiles table. 
-- Ensure that when creating a blog from the UI, the current user's ID 
-- is passed as author_id.
