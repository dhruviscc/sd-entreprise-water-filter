-- ==========================================
-- REVIEWS TABLE SETUP (Migration 7)
-- ==========================================

-- 1. CREATE REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    content TEXT,
    type TEXT DEFAULT 'text' CHECK (type IN ('text', 'video')),
    video_url TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ENABLE RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 3. RLS POLICIES

-- Allow public to see only active reviews
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews 
    FOR SELECT USING (is_active = true);

-- Allow authenticated admins full access
DROP POLICY IF EXISTS "Admins have full access to reviews" ON public.reviews;
CREATE POLICY "Admins have full access to reviews" ON public.reviews 
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
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. INDEXING FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_reviews_type ON public.reviews(type);
CREATE INDEX IF NOT EXISTS idx_reviews_is_active ON public.reviews(is_active);
CREATE INDEX IF NOT EXISTS idx_reviews_display_order ON public.reviews(display_order);

-- 6. RELOAD SCHEMA
NOTIFY pgrst, 'reload schema';
