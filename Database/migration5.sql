-- ==========================================
-- FAQS TABLE SETUP (Migration 5)
-- ==========================================

-- 1. CREATE FAQS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('General', 'Products', 'Services', 'AMC', 'Technical Questions')),
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ENABLE RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- 3. RLS POLICIES

-- Allow public to see only published FAQs
DROP POLICY IF EXISTS "FAQs are viewable by everyone" ON public.faqs;
CREATE POLICY "FAQs are viewable by everyone" ON public.faqs 
    FOR SELECT USING (status = 'published');

-- Allow authenticated admins full access
DROP POLICY IF EXISTS "Admins have full access to faqs" ON public.faqs;
CREATE POLICY "Admins have full access to faqs" ON public.faqs 
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
DROP TRIGGER IF EXISTS update_faqs_updated_at ON public.faqs;
CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON public.faqs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. INDEXING FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_faqs_category ON public.faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_status ON public.faqs(status);
CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON public.faqs(display_order);

-- 6. RELOAD SCHEMA
NOTIFY pgrst, 'reload schema';
