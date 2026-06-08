-- ==========================================
-- BLOGS TABLE SETUP (Migration 4)
-- ==========================================

-- 1. CREATE BLOGS TABLE
CREATE TABLE IF NOT EXISTS public.blogs (
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
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- 3. RLS POLICIES

-- Allow public to see only published blogs
DROP POLICY IF EXISTS "Blogs are viewable by everyone" ON public.blogs;
CREATE POLICY "Blogs are viewable by everyone" ON public.blogs 
    FOR SELECT USING (status = 'published');

-- Allow authenticated admins full access (using the profiles table from Migration 1)
DROP POLICY IF EXISTS "Admins have full access to blogs" ON public.blogs;
CREATE POLICY "Admins have full access to blogs" ON public.blogs 
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
DROP TRIGGER IF EXISTS update_blogs_updated_at ON public.blogs;
CREATE TRIGGER update_blogs_updated_at
    BEFORE UPDATE ON public.blogs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. INDEXING FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON public.blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_author ON public.blogs(author_id);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON public.blogs(created_at DESC);

-- 6. RELOAD SCHEMA
NOTIFY pgrst, 'reload schema';

-- COMMENT: This table links to the profiles table. 
-- Ensure that when creating a blog from the UI, the current user's ID 
-- is passed as author_id.

-- ==========================================
-- STORAGE SETUP FOR BLOGS
-- ==========================================

-- 1. Create Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blogs', 'blogs', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies
-- PUBLIC READ ACCESS
DROP POLICY IF EXISTS "Public Read Access Blogs" ON storage.objects;
CREATE POLICY "Public Read Access Blogs" ON storage.objects
    FOR SELECT USING (bucket_id = 'blogs');

-- ADMIN FULL ACCESS
DROP POLICY IF EXISTS "Admin Full Access Blogs" ON storage.objects;
CREATE POLICY "Admin Full Access Blogs" ON storage.objects
    FOR ALL TO authenticated
    USING (
        bucket_id = 'blogs' AND
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        bucket_id = 'blogs' AND
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );
