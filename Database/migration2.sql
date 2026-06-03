-- ==========================================
-- HERO SLIDER SETUP (Migration 2)
-- ==========================================

-- 1. CREATE HERO SLIDERS TABLE
CREATE TABLE IF NOT EXISTS public.hero_sliders (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "desktopImage" TEXT NOT NULL,
    "mobileImage" TEXT NOT NULL,
    "primaryCtaText" TEXT,
    "primaryCtaLink" TEXT,
    "secondaryCtaText" TEXT,
    "secondaryCtaLink" TEXT,
    "secondaryInterest" TEXT,
    "secondaryType" TEXT CHECK ("secondaryType" IN ('service', 'product', 'general')) DEFAULT 'service',
    "order" INTEGER DEFAULT 0,
    "isActive" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ENABLE RLS
ALTER TABLE public.hero_sliders ENABLE ROW LEVEL SECURITY;

-- 3. POLICIES
DROP POLICY IF EXISTS "Public read access for active sliders" ON public.hero_sliders;
DROP POLICY IF EXISTS "Admins have full access" ON public.hero_sliders;

-- Allow public to see active sliders
CREATE POLICY "Public read access for active sliders" ON public.hero_sliders 
    FOR SELECT USING ("isActive" = true);

-- Allow authenticated admins to do everything (linked to profiles table from migration 1)
CREATE POLICY "Admins have full access" ON public.hero_sliders 
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 4. UPDATE UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_hero_sliders_updated_at ON public.hero_sliders;
CREATE TRIGGER update_hero_sliders_updated_at
    BEFORE UPDATE ON public.hero_sliders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
